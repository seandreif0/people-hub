const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createApp } = require('../server');

const publicDirectory = path.join(__dirname, '..', 'public');
const benefitsCss = fs.readFileSync(path.join(publicDirectory, 'benefits.css'), 'utf8');
const sharedCss = fs.readFileSync(path.join(publicDirectory, 'styles.css'), 'utf8');
const benefitsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data.json'), 'utf8')).benefits;

async function startServer(t) {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

async function getBenefitsHtml(t) {
  const baseUrl = await startServer(t);
  const response = await fetch(`${baseUrl}/benefits`);
  assert.equal(response.status, 200);
  return response.text();
}

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.className = '';
    this.id = '';
    this.text = '';
  }

  get textContent() {
    return this.text + this.children.map((child) => child.textContent).join('');
  }

  set textContent(value) {
    this.text = String(value);
    this.children = [];
  }

  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return name in this.attributes ? this.attributes[name] : null; }
  removeAttribute(name) { delete this.attributes[name]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.text = ''; this.children = nodes; }
  get classList() { return { add: (name) => { this.className = `${this.className} ${name}`.trim(); } }; }

  findAll(predicate, found = []) {
    for (const child of this.children) {
      if (predicate(child)) found.push(child);
      child.findAll(predicate, found);
    }
    return found;
  }

  // Accessible name from visible text, skipping aria-hidden descendants.
  get accessibleText() {
    if (this.getAttribute('aria-hidden') === 'true') return '';
    return this.text + this.children.map((child) => child.accessibleText).join('');
  }
}

async function renderBenefits(fetchImpl) {
  const grid = new FakeElement('div');
  grid.id = 'benefit-grid';
  grid.setAttribute('aria-busy', 'true');
  const status = new FakeElement('p');
  status.id = 'benefit-status';
  const elements = { '#benefit-grid': grid, '#benefit-status': status };
  const document = {
    body: { dataset: { page: 'benefits' } },
    createElement: (tagName) => new FakeElement(tagName),
    querySelector: (selector) => elements[selector] || selector.split(', ').map((s) => elements[s]).find(Boolean) || null
  };
  const context = vm.createContext({ document, fetch: fetchImpl });
  vm.runInContext(fs.readFileSync(path.join(publicDirectory, 'app.js'), 'utf8'), context);
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { grid, status };
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function cssVar(css, name) {
  const matches = [...css.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,6})`, 'g'))];
  assert.ok(matches.length, `--${name} should be defined`);
  return matches.at(-1)[1];
}

test('Benefits page has a skip link to a focusable main landmark', async (t) => {
  const html = await getBenefitsHtml(t);
  const bodyStart = html.indexOf('<body');
  const firstLink = html.slice(bodyStart).match(/<a\b[^>]*>/)[0];
  assert.match(firstLink, /class="skip-link"/);
  assert.match(firstLink, /href="#main-content"/);
  assert.match(html, /<main id="main-content"[^>]*tabindex="-1"/);
  assert.match(benefitsCss, /\.skip-link:focus\s*\{\s*transform:\s*none;/);
});

test('Benefits page has one h1, labelled sections and a current nav item', async (t) => {
  const html = await getBenefitsHtml(t);
  assert.match(html, /<html lang="en">/);
  assert.equal(html.match(/<h1\b/g).length, 1);
  assert.match(html, /<h2 id="benefit-list-title"[^>]*>Your benefits<\/h2>/);
  for (const id of ['benefits-title', 'benefit-list-title', 'help-title']) {
    assert.match(html, new RegExp(`aria-labelledby="${id}"`));
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /<a class="active" href="\/benefits" aria-current="page">Benefits<\/a>/);
  assert.equal(html.match(/aria-current=/g).length, 1);
});

test('Benefits header controls have names that match their visible text', async (t) => {
  const html = await getBenefitsHtml(t);
  const brand = html.match(/<a class="brand"[^>]*aria-label="([^"]+)"/)[1];
  assert.ok(brand.startsWith('S&amp;P Global People Hub'), 'brand label should start with its visible text');
  assert.match(html, /<span class="avatar" aria-hidden="true">SF<\/span>/);
  assert.match(html, /Ask People &amp; Culture <span aria-hidden="true">→<\/span><\/a>/);
});

test('Benefits stylesheet is linked only from the Benefits page and defines focus styles', () => {
  for (const file of ['index.html', 'time-off.html', 'directory.html']) {
    assert.doesNotMatch(fs.readFileSync(path.join(publicDirectory, file), 'utf8'), /benefits\.css/);
  }
  assert.match(fs.readFileSync(path.join(publicDirectory, 'benefits.html'), 'utf8'), /<link rel="stylesheet" href="\/benefits\.css">/);
  assert.match(benefitsCss, /a:focus-visible,\s*\.button:focus-visible/);
  assert.match(benefitsCss, /outline:\s*3px solid var\(--benefits-focus\)/);
});

test('loaded benefit cards render as a labelled list with named links', async () => {
  const { grid, status } = await renderBenefits(async () => ({ ok: true, json: async () => benefitsData }));
  assert.equal(grid.getAttribute('aria-busy'), null);
  assert.equal(status.textContent, `${benefitsData.length} benefits loaded.`);

  const [list] = grid.children;
  assert.equal(list.tagName, 'UL');
  assert.equal(list.getAttribute('role'), 'list');
  assert.equal(list.children.length, benefitsData.length);

  list.children.forEach((item, index) => {
    assert.equal(item.tagName, 'LI');
    const [card] = item.children;
    const [heading] = card.findAll((el) => el.tagName === 'H3');
    const [link] = card.findAll((el) => el.tagName === 'A');
    assert.equal(heading.textContent, benefitsData[index].title);
    assert.equal(card.getAttribute('aria-labelledby'), heading.id);
    assert.equal(link.accessibleText.trim(), benefitsData[index].action);
    assert.equal(link.getAttribute('aria-describedby'), heading.id);
    assert.equal(link.href, 'mailto:people@example.com');
  });

  const ids = grid.findAll((el) => el.tagName === 'H3').map((el) => el.id);
  assert.equal(new Set(ids).size, ids.length, 'heading ids should be unique');
  assert.equal(grid.findAll((el) => el.tagName === 'H2').length, 0, 'cards should not repeat the section h2 level');
});

test('a failed benefits request is announced and clears the busy state', async () => {
  const { grid, status } = await renderBenefits(async () => ({ ok: false, json: async () => ({}) }));
  assert.equal(grid.getAttribute('aria-busy'), null);
  assert.equal(status.textContent, 'We could not load your benefits. Please try again.');
  assert.equal(grid.textContent, 'We could not load this section. Please try again.');
});

test('Benefits text and focus colors meet WCAG AA contrast', () => {
  const white = '#ffffff';
  const grey = cssVar(sharedCss, 'grey');
  const red = cssVar(sharedCss, 'red');
  const pairs = [
    ['body text', cssVar(sharedCss, 'ink'), white, 4.5],
    ['muted descriptions', cssVar(sharedCss, 'muted'), white, 4.5],
    ['eyebrows and card links', red, white, 4.5],
    ['card link hover', cssVar(sharedCss, 'red-dark'), white, 4.5],
    ['primary button text', white, red, 4.5],
    ['nav text', cssVar(sharedCss, 'ink'), grey, 4.5],
    ['skip link', cssVar(benefitsCss, 'benefits-skip-text'), cssVar(benefitsCss, 'benefits-skip-bg'), 4.5],
    ['focus ring on page', cssVar(benefitsCss, 'benefits-focus'), white, 3],
    ['focus ring on nav', cssVar(benefitsCss, 'benefits-focus'), grey, 3],
    ['focus ring inside skip link', cssVar(benefitsCss, 'benefits-focus-inverse'), cssVar(benefitsCss, 'benefits-skip-bg'), 3]
  ];
  for (const [label, foreground, background, minimum] of pairs) {
    const ratio = contrast(foreground, background);
    assert.ok(ratio >= minimum, `${label}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1, needs ${minimum}:1`);
  }
});
