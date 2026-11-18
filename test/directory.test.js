const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server');
const { directory } = require('../data.json');
const { filterOptions, filterPeople, summarizeSkills } = require('../public/directory-filters');

async function startServer(t) {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

const names = (people) => people.map((person) => person.name);

test('every directory employee has fictional skills and keeps contact details', () => {
  for (const person of directory) {
    assert.ok(Array.isArray(person.skills) && person.skills.length > 0, `${person.name} needs skills`);
    assert.match(person.email, /@example\.com$/);
  }
});

test('filter options come from office, function and skill values', () => {
  const options = filterOptions(directory);
  assert.deepEqual(options.offices, ['Austin, TX', 'Boston, MA', 'Chicago, IL', 'New York, NY']);
  assert.deepEqual(options.functions, ['Digital Workplace', 'Employee Platforms', 'People & Culture']);
  assert.ok(options.skills.includes('Accessibility'));
  assert.equal(new Set(options.skills).size, options.skills.length);
});

test('each filter narrows the list on its own', () => {
  assert.deepEqual(names(filterPeople(directory, { office: 'Boston, MA' })), ['Taylor Reed']);
  assert.deepEqual(names(filterPeople(directory, { department: 'People & Culture' })), ['Seth Fox', 'Taylor Reed']);
  assert.deepEqual(names(filterPeople(directory, { skill: 'Accessibility' })), ['Jordan Lee', 'Casey Patel']);
});

test('filters and search combine, and clearing them restores everyone', () => {
  assert.deepEqual(names(filterPeople(directory, { department: 'People & Culture', skill: 'Data analysis', office: 'New York, NY' })), ['Seth Fox']);
  assert.deepEqual(names(filterPeople(directory, { query: 'taylor', department: 'People & Culture' })), ['Taylor Reed']);
  assert.deepEqual(names(filterPeople(directory, { query: 'prototyping' })), ['Jordan Lee']);
  assert.deepEqual(names(filterPeople(directory, { query: '', office: '', department: '', skill: '' })), names(directory));
  assert.deepEqual(names(filterPeople(directory)), names(directory));
});

test('conflicting filters return an empty set with an empty summary', () => {
  const matches = filterPeople(directory, { office: 'Austin, TX', department: 'People & Culture' });
  assert.deepEqual(matches, []);
  assert.deepEqual(summarizeSkills(matches), []);
});

test('the skills summary counts the people in the current set', () => {
  const everyone = summarizeSkills(directory);
  assert.deepEqual(everyone.slice(0, 3), [
    { skill: 'Accessibility', count: 2 },
    { skill: 'Data analysis', count: 2 },
    { skill: 'Employee relations', count: 2 }
  ]);
  const total = everyone.reduce((sum, entry) => sum + entry.count, 0);
  assert.equal(total, directory.reduce((sum, person) => sum + person.skills.length, 0));

  const peopleTeam = filterPeople(directory, { department: 'People & Culture' });
  assert.deepEqual(summarizeSkills(peopleTeam), [
    { skill: 'Data analysis', count: 2 },
    { skill: 'Employee relations', count: 2 },
    { skill: 'Benefits administration', count: 1 },
    { skill: 'Workforce planning', count: 1 }
  ]);
});

test('Directory page ships filters, summary and its own assets', async (t) => {
  const baseUrl = await startServer(t);
  const html = await (await fetch(`${baseUrl}/directory`)).text();
  for (const id of ['directory-search', 'filter-office', 'filter-function', 'filter-skill', 'clear-filters', 'directory-count', 'skills-summary-list', 'directory-list']) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }
  assert.match(html, /sample demo data/);
  assert.match(html, /href="\/directory\.css"/);
  assert.ok(html.indexOf('/directory-filters.js') < html.indexOf('/app.js'), 'filters script loads before app.js');

  for (const asset of ['/directory.css', '/directory-filters.js']) {
    const response = await fetch(`${baseUrl}${asset}`);
    assert.equal(response.status, 200, `${asset} should be served`);
  }

  const people = await (await fetch(`${baseUrl}/api/directory`)).json();
  assert.ok(people.every((person) => Array.isArray(person.skills)));
});

test('directory.css is linked only from the Directory page', async (t) => {
  const baseUrl = await startServer(t);
  for (const route of ['/', '/time-off', '/benefits']) {
    const html = await (await fetch(`${baseUrl}${route}`)).text();
    assert.doesNotMatch(html, /directory\.css|directory-filters\.js/, `${route} should not load Directory assets`);
  }
});
