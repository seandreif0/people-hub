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
  const grid = document.querySelector('#benefit-grid');
  const status = document.querySelector('#benefit-status');
  let benefits;
  try {
    benefits = await getJson('/api/benefits');
  } catch (error) {
    grid.removeAttribute('aria-busy');
    if (status) status.textContent = 'We could not load your benefits. Please try again.';
    throw error;
  }
  const list = makeElement('ul', 'benefit-list');
  list.setAttribute('role', 'list');
  benefits.forEach((benefit, index) => {
    const item = makeElement('li');
    const card = makeElement('article', 'benefit-card');
    const headingId = `benefit-title-${index + 1}`;
    card.setAttribute('aria-labelledby', headingId);
    const icon = makeElement('span', `card-icon ${['icon-mint', 'icon-lavender', 'icon-peach'][index % 3]}`, ['✳', '↗', '◎'][index % 3]);
    icon.setAttribute('aria-hidden', 'true');
    const heading = makeElement('h3', '', benefit.title);
    heading.id = headingId;
    card.append(icon, heading, makeElement('p', 'muted', benefit.description));
    const action = makeElement('a', 'text-link', benefit.action);
    action.href = 'mailto:people@example.com';
    action.setAttribute('aria-describedby', headingId);
    const arrow = makeElement('span', '', '→');
    arrow.setAttribute('aria-hidden', 'true');
    action.append(arrow);
    card.append(action);
    item.append(card);
    list.append(item);
  });
  grid.replaceChildren(list);
  grid.removeAttribute('aria-busy');
  if (status) status.textContent = `${benefits.length} benefits loaded.`;
}

async function loadDirectory() {
  const people = await getJson('/api/directory');
  const list = document.querySelector('#directory-list');
  const search = document.querySelector('#directory-search');

  function renderPeople() {
    const query = search.value.trim().toLowerCase();
    const matches = people.filter((person) => `${person.name} ${person.role} ${person.department} ${person.location}`.toLowerCase().includes(query));
    list.replaceChildren();
    if (!matches.length) {
      list.append(makeElement('p', 'muted empty-state', 'No people match that search.'));
      return;
    }
    matches.forEach((person) => {
      const row = makeElement('article', 'person-row');
      const initials = person.name.split(' ').map((part) => part[0]).join('');
      const avatar = makeElement('span', 'avatar person-avatar', initials);
      const details = makeElement('div', 'person-details');
      details.append(makeElement('h3', '', person.name), makeElement('p', 'muted', person.role));
      const team = makeElement('span', 'person-team', person.department);
      const location = makeElement('span', 'person-location', person.location);
      const email = makeElement('a', 'person-email', person.email);
      email.href = `mailto:${person.email}`;
      row.append(avatar, details, team, location, email);
      list.append(row);
    });
  }

  search.addEventListener('input', renderPeople);
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
