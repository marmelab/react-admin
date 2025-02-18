#!/bin/bash

set -e

info() {
    echo -e "\033[1;34m$1\033[0m"
}

step() {
    echo ""
    info "$1"
}

info "Running post-publish script for version ${npm_package_version}"
cd ../..

step "update-milestones"
yarn run update-milestones ${npm_package_version}

step "create-github-release"
yarn run create-github-release ${npm_package_version}

step "manual step: Update the documentation"
echo "You can use the 'copy-ra-oss-docs.sh' script if you have it"
echo "Press Enter when this is done"
read

step "The release is done! 🎉"
