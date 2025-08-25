import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OctokitResponse } from '@octokit/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { components } from '@octokit/openapi-types';

const prOrder = [
    'feature',
    'fix',
    '[doc]',
    '[typescript]',
    '[demo]',
    '[website]',
    '[storybook]',
    '[chore]',
    'bump',
];

const getOrderIndex = (title: string) => {
    // First pass: check if the title contains a keyword in brackets
    for (let i = 0; i < prOrder.length; i++) {
        if (!prOrder[i].includes('[')) continue;
        if (title.toLowerCase().includes(prOrder[i])) {
            return i;
        }
    }
    // Second pass: check for simple word matches
    for (let i = 0; i < prOrder.length; i++) {
        if (prOrder[i].includes('[')) continue;
        // feature is a special case, as we don't really have a keyword for it
        // nor words to look for
        if (prOrder[i] === 'feature') continue;
        if (title.toLowerCase().includes(prOrder[i])) {
            return i;
        }
    }
    // if nothing matches, let's assume it's a feature
    return prOrder.indexOf('feature');
};

const sortPrEntriesByTitle = (a: string, b: string) => {
    const aIndex = getOrderIndex(a);
    const bIndex = getOrderIndex(b);
    return aIndex - bIndex;
};

const sortPrEntries = (
    a: components['schemas']['issue-search-result-item'],
    b: components['schemas']['issue-search-result-item']
) => sortPrEntriesByTitle(a.title, b.title);

const fetchMilestonePrs = async (milestone_number: string) => {
    const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN,
    });

    let milestone_prs: OctokitResponse<
        {
            total_count: number;
            incomplete_results: boolean;
            items: components['schemas']['issue-search-result-item'][];
        },
        200
    >;
    try {
        milestone_prs = await octokit.request('GET /search/issues', {
            q: `repo:marmelab/react-admin is:pr milestone:${milestone_number}`,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
    } catch (error) {
        console.error(
            'Error fetching PRs from GitHub. Make sure your token has the right permissions.'
        );
        console.error(error);
        process.exit(1);
    }

    const items = milestone_prs.data.items;

    if (!items.length) {
        console.error(
            `Could not find any PR matching milestone ${milestone_number}.`
        );
        console.error('Is the milestone correct?');
        process.exit(1);
    }

    return items;
};

const generateChangelogContent = (
    milestone_number: string,
    items: components['schemas']['issue-search-result-item'][]
) => {
    const changelog_entries = items.map(
        pr =>
            `* ${pr.title} ([#${pr.number}](${pr.html_url})) ([${pr.user.login}](${pr.user.html_url}))`
    );

    const changelogContent = `\n## ${milestone_number}\n\n${changelog_entries.join('\n')}`;
    return changelogContent;
};

const writeChangelog = (changelogContent: string) => {
    // Read the existing changelog file
    const changelogFilePath = path.join(__dirname, '../CHANGELOG.md');
    const existingContent = fs.readFileSync(changelogFilePath, 'utf-8');

    // Split the content by lines and insert the new entries after the first line
    const lines = existingContent.split('\n');
    lines.splice(1, 0, changelogContent);

    // Write the updated content back to the changelog file
    fs.writeFileSync(changelogFilePath, lines.join('\n'));
};

const main = async () => {
    if (!process.env.GITHUB_ACCESS_TOKEN) {
        console.error(
            'Please provide the GITHUB_ACCESS_TOKEN variable in the .env file'
        );
        process.exit(1);
    }

    const milestone_number = process.argv[2];

    if (
        !milestone_number ||
        !milestone_number.match(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/)
    ) {
        console.error(`Invalid milestone provided: ${milestone_number}`);
        console.error('Usage: yarn run update-changelog <milestone>');
        process.exit(1);
    }

    console.log(`Generating changelog for version ${milestone_number}...`);

    const items = await fetchMilestonePrs(milestone_number);

    items.sort(sortPrEntries);

    const changelogContent = generateChangelogContent(milestone_number, items);

    writeChangelog(changelogContent);

    console.log('Changelog updated successfully.');
};

main();
