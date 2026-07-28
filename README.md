# CuantoVale.uno

CuantoVale estimates the resale value of consumer electronics from recent
Mercado Libre México listings. Users select a category, model, capacity, and
condition; the app displays 90% of the observed average listing price.

## Run locally

Node.js 20 is recommended.

```sh
npm ci
npm start
```

Open <http://localhost:8001/app/>. The browser calls Mercado Libre's public,
read-only API directly; there are no credentials or environment variables.

## Development

```sh
npm run lint
npm test
npm audit --audit-level=high
```

The test suite covers price estimation, input validation, URL/query encoding,
HTTP failures, category loading, and empty-result behavior.

## Architecture

- `app/js/services.js` owns API requests, validation, and valuation logic.
- `app/js/app.js` coordinates the form and accessible loading/error states.
- `app/index.html` provides the semantic, dependency-free user interface.

The code uses browser-native `fetch`, URL handling, and DOM APIs. API responses
are validated before use, and request failures are shown to the user without
leaking implementation details.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CHANGELOG.md](CHANGELOG.md).
Released under the MIT license.
