#!/bin/bash

set +e  # Don't exit on error immediately
source ./.env
RA_ENTERPRISE_PATH="${RA_ENTERPRISE_PATH:-../ra-enterprise}"
RA_DOC_PATH="${RA_DOC_PATH:-../react-admin-doc}"

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

error() {
    echo -e "\033[1;31m$1\033[0m"
}

success() {
    echo -e "\033[1;32m$1\033[0m"
}

retry_step() {
    local step_name="$1"
    local step_command="$2"

    while true; do
        step "$step_name"
        if eval "$step_command"; then
            success "✓ $step_name completed successfully"
            break
        else
            error "✗ $step_name failed"
            echo ""
            echo "Options:"
            echo "1. Retry this step"
            echo "2. Skip this step (continue with release)"
            echo "3. Abort release"
            read -p "Choose (1/2/3): " choice

            case $choice in
                1)
                    echo "Retrying..."
                    continue
                    ;;
                2)
                    warn "⚠ Skipping $step_name"
                    break
                    ;;
                3)
                    error "Release aborted by user"
                    exit 1
                    ;;
                *)
                    echo "Invalid choice, please enter 1, 2, or 3"
                    ;;
            esac
        fi
    done
}

manual_step() {
    local step_name="$1"
    local instructions="$2"

    while true; do
        step "$step_name"
        echo "$instructions"
        echo "Press Enter when this is done, or 'q' to quit"
        read -r response

        if [ "$response" = "q" ] || [ "$response" = "Q" ]; then
            error "Release aborted by user"
            exit 1
        else
            success "✓ $step_name marked as completed"
            break
        fi
    done
}

if [ ! -z "$RELEASE_DRY_RUN" ]; then
    echo "Dry run mode is enabled"
fi

info "Starting the release process"

# Step 0: Check npm authentication
if [ -z "$RELEASE_DRY_RUN" ]; then
    retry_step "Check npm authentication" "
        if npm whoami > /dev/null 2>&1; then
            echo \"✓ npm authentication verified\"
        else
            echo \"✗ You appear to not be logged in to npm\"
            echo \"Please run 'npm login' (in a new terminal) to authenticate with npm\"
            echo \"Press Enter after logging in, or 'q' to quit\"
            read -r response
            if [ \"\$response\" = \"q\" ] || [ \"\$response\" = \"Q\" ]; then
                echo \"Release aborted by user\"
                exit 1
            fi
            npm whoami > /dev/null 2>&1
        fi
    "
else
    info "dry mode -- skipping npm authentication check"
fi

# Step 1: Install
retry_step "make install" "make install"

# Step 2: Build
retry_step "make build" "make build"

# Step 3: EE Tests
if [ -d $RA_ENTERPRISE_PATH ]; then
    current_dir=$(pwd)
    retry_step "Run the EE build" "
        cp -r packages/* \$RA_ENTERPRISE_PATH/node_modules &&
        cd \$RA_ENTERPRISE_PATH &&
        rm -rf node_modules/react-admin/node_modules/@mui &&
        rm -rf node_modules/react-admin/node_modules/ra-ui-materialui &&
        make build
    "
    retry_step "Run the EE tests" "
        CI=true DEBUG_PRINT_LIMIT=3 make test
    "
    cd "$current_dir"
else
    manual_step "Run the EE tests" "
Cannot find the $RA_ENTERPRISE_PATH folder in the repository parent directory
Copy the packages folder content inside the node_modules of ra-enterprise, then run a full build and run the tests
Tip: You can use the 'copy-ra-oss-packages-to-ee.sh' script if you have it"
fi

# Step 4: Manual demo tests
manual_step "Run the demos" "Test the 3 demos (simple, e-commerce, crm): check console & UI"

# Get versions before lerna version
retry_step "Get current version" "
    npm_previous_package_version=\$(jq -r '.version' ./packages/react-admin/package.json) &&
    npm_previous_package_minor_version=\${npm_previous_package_version%.*} &&
    echo \"Current version: \$npm_previous_package_version\"
"

# Step 5: Lerna version
retry_step "lerna version" "./node_modules/.bin/lerna version --force-publish --no-push"

# Get new version and handle tag
retry_step "Process version changes" "
    npm_current_package_version=\$(jq -r '.version' ./packages/react-admin/package.json) &&
    npm_current_package_minor_version=\${npm_current_package_version%.*} &&
    echo \"New version: \$npm_current_package_version\" &&
    echo \"Removing tag v\${npm_current_package_version} created by lerna\" &&
    git tag -d \"v\${npm_current_package_version}\" &&
    if [ ! -z \"\$RELEASE_DRY_RUN\" ]; then
        echo \"dry mode -- Resetting the workspace to the last commit\" &&
        git reset --soft HEAD~1
    fi
"

# Step 6: Handle minor version updates
# We use perl rather than sed for in-place edits: BSD sed (macOS) requires an
# argument for -i and doesn't expand \n in the replacement, while perl behaves
# the same on macOS and Linux. Versions are passed through the environment to
# keep the perl program single-quoted across the eval done by retry_step.
if [ "$npm_previous_package_minor_version" != "$npm_current_package_minor_version" ]; then
    retry_step "Update OldVersions.md" "
        PREV_MINOR=\"\$npm_previous_package_minor_version\" CUR_MINOR=\"\$npm_current_package_minor_version\" PREV_VERSION=\"\$npm_previous_package_version\" perl -pi -e 's|^- \[v\$ENV{PREV_MINOR}\].*|- [v\$ENV{CUR_MINOR}](https://github.com/marmelab/react-admin/blob/master/docs/Admin.md)\n- [v\$ENV{PREV_MINOR}](https://github.com/marmelab/react-admin/blob/v\$ENV{PREV_VERSION}/docs/Admin.md)|' docs/OldVersions.md
    "

    manual_step "Review OldVersions.md" "Please review the docs/OldVersions.md file and update it if needed."

    if [ -z "$RELEASE_DRY_RUN" ]; then
        retry_step "Commit OldVersions.md" "
            git add . &&
            git commit -m \"Update docs/OldVersions.md for version \${npm_current_package_version}\"
        "
    fi

    retry_step "Update create-react-admin templates" "yarn run update-create-react-admin-deps \${npm_current_package_version}"

    if [ -z "$RELEASE_DRY_RUN" ]; then
        retry_step "Commit template updates" "
            git add . &&
            git commit -m \"Update create-react-admin templates dependencies for version \${npm_current_package_version}\"
        "
    fi
fi

# Step 7: Update changelog
retry_step "Generate changelog" "yarn run update-changelog \${npm_current_package_version}"

manual_step "Review changelog" "Please review the ./CHANGELOG.md file and update it if needed."

if [ -z "$RELEASE_DRY_RUN" ]; then
    retry_step "Commit changelog" "
        git add CHANGELOG.md &&
        git commit -m \"Update changelog for version \${npm_current_package_version}\"
    "
fi

# Step 8: Git tag
if [ -z "$RELEASE_DRY_RUN" ]; then
    retry_step "Create git tag" "
        echo \"Creating new tag v\${npm_current_package_version}\" &&
        git tag \"v\${npm_current_package_version}\" -m \"v\${npm_current_package_version}\"
    "
else
    info "dry mode -- skipping git tag"
fi

# Step 9: Git push
if [ -z "$RELEASE_DRY_RUN" ]; then
    retry_step "Push to git" "
        echo \"Pushing commits and tags to git\" &&
        git push origin HEAD &&
        git push origin --tags
    "
else
    info "dry mode -- skipping git push"
fi

# Step 10: Publish packages
if [ -z "$RELEASE_DRY_RUN" ]; then
    retry_step "Publish packages" "./node_modules/.bin/lerna publish from-package"
else
    info "dry mode -- skipping lerna publish"
fi

# Step 11: Update milestones
retry_step "Update milestones" "yarn run update-milestones \${npm_current_package_version}"

# Step 12: Create GitHub release
retry_step "Create GitHub release" "yarn run create-github-release \${npm_current_package_version}"

# Step 13: Update documentation
# perl rather than sed for the same portability reason as in step 6
if [ -d $RA_DOC_PATH ]; then
    retry_step "Update documentation" "
        cd \$RA_DOC_PATH &&
        git pull &&
        cd - &&
        RA_DOC_PATH=\"\$RA_DOC_PATH\" VERSION=\"\$npm_current_package_minor_version\" ./scripts/copy-ra-oss-docs.sh &&
        CUR_VERSION=\"\$npm_current_package_version\" perl -pi -e 's/^(- latest).*/\$1 (\$ENV{CUR_VERSION})/' \$RA_DOC_PATH/_data/versions.yml &&
        if [ \"\$npm_previous_package_minor_version\" != \"\$npm_current_package_minor_version\" ]; then
            PREV_MINOR=\"\$npm_previous_package_minor_version\" perl -pi -e 's/^(- latest.*)/\$1\n- \"\$ENV{PREV_MINOR}\"/' \$RA_DOC_PATH/_data/versions.yml
        fi &&
        if [ -z \"\$RELEASE_DRY_RUN\" ]; then
            cd \$RA_DOC_PATH &&
            git add . &&
            git commit -m \"Update the documentation for version \$npm_current_package_version\" &&
            git push &&
            cd -
        fi
    "
else
    manual_step "Update documentation" "
Cannot find the $RA_DOC_PATH folder in the repository parent directory
Please update the documentation manually
You can use the 'copy-ra-oss-docs.sh' script if you have it"
fi

success "🎉 The ${npm_current_package_version} release is done! 🎉"
