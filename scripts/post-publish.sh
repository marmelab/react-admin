#!/bin/bash

set -e

echo "Running post-publish script for version ${npm_package_version}"
cd ../..
yarn run update-milestones ${npm_package_version}
yarn run create-github-release ${npm_package_version}
