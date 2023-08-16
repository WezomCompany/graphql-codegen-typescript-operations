# @wezom/graphql-codegen-configurator

[![NPM version badge](https://img.shields.io/npm/v/@wezom/graphql-codegen-configurator.svg)](https://www.npmjs.com/package/@wezom/graphql-codegen-configurator)
[![NPM license badge](https://img.shields.io/npm/l/@wezom/graphql-codegen-configurator.svg)](https://www.npmjs.com/package/@wezom/graphql-codegen-configurator)
[![CI Test and Build](https://github.com/WezomCompany/graphql-codegen-configurator/actions/workflows/ci.yml/badge.svg)](https://github.com/WezomCompany/graphql-codegen-configurator/actions/workflows/ci.yml)

> _Preset generator from GraphQL operations to Typescript code for
> the [`@graphql-codegen`](https://the-guild.dev/graphql/codegen)_

## Coverage

| Statements                                                                               | Branches                                                                             | Functions                                                                              | Lines                                                                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

---

## Usage example

Create `codegen.ts` file in your project root directory and add the following
code
with your own source paths:

```ts
// codegen.ts
import { SplitEnumsConfigurator } from '@wezom/graphql-codegen-configurator';

const configurator = new SplitEnumsConfigurator({
	schema: 'src/gql/schema.graphql',
	outputDir: './src/gql/__generated__',
	documents: ['src/**/*.tsx', 'src/**/*.ts'],
});

export default configurator.create();
```
