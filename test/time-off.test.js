const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createApp } = require('../server');
const timeOffRegions = require('../public/time-off-regions');

async function startServer(t) {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.textContent = '';
    this.className = '';
    this.value = '';
    this.children = [];
    this.listeners = {};
  }

  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }

  add(option) {
    this.children.push(option);
  }

  append(...nodes) {
    this.children.push(...nodes);
  }

  replaceChildren(...nodes) {
    this.children = nodes;
  }

  setAttribute() {}
}

function loadTimeOffPage(fetchImpl) {
  const ids = ['balance-days', 'leave-type', 'request-form', 'region-select', 'start-date', 'end-date',
    'date-preview', 'date-format', 'policy-title', 'policy-holidays', 'policy-points', 'request-message'];
  const elements = Object.fromEntries(ids.map((id) => [id, new FakeElement()]));
  const form = elements['request-form'];
  const fields = { leaveType: elements['leave-type'], startDate: elements['start-date'], endDate: elements['end-date'], note: new FakeElement('textarea') };
  form.resetCount = 0;
  form.reset = () => {
    form.resetCount += 1;
    for (const field of Object.values(fields)) field.value = '';
  };
  elements['region-select'].add = function add(option) {
    this.children.push(option);
  };

  const context = {
    window: {},
    document: {
      body: { dataset: { page: 'time-off' } },
      querySelector: (selector) => elements[selector.split(',')[0].trim().replace('#', '')],
      createElement: (tagName) => new FakeElement(tagName)
    },
    Option: class Option {
      constructor(text, value) {
        this.text = text;
        this.value = value;
      }
    },
    FormData: class FormData {
      constructor(target) {
        assert.equal(target, form, 'FormData should read the request form');
        this.entries = Object.entries(fields).map(([name, field]) => [name, field.value]);
      }

      [Symbol.iterator]() {
        return this.entries[Symbol.iterator]();
      }
    },
    fetch: fetchImpl,
    setTimeout
  };
  context.window.TimeOffRegions = timeOffRegions;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/app.js'), 'utf8'), context);
  return { elements, fields, form };
}

async function settle() {
  for (let index = 0; index < 10; index += 1) await new Promise((resolve) => setImmediate(resolve));
}

async function submit(form) {
  const event = { currentTarget: form, preventDefault() {} };
  const pending = form.listeners.submit.map((listener) => listener(event));
  event.currentTarget = null;
  await Promise.all(pending);
}

test('regional demo data covers United States, United Kingdom and India', () => {
  const { regions, defaultRegion } = timeOffRegions;
  assert.deepEqual(Object.values(regions).map((region) => region.label), ['United States', 'United Kingdom', 'India']);
  assert.equal(defaultRegion, 'US');
  for (const region of Object.values(regions)) {
    assert.ok(region.policy.title);
    assert.ok(region.policy.holidayCalendar);
    assert.ok(region.policy.points.length >= 2);
  }
});

test('dates are formatted per region from ISO values', () => {
  const { formatDate } = timeOffRegions;
  assert.equal(formatDate('2026-08-10', 'US'), '08/10/2026');
  assert.equal(formatDate('2026-08-10', 'UK'), '10/08/2026');
  assert.equal(formatDate('2026-08-10', 'IN'), '10-08-2026');
  assert.equal(formatDate('', 'US'), '');
  assert.equal(formatDate('2026-08-10', 'FR'), '');
});

test('Time Off page links its region assets and labels demo data', async (t) => {
  const baseUrl = await startServer(t);
  const html = await (await fetch(`${baseUrl}/time-off`)).text();
  assert.match(html, /id="region-select"/);
  assert.match(html, /Demo data/);
  assert.match(html, /href="\/time-off.css"/);
  assert.match(html, /src="\/time-off-regions.js"/);
  assert.ok(html.indexOf('/time-off-regions.js') < html.indexOf('/app.js'), 'region data loads before app.js');

  for (const asset of ['/time-off.css', '/time-off-regions.js']) {
    assert.equal((await fetch(`${baseUrl}${asset}`)).status, 200, `${asset} should be served`);
  }
});

test('switching region updates the policy summary and date format', async () => {
  const { elements } = loadTimeOffPage(async () => ({
    ok: true,
    json: async () => ({ balanceDays: 18, leaveTypes: [{ name: 'Vacation' }, { name: 'Sick leave' }, { name: 'Personal day' }] })
  }));
  await settle();

  assert.equal(elements['balance-days'].textContent, 18);
  assert.deepEqual(elements['leave-type'].children.map((option) => option.value), ['Vacation', 'Sick leave', 'Personal day']);
  assert.deepEqual(elements['region-select'].children.map((option) => option.text), ['United States', 'United Kingdom', 'India']);
  assert.equal(elements['date-format'].textContent, 'MM/DD/YYYY');
  assert.equal(elements['policy-title'].textContent, 'United States time-off policy');

  elements['start-date'].value = '2026-08-10';
  elements['end-date'].value = '2026-08-12';
  elements['start-date'].listeners.input[0]();
  assert.equal(elements['date-preview'].textContent, 'Selected: 08/10/2026 to 08/12/2026');

  elements['region-select'].value = 'IN';
  elements['region-select'].listeners.change[0]();
  assert.equal(elements['date-format'].textContent, 'DD-MM-YYYY');
  assert.equal(elements['policy-title'].textContent, 'India leave policy');
  assert.equal(elements['policy-holidays'].textContent, 'National and state public holidays');
  assert.equal(elements['policy-points'].children.length, 3);
  assert.equal(elements['date-preview'].textContent, 'Selected: 10-08-2026 to 12-08-2026');
});

test('submit posts ISO dates, shows regional dates and resets after the await', async () => {
  const posts = [];
  const { elements, fields, form } = loadTimeOffPage(async (url, options) => {
    if (url === '/api/time-off') {
      return { ok: true, json: async () => ({ balanceDays: 18, leaveTypes: [{ name: 'Vacation' }] }) };
    }
    const body = JSON.parse(options.body);
    posts.push({ url, method: options.method, body });
    return { ok: true, json: async () => ({ id: 'REQ-1000', ...body, status: 'Submitted' }) };
  });
  await settle();

  elements['region-select'].value = 'UK';
  elements['region-select'].listeners.change[0]();
  fields.leaveType.value = 'Vacation';
  fields.startDate.value = '2026-08-10';
  fields.endDate.value = '2026-08-12';
  fields.note.value = 'Family trip';
  await submit(form);

  assert.deepEqual(posts, [{
    url: '/api/time-off-requests',
    method: 'POST',
    body: { leaveType: 'Vacation', startDate: '2026-08-10', endDate: '2026-08-12', note: 'Family trip' }
  }]);
  assert.equal(elements['request-message'].textContent, 'Request REQ-1000 submitted for review: 10/08/2026 to 12/08/2026.');
  assert.equal(elements['request-message'].className, 'form-message success');
  assert.equal(form.resetCount, 1);
  assert.equal(fields.startDate.value, '');
  assert.equal(elements['date-preview'].textContent, '');
  assert.equal(elements['region-select'].value, 'UK', 'region stays selected after reset');
});

test('a rejected request shows the error and keeps the form values', async () => {
  const { elements, fields, form } = loadTimeOffPage(async (url) => (url === '/api/time-off'
    ? { ok: true, json: async () => ({ balanceDays: 18, leaveTypes: [{ name: 'Vacation' }] }) }
    : { ok: false, json: async () => ({ error: 'Choose a leave type and valid start and end dates.' }) }));
  await settle();

  fields.startDate.value = '2026-08-12';
  await submit(form);

  assert.equal(elements['request-message'].textContent, 'Choose a leave type and valid start and end dates.');
  assert.equal(elements['request-message'].className, 'form-message error');
  assert.equal(form.resetCount, 0);
  assert.equal(fields.startDate.value, '2026-08-12');
});
