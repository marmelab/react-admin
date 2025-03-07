#!/bin/bash

set -e
source ./.env
RA_ENTERPRISE_PATH="${RA_ENTERPRISE_PATH:-../ra-enterprise}"

info() {
    echo -e "\033[1;34m$1\033[0m"
}

warn() {
    echo -e "\033[1;33m$1\033[0m"
}

step() {
    echo ""
    info "$1"
}

if [ ! -z "$RELEASE_DRY_RUN" ]; then
    echo "Dry run mode is enabled"
fi

info "Starting the release process"

step "make install"
make install

step "make build"
make build

step "Run the EE tests"
if [ -d $RA_ENTERPRISE_PATH ]; then
    cp -r packages/* $RA_ENTERPRISE_PATH/node_modules
    # We must remove the @mui directory from the react-admin node_modules to avoid conflicts
    ( cd $RA_ENTERPRISE_PATH && rm -rf node_modules/react-admin/node_modules/@mui && make build && CI=true make test )
else
    warn "Cannot find the $RA_ENTERPRISE_PATH folder in the repository parent directory"
    echo "Copy the the packages folder content inside the node_modules of ra-enterprise, then run a full build and run the tests"
    echo "Tip: You can use the 'copy-ra-oss-packages-to-ee.sh' script if you have it"
    echo "Press Enter when this is done"
    read
fi

step "manual tests: Run the demos"
echo "Test the 3 demos (simple, e-commerce, crm): check console & UI"
echo "Press Enter when this is done"
read

step "manual task: Update the create-react-admin dependencies"
echo "[Minor version only] Update the dependencies to RA packages in the create-react-admin templates && commit"
echo "Press Enter when this is done"
read

# Get the current version from package.json
npm_current_package_version=$(jq -r '.version' ./packages/react-admin/package.json)

step "lerna version"
# Running lerna version
# This will create a commit and a tag
./node_modules/.bin/lerna version --force-publish --no-push

# Get the version from package.json
npm_package_version=$(jq -r '.version' ./packages/react-admin/package.json)

# Remove the tag created by lerna
echo "Removing tag v${npm_package_version} created by lerna"
git tag -d "v${npm_package_version}"
if [ ! -z "$RELEASE_DRY_RUN" ]; then
    # In dry-run mode, reset the last commit to avoid accidental push
    echo "dry mode -- Resetting the workspace to the last commit"
    git reset --soft HEAD~1
fi

step "update-changelog"
yarn run update-changelog ${npm_package_version}
echo "Please review the ./CHANGELOG.md file and update it if needed."
echo "Press Enter when this is done"
read
if [ -z "$RELEASE_DRY_RUN" ]; then
    echo "Committing the changelog"
    git add CHANGELOG.md
    git commit -m "Update changelog for version ${npm_package_version}"
fi

step "git tag"
if [ -z "$RELEASE_DRY_RUN" ]; then
    echo "Creating new tag v${npm_package_version}"
    git tag "v${npm_package_version}"
else
    echo "dry mode -- skipping git tag"
fi

step "git push"
if [ -z "$RELEASE_DRY_RUN" ]; then
    echo "Pushing commits and tags to git"
    git push origin HEAD
    git push origin --tags
else
    echo "dry mode -- skipping git push"
fi

step "lerna publish"
if [ -z "$RELEASE_DRY_RUN" ]; then
    # explicitly publish packages where the latest version is not present in the registry
    ./node_modules/.bin/lerna publish from-package
else
    echo "dry mode -- skipping lerna publish"
fi

step "update-milestones"
yarn run update-milestones ${npm_package_version}

step "create-github-release"
yarn run create-github-release ${npm_package_version}

if [ -d ../react-admin-doc ]; then
    step "Update the documentation"
    # ${npm_package_version%.*} extract the major.minor version
    VERSION="${npm_package_version%.*}" ./scripts/copy-ra-oss-docs.sh
    # Set the latest version in the versions.yml file
    sed -i "/^\(- latest\).*/s//\1 \($npm_package_version\)/" ../react-admin-doc/_data/versions.yml
    if [ "${npm_current_package_version%.*}" == "${npm_package_version%.*}" ]; then
        # Add the previous minor version to the list of versions in the versions.yml file
        sed -i "/^\(- latest.*\)/s//\1 \n- \"${npm_package_version%.*}\"/" ../react-admin-doc/_data/versions.yml
    fi
else
    warn "Cannot find the react-admin-doc folder in the repository parent directory"
    step "manual step: Update the documentation"
    echo "You can use the 'copy-ra-oss-docs.sh' script if you have it"
    echo "Press Enter when this is done"
    read
fi

step "The ${npm_package_version} release is done! 🎉"