#!/bin/bash

set -e

info() {
    echo -e "\033[1;34m$1\033[0m"
}

step() {
    echo ""
    info "$1"
}

info "Starting the release process"

step "make install"
make install

step "make build"
make build

step "manual tests: Run the EE tests"
echo "Copy the the packages folder content inside the node_modules of ra-enterprise, then run a full build and run the tests"
echo "Tip: You can use the 'copy-ra-oss-packages-to-ee.sh' script if you have it"
echo "Press Enter when this is done"
read

step "manual tests: Run the demos"
echo "Test the 3 demos (simple, e-commerce, crm): check console & UI"
echo "Press Enter when this is done"
read

step "manual task: Update the create-react-admin dependencies"
echo "[Minor version only] Update the dependencies to RA packages in the create-react-admin templates && commit"
echo "Press Enter when this is done"
read

step "lerna publish"
./node_modules/.bin/lerna publish --force-publish
