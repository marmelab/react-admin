# detective Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## x.y.z - unreleased
* update acorn-node to 1.8.2 (make use of acorn 7.x)

## 5.2.1 - 2022-05-27
* Update to "minimist": "^1.2.6" from "^1.1.1" to quiet down dependabot security theater.

## 5.2.0 - 2019-01-28
* Use acorn-node's option defaults, adds support for new ES features (https://github.com/browserify/detective/pull/81)

## 5.1.0 - 2018-02-28
* Use acorn-node parser, which matches latest Node syntax support (https://github.com/browserify/detective/pull/78)
* Add basic cli: `detective index.js` outputs dependency names (https://github.com/browserify/detective/pull/51)

## 5.0.2 - 2018-01-06
* Extend support back to 0.8 until we can determine a LTS plan.

## 5.0.1 - 2018-01-02
* Add engines field set to `>=4.0.0`.

## 5.0.0 - 2018-01-02
* Fix: Don't crash on files with the spread operator (https://github.com/browserify/detective/pull/75)
* Breaking: Drop support for node 0.12 (https://github.com/browserify/detective/pull/75)
