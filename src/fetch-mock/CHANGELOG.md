# Changelog

## [12.5.2](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.5.1...fetch-mock-v12.5.2) (2025-03-03)


### Bug Fixes

* allow matching body for delete requests ([891197c](https://github.com/wheresrhys/fetch-mock/commit/891197c37eb6f85b50002df024bfcfcbdae500b3))

## [12.5.1](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.5.0...fetch-mock-v12.5.1) (2025-03-01)


### Bug Fixes

* improve handling of abort ([5c1085d](https://github.com/wheresrhys/fetch-mock/commit/5c1085d59d0dee600691ba7fba642869a623aa68))
* remove deprecated is-subset-of ([a2546ef](https://github.com/wheresrhys/fetch-mock/commit/a2546ef871e279ca5ef76d925f0491386c0809b2))

## [12.5.0](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.4.0...fetch-mock-v12.5.0) (2025-03-01)


### Features

* match formdata bodies ([ab7dff4](https://github.com/wheresrhys/fetch-mock/commit/ab7dff427454b6238e2228280a828c19b1f1df31))

## [12.4.0](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.3.0...fetch-mock-v12.4.0) (2025-02-23)


### Features

* add ability to wait for multiple routes ([c3dc9c3](https://github.com/wheresrhys/fetch-mock/commit/c3dc9c35da89e7ffb0ccb1bb72975acb15b13c30))
* implement waitFor option ([5500228](https://github.com/wheresrhys/fetch-mock/commit/550022826826defe1f3c844972e74bb64790596f))


### Bug Fixes

* clone response before using ([2ccf18e](https://github.com/wheresrhys/fetch-mock/commit/2ccf18e1fd2c659b55c549e3be2d009d738656d2))
* use a promise, no function, to implement waitFor ([8783101](https://github.com/wheresrhys/fetch-mock/commit/87831010c24c1de47e1b458131c07468f44e1e74))

## [12.3.0](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.2.1...fetch-mock-v12.3.0) (2025-02-04)


### Features

* added overwriteRoutes: true rule to codemods ([b3d1468](https://github.com/wheresrhys/fetch-mock/commit/b3d1468f93fb1bf18b5d3bf8c0a21dd56ad4d0aa))
* implemented modifyRoute() method ([f62e3d6](https://github.com/wheresrhys/fetch-mock/commit/f62e3d6f9cf36d4bcb282089b63b0b5a5ee0c21c))
* implemented removeRoute method ([584a861](https://github.com/wheresrhys/fetch-mock/commit/584a8619cae2e8ae513d2edc784dc7bbe13aa614))


### Bug Fixes

* make types for modify route config more accurate ([6894569](https://github.com/wheresrhys/fetch-mock/commit/689456923ea902c820688cbb9010b25ecf1387a1))
* prevented overwriting stickiness of a route ([87f8c9b](https://github.com/wheresrhys/fetch-mock/commit/87f8c9beaf66e07bfc145b1a4069f157f535a248))

## [12.2.1](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.2.0...fetch-mock-v12.2.1) (2025-01-28)


### Bug Fixes

* fix failure to spy in browsers ([bfaa5f3](https://github.com/wheresrhys/fetch-mock/commit/bfaa5f33c133af17a0bd097d2d3dbcb01966a0a8))

## [12.2.0](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.1.0...fetch-mock-v12.2.0) (2024-11-15)


### Features

* implement new hardReset method ([d7e0776](https://github.com/wheresrhys/fetch-mock/commit/d7e0776ea54011bcccaee1e1edfb986e9f1a4397))
* update codemods to use hardReset() ([757d480](https://github.com/wheresrhys/fetch-mock/commit/757d480532cfa8054471dec1bfcd89688966e37b))

## [12.1.0](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.0.3...fetch-mock-v12.1.0) (2024-11-08)


### Features

* **fetch-mock:** add include: matcher for urls ([02f880c](https://github.com/wheresrhys/fetch-mock/commit/02f880c64f96559efbccee6ba6d7ca4288efd92a))

## [12.0.3](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.0.2...fetch-mock-v12.0.3) (2024-11-08)


### Bug Fixes

* allow matching relative URLs ([2cba1bc](https://github.com/wheresrhys/fetch-mock/commit/2cba1bc0fdf6a042a715b2cb329ba5f369a71a5e))

## [12.0.2](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.0.1...fetch-mock-v12.0.2) (2024-10-28)


### Bug Fixes

* allow sending responses with status 0 ([92c06e9](https://github.com/wheresrhys/fetch-mock/commit/92c06e933fc8bd2e6b1027d1640d657bcf9a49a9))

## [12.0.1](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v12.0.0...fetch-mock-v12.0.1) (2024-10-27)


### Bug Fixes

* clearHistory() can deal with unmatched calls ([012e9ca](https://github.com/wheresrhys/fetch-mock/commit/012e9ca7d03e39e6832f9f40087ec53d6ccc2728))

## [12.0.0](https://github.com/wheresrhys/fetch-mock/compare/fetch-mock-v11.1.5...fetch-mock-v12.0.0) (2024-10-24)


### ⚠ BREAKING CHANGES

* Replaced legacy fetch-mock code with fetch-mock/core code

### Features

* Replaced legacy fetch-mock code with fetch-mock/core code ([999ce92](https://github.com/wheresrhys/fetch-mock/commit/999ce9257de6683830c8e70dcda3862c3d13699e))

## [0.7.1](https://github.com/wheresrhys/fetch-mock/compare/core-v0.7.0...core-v0.7.1) (2024-09-25)


### Bug Fixes

* change export order so default is last ([bc9c41d](https://github.com/wheresrhys/fetch-mock/commit/bc9c41d04609c40e609e672254df5ff1ddf0cad9))

## [0.7.0](https://github.com/wheresrhys/fetch-mock/compare/core-v0.6.3...core-v0.7.0) (2024-08-30)


### ⚠ BREAKING CHANGES

* remove sendAsJson option

### Features

* remove sendAsJson option ([4b11fc4](https://github.com/wheresrhys/fetch-mock/commit/4b11fc4a5c92c81de8f89b1993a57c2645805ddb))
* send content=length header whenever calculable ([ef4c684](https://github.com/wheresrhys/fetch-mock/commit/ef4c684bddb617e95c54217c86b6953637f21f74))


### Bug Fixes

* force engine to be &gt;=18.11.0 as this fixes an issue in proxying a response ([dde5e6b](https://github.com/wheresrhys/fetch-mock/commit/dde5e6beb9aee103296cf060a9f027bffb4818e9))
* handle all types of BodyInit correctly ([0242ea2](https://github.com/wheresrhys/fetch-mock/commit/0242ea2d6c30e36418f21a37a962fe1cf84c9271))

## [0.6.3](https://github.com/wheresrhys/fetch-mock/compare/core-v0.6.2...core-v0.6.3) (2024-08-29)


### Documentation Changes

* minor corrections ([d77978a](https://github.com/wheresrhys/fetch-mock/commit/d77978a17825f166f06cbb1bbb911e7fb8790a4a))
* readme for @fetch-mock/core ([5fd7c5a](https://github.com/wheresrhys/fetch-mock/commit/5fd7c5a1d37e546ab8dd6e173761ae0b8fb43878))
* wrote a README for @fetch-mock/vitest ([d2d1ea3](https://github.com/wheresrhys/fetch-mock/commit/d2d1ea3f14012772edeb77a543384b99b3475e16))

## [0.6.2](https://github.com/wheresrhys/fetch-mock/compare/core-v0.6.1...core-v0.6.2) (2024-08-28)


### Bug Fixes

* add missing metadata to package.json files ([4ab78b9](https://github.com/wheresrhys/fetch-mock/commit/4ab78b9429a376230da2ce57bd320031c53f06ef))

## [0.6.1](https://github.com/wheresrhys/fetch-mock/compare/core-v0.6.0...core-v0.6.1) (2024-08-15)


### Features

* export more types from @fetch-mock/core ([2bff326](https://github.com/wheresrhys/fetch-mock/commit/2bff326063a362ea4ce0adc1102130bd1c31ac9e))

## [0.6.0](https://github.com/wheresrhys/fetch-mock/compare/core-v0.5.0...core-v0.6.0) (2024-08-13)


### ⚠ BREAKING CHANGES

* force a major release due to breaking nature of relative url API changes

### Features

* implemented allowRelativeUrls option ([f32bd6e](https://github.com/wheresrhys/fetch-mock/commit/f32bd6e6ba7aed03ec0fd0c7361097e85c84224a))


### Bug Fixes

* all relative url behaviour is as expected now; ([dc99eb7](https://github.com/wheresrhys/fetch-mock/commit/dc99eb783e64c8c101c9d15fc59cccc7f7ad174d))
* force a major release due to breaking nature of relative url API changes ([6f29db8](https://github.com/wheresrhys/fetch-mock/commit/6f29db8ff79a8c7a50ad03f4c1547d8716ffb298))

## [0.5.0](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.12...core-v0.5.0) (2024-08-13)


### ⚠ BREAKING CHANGES

* implemented desired behaviour for dot path matching
* implemented desired behaviour for protocol relative urls

### Features

* implemented desired behaviour for dot path matching ([b2fe6f8](https://github.com/wheresrhys/fetch-mock/commit/b2fe6f894b337ed213f55fed47f611acbdecd84f))
* implemented desired behaviour for protocol relative urls ([06e6260](https://github.com/wheresrhys/fetch-mock/commit/06e62607dbfc7b71936b8a691e37ef9275e7cc11))

## [0.4.12](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.11...core-v0.4.12) (2024-08-13)


### Bug Fixes

* roll back to glob-to-regexp ([b114124](https://github.com/wheresrhys/fetch-mock/commit/b11412452ed376ab2e20e03a51f0dc1de1dcdb90))

## [0.4.11](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.10...core-v0.4.11) (2024-08-09)


### Bug Fixes

* force release of core ([6bf9b87](https://github.com/wheresrhys/fetch-mock/commit/6bf9b87f0598cb5a142d623c6285b0dca6c619d5))

## [0.4.10](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.9...core-v0.4.10) (2024-08-08)


### Bug Fixes

* fix core package build ([90bbe76](https://github.com/wheresrhys/fetch-mock/commit/90bbe76ab384ec5cefeb17f19ca06ca386cbbde5))

## [0.4.9](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.8...core-v0.4.9) (2024-08-08)


### Bug Fixes

* add license file to each package ([9b36f89](https://github.com/wheresrhys/fetch-mock/commit/9b36f892ed19cd381b1f8ebbd94a28773637b9ec))

## [0.4.8](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.7...core-v0.4.8) (2024-08-03)


### Documentation Changes

* document and test behaviour with multiple missing headers ([88d0440](https://github.com/wheresrhys/fetch-mock/commit/88d0440b814a0f3309f49c30d6c81d899ebc65a6))

## [0.4.7](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.6...core-v0.4.7) (2024-08-02)


### Bug Fixes

* correct types so that global optiosn can be passed in to route ([13e1fc6](https://github.com/wheresrhys/fetch-mock/commit/13e1fc64ca3a36f54765d588dc61d44cc92cd413))

## [0.4.6](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.5...core-v0.4.6) (2024-07-30)


### Bug Fixes

* now more spec compliant on exceptions ([ceec07f](https://github.com/wheresrhys/fetch-mock/commit/ceec07f1c8c1be86111b4feaaab76c103885da4d))

## [0.4.5](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.4...core-v0.4.5) (2024-07-26)


### Features

* allow spying on just one route ([a9638fc](https://github.com/wheresrhys/fetch-mock/commit/a9638fc12f60bfa28e6169a9fa736e2bbdc21a8a))
* rename restoreGlobal to unmockGlobal ([3ad4241](https://github.com/wheresrhys/fetch-mock/commit/3ad4241f409353ac970cf26b1252b32ea6390208))

## [0.4.4](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.3...core-v0.4.4) (2024-07-25)


### Features

* cancel readable streams as effectively as possible ([aa3b899](https://github.com/wheresrhys/fetch-mock/commit/aa3b89989bd223e788db895b03c4fabc56f061d2))
* support multiple url matchers at once ([c83d9f9](https://github.com/wheresrhys/fetch-mock/commit/c83d9f992337eb6ff79f027a7fc2e6316ce36456))

## [0.4.3](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.2...core-v0.4.3) (2024-07-24)


### Bug Fixes

* make a more sensible decision about matching body ([0ef50d6](https://github.com/wheresrhys/fetch-mock/commit/0ef50d62ccaa70ea09b693519ddb80d73530b38f))

## [0.4.2](https://github.com/wheresrhys/fetch-mock/compare/core-v0.4.1...core-v0.4.2) (2024-07-24)


### Features

* make query parameters available on CallLog ([8ec57ac](https://github.com/wheresrhys/fetch-mock/commit/8ec57acdc2586102fc94a76f3f3328422e43947f))

## [0.4.0](https://github.com/wheresrhys/fetch-mock/compare/core-v0.3.1...core-v0.4.0) (2024-07-24)


### ⚠ BREAKING CHANGES

* defined route shorthand methods more declaratively

### refactor

* defined route shorthand methods more declaratively ([f42d240](https://github.com/wheresrhys/fetch-mock/commit/f42d240f8ef5c6a270ee8b355ad5177d8fdadf0b)). This includes removing all the `${method}Any()` and `${method}AnyOnce()` methods.

## [0.3.1](https://github.com/wheresrhys/fetch-mock/compare/core-v0.3.0...core-v0.3.1) (2024-07-23)


### Documentation Changes

* fixed tests and documented the async behaviour ([664a6df](https://github.com/wheresrhys/fetch-mock/commit/664a6df59a77937e18f19aa161ec4900fa709bfe))

## [0.3.0](https://github.com/wheresrhys/fetch-mock/compare/core-v0.2.0...core-v0.3.0) (2024-07-21)


### ⚠ BREAKING CHANGES

* matchers now take normalized requests as input
* renamed func to matcherFunction
* removed support for passing in a matcher under the generic name matcher
* renamed functionMatcher to func

### refactor

* matchers now take normalized requests as input ([da9dfe8](https://github.com/wheresrhys/fetch-mock/commit/da9dfe80475f2c95ea9a3652bfe8682ccd4c65fd))


### Features

* can now access express parameters in responses ([41e2475](https://github.com/wheresrhys/fetch-mock/commit/41e2475d64d909f5fb686f2fe3709243326f2dba))
* removed support for passing in a matcher under the generic name matcher ([f41d8f9](https://github.com/wheresrhys/fetch-mock/commit/f41d8f909350961e40a4df9dfb4817a3eaba09cd))
* renamed func to matcherFunction ([e5679a7](https://github.com/wheresrhys/fetch-mock/commit/e5679a72f663d5187d08934aa510951f1d438adc))
* renamed functionMatcher to func ([4cee629](https://github.com/wheresrhys/fetch-mock/commit/4cee629b36cd618d6d5b1061c15e48aab7047969))
* response builder function now expects a calllog ([306357d](https://github.com/wheresrhys/fetch-mock/commit/306357db486c9c7aa621f430cd08621420efc724))

## [0.2.0](https://github.com/wheresrhys/fetch-mock/compare/core-v0.1.1...core-v0.2.0) (2024-07-20)


### ⚠ BREAKING CHANGES

* removed top level done and flush methods

### Features

* removed top level done and flush methods ([49ae6f7](https://github.com/wheresrhys/fetch-mock/commit/49ae6f7671a2ce10f0a31bafd3eb9e1d7ce5cf2d))


### Bug Fixes

* callhistory created with instance.config, not this.config ([87206e6](https://github.com/wheresrhys/fetch-mock/commit/87206e69e71e1270932fe322c79f0b42cac486c6))

## [0.1.1](https://github.com/wheresrhys/fetch-mock/compare/core-v0.1.0...core-v0.1.1) (2024-07-18)


### Features

* **wip:** replace dequal, glob-to-regexp and bump path-to-regexp ([d8d8b25](https://github.com/wheresrhys/fetch-mock/commit/d8d8b259fffbd01a03d5c5bf2768ee48797b68bb))


### Bug Fixes

* replace path-to-regexp with regexparam ([4bf3e32](https://github.com/wheresrhys/fetch-mock/commit/4bf3e32f852ffc169ca354288eff86737e131480))

## 0.1.0 (2024-07-15)


### Bug Fixes

* install core package dependencies ([9c73e76](https://github.com/wheresrhys/fetch-mock/commit/9c73e76686427237a99ababa44075ca426b22037))
