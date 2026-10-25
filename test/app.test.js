const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server');

async function startServer(t) {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

test('Home, Time Off, Benefits, and Directory pages load', async (t) => {
  const baseUrl = await startServer(t);
  const pages = [
    ['/', 'People Hub'],
    ['/time-off', 'Request time off'],
    ['/benefits', 'Benefits'],
    ['/directory', 'People directory']
  ];

  for (const [route, heading] of pages) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} should return 200`);
    assert.match(await response.text(), new RegExp(heading));
  }
});

test('every page footer has a Contact HR email link', async (t) => {
  const baseUrl = await startServer(t);

  for (const route of ['/', '/time-off', '/benefits', '/directory']) {
    const html = await (await fetch(`${baseUrl}${route}`)).text();
    const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
    assert.ok(footer, `${route} should have a site footer`);
    assert.match(footer[0], /<a [^>]*href="mailto:hr@example\.com"[^>]*>Contact HR<\/a>/, `${route} footer should link to HR`);
  }
});

test('time-off data includes a days-only balance and current request types', async (t) => {
  const baseUrl = await startServer(t);
  const response = await fetch(`${baseUrl}/api/time-off`);
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.balanceDays, 18);
  assert.deepEqual(result.leaveTypes.map((type) => type.name), ['Vacation', 'Sick leave', 'Personal day']);
});

test('Benefits and Directory return sample data', async (t) => {
  const baseUrl = await startServer(t);
  const [benefitsResponse, directoryResponse] = await Promise.all([
    fetch(`${baseUrl}/api/benefits`),
    fetch(`${baseUrl}/api/directory`)
  ]);

  assert.equal(benefitsResponse.status, 200);
  assert.equal(directoryResponse.status, 200);
  assert.equal((await benefitsResponse.json()).length, 3);
  assert.equal((await directoryResponse.json()).length, 4);
});

test('a valid time-off request is accepted in memory', async (t) => {
  const baseUrl = await startServer(t);
  const response = await fetch(`${baseUrl}/api/time-off-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      leaveType: 'Vacation',
      startDate: '2026-08-10',
      endDate: '2026-08-12',
      note: 'Family trip'
    })
  });
  const request = await response.json();

  assert.equal(response.status, 201);
  assert.equal(request.status, 'Submitted');
  assert.equal(request.id, 'REQ-1000');
});

test('the form rejects unsupported leave types', async (t) => {
  const baseUrl = await startServer(t);
  const response = await fetch(`${baseUrl}/api/time-off-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      leaveType: 'Parental leave',
      startDate: '2026-08-10',
      endDate: '2026-08-12'
    })
  });

  assert.equal(response.status, 400);
});
