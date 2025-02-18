#!/bin/bash

echo "Running pre-publish script for version ${npm_package_version}"
cd ../..
yarn run update-changelog ${npm_package_version}
