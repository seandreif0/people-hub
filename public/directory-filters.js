(function (root) {
  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function filterOptions(people) {
    return {
      offices: uniqueSorted(people.map((person) => person.location)),
      functions: uniqueSorted(people.map((person) => person.department)),
      skills: uniqueSorted(people.flatMap((person) => person.skills || []))
    };
  }

  function filterPeople(people, { query = '', office = '', department = '', skill = '' } = {}) {
    const text = query.trim().toLowerCase();
    return people.filter((person) => {
      const skills = person.skills || [];
      const haystack = `${person.name} ${person.role} ${person.department} ${person.location} ${skills.join(' ')}`.toLowerCase();
      return haystack.includes(text)
        && (!office || person.location === office)
        && (!department || person.department === department)
        && (!skill || skills.includes(skill));
    });
  }

  function summarizeSkills(people) {
    const counts = new Map();
    for (const person of people) {
      for (const skill of new Set(person.skills || [])) {
        counts.set(skill, (counts.get(skill) || 0) + 1);
      }
    }
    return [...counts]
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill));
  }

  const api = { filterOptions, filterPeople, summarizeSkills };
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.DirectoryFilters = api;
  }
})(typeof window === 'undefined' ? globalThis : window);
