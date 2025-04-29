#!/bin/bash

# Configure git
git config --global user.email "react-admin@marmelab.com"
git config --global user.name "React-Admin CI"

# Configure ssh keys
mkdir --parents "$HOME/.ssh"
DEPLOY_KEY_FILE="$HOME/.ssh/deploy_key"
echo "${SSH_SANDBOX_DEPLOY_KEY}" > "$DEPLOY_KEY_FILE"
chmod 600 "$DEPLOY_KEY_FILE"
SSH_KNOWN_HOSTS_FILE="$HOME/.ssh/known_hosts"
ssh-keyscan -H github.com > "$SSH_KNOWN_HOSTS_FILE"

# Override the default git ssh command so that it includes our ssh key
export GIT_SSH_COMMAND="ssh -i "$DEPLOY_KEY_FILE" -o UserKnownHostsFile=$SSH_KNOWN_HOSTS_FILE"

# Clone the demo repository inside a temporary directory
TEMPD=$(mktemp -d)
echo $TEMPD
(git clone ${SANDBOX_REPOSITORY} $TEMPD)

# Clean it up to ensure we don't keep deleted files
(rm -rf $TEMPD/src)
(rm -rf $TEMPD/assets)

# Copy the demo files into the temporary directory
(cp -r ./examples/simple/. $TEMPD)
# Install dependencies to that the sandbox has a lock file
yarn install --cwd $TEMPD

# Update the demo repository
(cd $TEMPD && git add -A && git commit --allow-empty -m "Update sandbox" && git push)
