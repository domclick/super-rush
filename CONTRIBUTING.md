
# Publishing a package

## Bump the version

- `npm version patch`

- `npm version minor`

- `npm version major`


## Push version update to Git

```shell
git push && git push --tags
```


## Publish the package to npmjs.com

```shell
npm login
```

```shell
npm publish
```


## Publish the package to GitHub

1). Add the following line to the: `~/.npmrc` file:

```shell
//npm.pkg.github.com/:_authToken={TOKEN}
```

where `{TOKEN}` is your
[personal GitHub access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
with publishing permission.

2). Run:

```shell
npm publish --registry=https://npm.pkg.github.com
```
