# defined <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

return the first argument that is `!== undefined`

Most of the time when I chain together `||`s, I actually just want the first
item that is not `undefined`, not the first non-falsy item.

This module is like the defined-or (`//`) operator in perl 5.10+.

# example

``` js
var defined = require('defined');
var opts = { y : false, w : 4 };
var x = defined(opts.x, opts.y, opts.w, 100);
console.log(x);
```

```
$ node example/defined.js
false
```

The return value is `false` because `false` is the first item that is
`!== undefined`.

# methods

``` js
var defined = require('defined')
```

## var x = defined(a, b, c...)

Return the first item in the argument list `a, b, c...` that is `!== undefined`.

If all the items are `=== undefined`, return undefined.

# install

With [npm](https://npmjs.org) do:

```
npm install defined
```

# license

MIT

[package-url]: https://npmjs.org/package/defined
[npm-version-svg]: https://versionbadg.es/inspect-js/defined.svg
[deps-svg]: https://david-dm.org/inspect-js/defined.svg
[deps-url]: https://david-dm.org/inspect-js/defined
[dev-deps-svg]: https://david-dm.org/inspect-js/defined/dev-status.svg
[dev-deps-url]: https://david-dm.org/inspect-js/defined#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/defined.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/defined.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/defined.svg
[downloads-url]: https://npm-stat.com/charts.html?package=defined
[codecov-image]: https://codecov.io/gh/inspect-js/defined/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/inspect-js/defined/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/inspect-js/defined
[actions-url]: https://github.com/inspect-js/defined/actions
