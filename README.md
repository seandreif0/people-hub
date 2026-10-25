# People Hub

People Hub is a small, local-only employee self-service demo for the S&P Global CIO meeting. It uses fictional sample employees and in-memory request handling. There is no login, production data, external integration, or database.

> Demo prototype only. This was built without engineering review. Consult engineering before deploying to production or sharing it widely.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm start
```

Open <http://localhost:3000>. The app has Home, Time Off, Benefits, and Directory pages. The Time Off page includes the sample PTO balance and a request form; submitting a request keeps it in memory only. Use `Ctrl+C` to stop the server.

Run the tests with:

```sh
npm test
```

The two ServiceNow demo requests are intentionally not implemented in this starter app. Use `../servicenow/tickets.md` for their ticket text.
