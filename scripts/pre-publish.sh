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
echo "Please review the ./CHANGELOG.md file and update it if needed."
echo "Press Enter when done:"
read
if [ -z "$RELEASE_DRY_RUN" ]; then
    echo "Committing the changelog"
    git add CHANGELOG.md
    git commit -m "Update changelog for version ${npm_package_version}"
fi
