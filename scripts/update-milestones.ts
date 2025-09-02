import 'dotenv/config';
import { Octokit } from '@octokit/core';
import { addWeeks, addMonths, formatISO } from 'date-fns';

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

    const current_version = process.argv[2];

    if (
        !current_version ||
        !current_version.match(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/)
    ) {
        console.error(`Invalid version provided: ${current_version}`);
        console.error('Usage: yarn run update-milestones <current_version>');
        process.exit(1);
    }

    const current_version_array = current_version.split('.').map(Number);
    const next_patch_version = [
        current_version_array[0],
        current_version_array[1],
        current_version_array[2] + 1,
    ].join('.');
    const next_minor_version = [
        current_version_array[0],
        current_version_array[1] + 1,
        0,
    ].join('.');

    const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN,
    });

    console.log(`Fetching currently open milestones`);
    const open_milestones = await octokit.request(
        'GET /repos/{owner}/{repo}/milestones',
        {
            owner: 'marmelab',
            repo: 'react-admin',
            state: 'open',
        }
    );

    const current_milestone = open_milestones.data.find(
        milestone => milestone.title === current_version
    );
    if (!current_milestone) {
        console.log(`No open milestone for current version ${current_version}`);
    } else {
        console.log(`Closing milestone for current version ${current_version}`);

        if (process.env.RELEASE_DRY_RUN) {
            console.log(
                'Would have called GitHub API with',
                'PATCH /repos/{owner}/{repo}/milestones/{milestone_number}',
                {
                    owner: 'marmelab',
                    repo: 'react-admin',
                    milestone_number: current_milestone.number,
                    state: 'closed',
                }
            );
        } else {
            await octokit.request(
                'PATCH /repos/{owner}/{repo}/milestones/{milestone_number}',
                {
                    owner: 'marmelab',
                    repo: 'react-admin',
                    milestone_number: current_milestone.number,
                    state: 'closed',
                }
            );
        }
    }

    const next_patch_milestone = open_milestones.data.find(
        milestone => milestone.title === next_patch_version
    );
    if (next_patch_milestone) {
        console.log(
            `Milestone for next patch version ${next_patch_version} already exists`
        );
    } else {
        console.log(
            `Creating milestone for next patch version ${next_patch_version}`
        );

        if (process.env.RELEASE_DRY_RUN) {
            console.log(
                'Would have called GitHub API with',
                'POST /repos/{owner}/{repo}/milestones',
                {
                    owner: 'marmelab',
                    repo: 'react-admin',
                    title: next_patch_version,
                    state: 'open',
                    due_on: formatISO(addWeeks(new Date(), 1)),
                    description: 'patch version, for bug fixes',
                }
            );
        } else {
            await octokit.request('POST /repos/{owner}/{repo}/milestones', {
                owner: 'marmelab',
                repo: 'react-admin',
                title: next_patch_version,
                state: 'open',
                due_on: formatISO(addWeeks(new Date(), 1)),
                description: 'patch version, for bug fixes',
            });
        }
    }

    const next_minor_milestone = open_milestones.data.find(
        milestone => milestone.title === next_minor_version
    );
    if (next_minor_milestone) {
        console.log(
            `Milestone for next minor version ${next_minor_version} already exists`
        );
    } else {
        console.log(
            `Creating milestone for next minor version ${next_minor_version}`
        );

        if (process.env.RELEASE_DRY_RUN) {
            console.log(
                'Would have called GitHub API with',
                'POST /repos/{owner}/{repo}/milestones',
                {
                    owner: 'marmelab',
                    repo: 'react-admin',
                    title: next_minor_version,
                    state: 'open',
                    due_on: formatISO(addMonths(new Date(), 1)),
                    description: 'minor version, for new features',
                }
            );
        } else {
            await octokit.request('POST /repos/{owner}/{repo}/milestones', {
                owner: 'marmelab',
                repo: 'react-admin',
                title: next_minor_version,
                state: 'open',
                due_on: formatISO(addMonths(new Date(), 1)),
                description: 'minor version, for new features',
            });
        }
    }
};

main();
