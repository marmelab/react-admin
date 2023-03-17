#!/usr/bin/env node
"use strict";
if (process.env.OXIDE) {
    module.exports = require("./oxide/cli");
} else {
    module.exports = require("./cli/index");
}
