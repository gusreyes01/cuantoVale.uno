# Contributing

Install with `npm ci`, keep API and DOM logic separate, and add tests for every
behavior change. Before opening a pull request, run:

```sh
npm run lint
npm test
npm audit --audit-level=high
```

Never commit Mercado Libre credentials or user data. This application only
uses public read-only endpoints.
