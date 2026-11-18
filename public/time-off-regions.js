(function (root) {
  const regions = {
    US: {
      label: 'United States',
      dateFormat: 'MM/DD/YYYY',
      policy: {
        title: 'United States time-off policy',
        holidayCalendar: 'US federal holidays',
        points: [
          'Vacation accrues each pay period and can be requested in full or half days.',
          'Up to 5 unused vacation days carry over into the next calendar year.',
          'Requests of 5 or more days should be sent at least 2 weeks ahead.'
        ]
      }
    },
    UK: {
      label: 'United Kingdom',
      dateFormat: 'DD/MM/YYYY',
      policy: {
        title: 'United Kingdom annual leave policy',
        holidayCalendar: 'UK bank holidays',
        points: [
          'Annual leave runs January to December, with bank holidays given in addition.',
          'Up to 5 unused days carry over and must be used by 31 March.',
          'Sickness absence over 7 calendar days needs a fit note.'
        ]
      }
    },
    IN: {
      label: 'India',
      dateFormat: 'DD-MM-YYYY',
      policy: {
        title: 'India leave policy',
        holidayCalendar: 'National and state public holidays',
        points: [
          'Earned leave accrues monthly; casual and sick leave are credited each January.',
          'Up to 10 earned leave days carry over into the next year.',
          'Requests longer than 3 days should be raised at least 1 week ahead.'
        ]
      }
    }
  };

  const defaultRegion = 'US';

  function formatDate(isoDate, regionCode) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
    const region = regions[regionCode];
    if (!match || !region) return '';
    const [, year, month, day] = match;
    return region.dateFormat
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  const api = { regions, defaultRegion, formatDate };
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.TimeOffRegions = api;
  }
})(this);
