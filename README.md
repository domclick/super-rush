
# Super Rush

[![License: MIT](https://img.shields.io/github/license/domclick/super-rush?cachebust)](./LICENSE.md)

**Super Rush** — is a handy CLI-tool that allows you to link packages
across multiple Rush monorepos, effectively merging multiple monorepos
into a one big virtual monorepo.


## Install

The package is not published on npm.
You will need to clone it from GitHub directly and compile it yourself.
Sorry for that.


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


## License

Copyright Ⓒ 2020 [Sberbank Real Estate Centre LLC](https://domclick.ru/).

[MIT License](./LICENSE.md)
