# PackageJsonProcessor

Typescript classes for processing, manipulating, and saving a `process.json` file.

## Table of Contents

- [PackageJsonProcessor](#packagejsonprocessor)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Contribution](#contribution)

## Installation

Simply run `yarn add package-json-processor` or `npm install package-json-processor`.

## Usage

```typescript
const processor = new PackageJsonProcessor();
processor.setVersion("2.0.0");
processor.save();
```

To find which methods you can use, take a look at the code or look at the tests for more information.

## Testing

Run `npm test` or `yarn test`.

## Contribution

Pull Requests are more than welcome!