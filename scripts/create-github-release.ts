import 'dotenv/config';
import { Octokit } from '@octokit/core';
import fs from 'fs';
import path from 'path';

const main = async () => {
    if (process.env.RELEASE_DRY_RUN) {
        console.log('Dry run mode is enabled');
    }

    if (!process.env.GITHUB_ACCESS_TOKEN) {
        console.error(
            'Please provide the GITHUB_ACCESS_TOKEN variable in the .env file'
        );
        process.exit(1);
    }

    const version = process.argv[2];

    if (!version || !version.match(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/)) {
        console.error(`Invalid version provided: ${version}`);
        console.error('Usage: yarn run create-github-release <version>');
        process.exit(1);
    }

    const tag_name = `v${version}`;

    const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN,
    });

    console.log(`Fetching latest releases`);
    const releases = await octokit.request(
        'GET /repos/{owner}/{repo}/releases',
        {
            owner: 'marmelab',
            repo: 'react-admin',
        }
    );

    const alreadyExistingRelease = releases.data.find(
        release => release.tag_name === tag_name
    );

    if (alreadyExistingRelease) {
        console.log(`Release ${version} already exists.`);
        return;
    }

    console.log(`Parsing changelog for release ${version}`);

    // Read the changelog file
    const changelogFilePath = path.join(__dirname, '../CHANGELOG.md');
    const changelogContent = fs.readFileSync(changelogFilePath, 'utf-8');

    // Create a regular expression to capture the changelog entries for the specified version
    const regex = new RegExp(
        `## ${version.replace(/\./g, '\\.')}\n\n([\\s\\S]*?)\n##`,
        'g'
    );
    const match = regex.exec(changelogContent);

    if (!match) {
        console.error(
            `Could not find changelog entries for version ${version}`
        );
        process.exit(1);
    }

    const changelogEntries = match[1].trim();

    console.log(`Creating release ${version} from tag ${tag_name}`);

    if (process.env.RELEASE_DRY_RUN) {
        console.log(
            'Would have called GitHub API with',
            'POST /repos/{owner}/{repo}/releases',
            {
                owner: 'marmelab',
                repo: 'react-admin',
                tag_name,
                name: version,
                body: changelogEntries,
            }
        );
    } else {
        await octokit.request('POST /repos/{owner}/{repo}/releases', {
            owner: 'marmelab',
            repo: 'react-admin',
            tag_name,
            name: version,
            body: changelogEntries,
        });
    }

    console.log(`Release ${version} created successfully.`);
};

main();
