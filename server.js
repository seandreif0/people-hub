const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const publicDirectory = path.join(__dirname, 'public');

function createApp() {
  const app = express();
  const requests = [];

  app.use(express.json());

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/time-off', (_req, res) => {
    res.json(data.timeOff);
  });

  app.post('/api/time-off-requests', (req, res) => {
    const { leaveType, startDate, endDate, note = '' } = req.body || {};
    const validDate = /^\d{4}-\d{2}-\d{2}$/;
    const knownType = data.timeOff.leaveTypes.some((type) => type.name === leaveType);

    if (!knownType || !validDate.test(startDate || '') || !validDate.test(endDate || '') || endDate < startDate) {
      return res.status(400).json({ error: 'Choose a leave type and valid start and end dates.' });
    }

    const request = {
      id: `REQ-${1000 + requests.length}`,
      leaveType,
      startDate,
      endDate,
      note: String(note).slice(0, 500),
      status: 'Submitted'
    };
    requests.push(request);
    return res.status(201).json(request);
  });

  app.get('/api/benefits', (_req, res) => {
    res.json(data.benefits);
  });

  app.get('/api/directory', (_req, res) => {
    res.json(data.directory);
  });

  app.get('/', (_req, res) => {
    res.sendFile(path.join(publicDirectory, 'index.html'));
  });

  for (const page of ['time-off', 'benefits', 'directory']) {
    app.get(`/${page}`, (_req, res) => {
      res.sendFile(path.join(publicDirectory, `${page}.html`));
    });
  }

  app.use(express.static(publicDirectory));

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => {
    console.log(`People Hub listening at http://localhost:${port}`);
  });
}

module.exports = { createApp };
