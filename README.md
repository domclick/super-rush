
# Super Rush

[![NPM](https://img.shields.io/npm/v/@domclick/super-rush)](https://www.npmjs.com/package/@domclick/super-rush) &nbsp;
![Node Version](https://img.shields.io/node/v/@domclick/super-rush) &nbsp;
![Dependencies](https://img.shields.io/librariesio/release/npm/@domclick/super-rush) &nbsp;
![Dependencies](https://img.shields.io/github/issues/domclick/super-rush) &nbsp;
[![License: MIT](https://img.shields.io/github/license/domclick/super-rush)](./LICENSE.md)

**Super Rush** — is a handy CLI-tool that allows you to link packages
across multiple Rush monorepos, effectively merging multiple monorepos
into a one big virtual monorepo.


## Install

Install Super Rush globally using npm:

`npm i -g @domclick/super-rush`


## Setup

Super Rush reads config `super-rush.json` from user's home directory.

This config should contain a list of all Rush monorepos that you want to manage
with the tool and the links between them:

```json
{
  "projects": [
    {
      "name": "project-1",
      "path": "/home/john/projects/project-1",
      "link": ["project-2"]
    },
    {
      "name": "project-2",
      "path": "/home/john/projects/project-2"
    }
  ]
}
```

The example config above contains two Rush monorepos with packages of
`project-2` being available in `project-1`.

The parent monorepo could link multiple child ones, however,
the recursive linking is not yet supported.


## Usage

`$ cd /home/john/projects/project-1`

`super-rush install` or `super-rush update`

This will install packages from both `project-1` and `project-2`
into `project-1` using linking.


## Reverting changes

You can easily revert all changes using the following Rush command:

`rush update --full --purge`


## How does it work?

The Super Rush CLI is a wrapper around normal Rush CLI,
which passes through all command line arguments and options,
but adds additional behavior.

When calling e.g. `super-rush install`, Super Rush will call `rush install`
internally, but will intercept it's read requests of the `rush.json` config file,
virtually replacing it with the rewritten config in memory that contains additional
packages from the linked monorepos.

Super Rush is not making any permanent changes to the original config in the file system.


## Authors & Contributors

- [Slava Fomin II](https://github.com/slavafomin) (Author)


## Contributor Notice

We are always open for contributions. Feel free to submit an issue
or a PR. However, when submitting a PR we will ask you to sign
our [CLA (Contributor License Agreement)][cla-text] to confirm that you
have the rights to submit your contributions and to give us the rights
to actually use them.

When submitting a PR our special bot will ask you to review and to sign
our [CLA][cla-text]. This will happen only once for all our GitHub repositories.

Please see the [contributing guide](./CONTRIBUTING.md).


## License

Copyright Ⓒ 2020
["Sberbank Real Estate Center" Limited Liability Company](https://domclick.ru/).

[MIT License](./LICENSE.md)



  [cla-text]: https://gist.github.com/royroev/3c931dc45259d8abd14763887dcaba8c
