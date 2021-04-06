![Build Status](https://github.com/infovista/vistamart-datasource/actions/workflows/ci.yml/badge.svg)

# Development process

There are following scripts defined in package.json:

- `build` - production-ready build
- `dev` - development build
- `watch` - automatically rebuild frontend TypeScript+HTML part of codebase on change (handy while developing)
- `test` - runs frontend test suite using Jest

Each script can be run using NPM or Yarn package managers:

```sh
npm run <script>
```

or 

```sh
yarn run <script>
```
