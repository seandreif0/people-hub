async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('Could not load this information.');
  }
  return response.json();
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

async function loadTimeOff() {
  const data = await getJson('/api/time-off');
  document.querySelector('#balance-days').textContent = data.balanceDays;
  const select = document.querySelector('#leave-type');
  for (const type of data.leaveTypes) {
    select.add(new Option(type.name, type.name));
  }

  document.querySelector('#request-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.querySelector('#request-message');
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/time-off-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    const result = await response.json();
    message.textContent = response.ok
      ? `Request ${result.id} submitted for review.`
      : result.error;
    message.className = `form-message${response.ok ? ' success' : ' error'}`;
    if (response.ok) event.currentTarget.reset();
  });
}

async function loadBenefits() {
  const benefits = await getJson('/api/benefits');
  const grid = document.querySelector('#benefit-grid');
  grid.replaceChildren();
  benefits.forEach((benefit, index) => {
    const card = makeElement('article', 'benefit-card');
    const icon = makeElement('span', `card-icon ${['icon-mint', 'icon-lavender', 'icon-peach'][index % 3]}`, ['✳', '↗', '◎'][index % 3]);
    icon.setAttribute('aria-hidden', 'true');
    card.append(icon, makeElement('h2', '', benefit.title), makeElement('p', 'muted', benefit.description));
    const action = makeElement('a', 'text-link', `${benefit.action} →`);
    action.href = 'mailto:people@example.com';
    card.append(action);
    grid.append(card);
  });
}

async function loadDirectory() {
  const people = await getJson('/api/directory');
  const { filterOptions, filterPeople, summarizeSkills } = window.DirectoryFilters;
  const list = document.querySelector('#directory-list');
  const search = document.querySelector('#directory-search');
  const office = document.querySelector('#filter-office');
  const department = document.querySelector('#filter-function');
  const skill = document.querySelector('#filter-skill');
  const clear = document.querySelector('#clear-filters');
  const count = document.querySelector('#directory-count');
  const summary = document.querySelector('#skills-summary-list');

  const options = filterOptions(people);
  options.offices.forEach((value) => office.add(new Option(value, value)));
  options.functions.forEach((value) => department.add(new Option(value, value)));
  options.skills.forEach((value) => skill.add(new Option(value, value)));

  function renderSummary(matches) {
    summary.replaceChildren();
    const skills = summarizeSkills(matches);
    if (!skills.length) {
      summary.append(makeElement('li', 'muted', 'No skills to show.'));
      return;
    }
    skills.forEach((entry) => {
      const item = makeElement('li', '', entry.skill);
      const tally = makeElement('span', 'skill-count', String(entry.count));
      tally.setAttribute('aria-label', `${entry.count} ${entry.count === 1 ? 'person' : 'people'}`);
      item.append(tally);
      summary.append(item);
    });
  }

  function renderPeople() {
    const matches = filterPeople(people, {
      query: search.value,
      office: office.value,
      department: department.value,
      skill: skill.value
    });
    clear.disabled = !(search.value.trim() || office.value || department.value || skill.value);
    count.textContent = `Showing ${matches.length} of ${people.length} people`;
    renderSummary(matches);
    list.replaceChildren();
    if (!matches.length) {
      list.append(makeElement('p', 'muted empty-state', 'No people match that search or these filters.'));
      return;
    }
    matches.forEach((person) => {
      const row = makeElement('article', 'person-row');
      const initials = person.name.split(' ').map((part) => part[0]).join('');
      const avatar = makeElement('span', 'avatar person-avatar', initials);
      const details = makeElement('div', 'person-details');
      details.append(makeElement('h3', '', person.name), makeElement('p', 'muted', person.role));
      if (person.skills && person.skills.length) {
        const skills = makeElement('ul', 'person-skills');
        skills.setAttribute('aria-label', `${person.name} skills`);
        person.skills.forEach((value) => skills.append(makeElement('li', '', value)));
        details.append(skills);
      }
      const team = makeElement('span', 'person-team', person.department);
      const location = makeElement('span', 'person-location', person.location);
      const email = makeElement('a', 'person-email', person.email);
      email.href = `mailto:${person.email}`;
      row.append(avatar, details, team, location, email);
      list.append(row);
    });
  }

  search.addEventListener('input', renderPeople);
  [office, department, skill].forEach((control) => control.addEventListener('change', renderPeople));
  clear.addEventListener('click', () => {
    search.value = '';
    office.value = '';
    department.value = '';
    skill.value = '';
    renderPeople();
    search.focus();
  });
  renderPeople();
}

const page = document.body.dataset.page;
const pageLoaders = {
  'time-off': loadTimeOff,
  benefits: loadBenefits,
  directory: loadDirectory
};

if (pageLoaders[page]) {
  pageLoaders[page]().catch(() => {
    const target = document.querySelector('#request-message, #benefit-grid, #directory-list');
    if (target) {
      target.textContent = 'We could not load this section. Please try again.';
      target.classList.add('error');
    }
  });
}
