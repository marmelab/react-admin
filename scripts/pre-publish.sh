#!/bin/bash

set -e

info() {
    echo -e "\033[1;34m$1\033[0m"
}

step() {
    echo ""
    info "$1"
}

info "Running pre-publish script for version ${npm_package_version}"
cd ../..

step "update-changelog"
yarn run update-changelog ${npm_package_version}
