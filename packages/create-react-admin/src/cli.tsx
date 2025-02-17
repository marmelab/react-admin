#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';
import { SupportedDataProviders } from './StepDataProvider.js';
import { SupportedAuthProviders } from './StepAuthProvider.js';

const dataProviderShortcuts = {
    fakerest: 'ra-data-fakerest',
    'json-server': 'ra-data-json-server',
    'simple-rest': 'ra-data-simple-rest',
    supabase: 'ra-supabase',
};

const getDataProviderName = (dataProvider: string | undefined) => {
    if (dataProviderShortcuts[dataProvider]) {
        return dataProviderShortcuts[dataProvider];
    }
    return dataProvider;
};

const getDataProvider = (flags: typeof cli.flags) => {
    if (flags.dataProvider) return getDataProviderName(flags.dataProvider);
    if (flags.interactive) return undefined;
    return 'none';
};

const authProviderShortcuts = {
    local: 'local-auth-provider',
};

const getAuthProviderName = (authProvider: string | undefined) => {
    if (authProviderShortcuts[authProvider]) {
        return authProviderShortcuts[authProvider];
    }
    return authProvider;
};

const getAuthProvider = (flags: typeof cli.flags) => {
    if (
        getDataProviderName(flags.dataProvider) === 'ra-supabase' &&
        flags.authProvider != null
    ) {
        console.error("Don't provide an auth-provider when using ra-supabase");
        process.exit(1);
    }
    if (flags.authProvider) return getAuthProviderName(flags.authProvider);
    if (flags.dataProvider === 'ra-supabase') return 'none';
    if (flags.interactive) return undefined;
    return 'none';
};

const getInstall = (flags: typeof cli.flags) => {
    if (flags.install) return flags.install;
    if (flags.interactive) return undefined;
    return 'npm';
};

const getResources = (flags: typeof cli.flags) => {
    if (flags.resource.length > 0) return flags.resource;
    if (flags.interactive) return undefined;
    return ['skip'];
};

const cli = meow(
    `
	Usage
	  $ create-admin-app <name>

    Options
	  --interactive    Enable the CLI interactive mode
	  --data-provider  Set the data provider to use ("ra-data-fakerest", "ra-data-simple-rest", "ra-data-json-server", "ra-supabase" or "none")
	  --auth-provider  Set the auth provider to use ("local-auth-provider" or "none")
	  --resource       Add a resource that will be initialized with guessers (can be used multiple times). Set to "skip" to bypass the interactive resource step.
	  --install        Set the package manager to use for installing dependencies ("yarn", "npm", "bun" or "skip" to bypass the interactive install step)

    Examples
	  $ create-admin-app my-admin
	  $ create-admin-app my-admin --data-provider ra-data-json-server --auth-provider local-auth-provider --resource posts --resource comments --install npm
`,
    {
        flags: {
            help: {
                type: 'boolean',
                alias: 'h',
            },
            interactive: {
                type: 'boolean',
                alias: 'i',
            },
            dataProvider: {
                type: 'string',
                choices: SupportedDataProviders.map(choice => choice.value),
            },
            authProvider: {
                type: 'string',
                choices: SupportedAuthProviders.map(choice => choice.value),
            },
            resource: {
                type: 'string',
                isMultiple: true,
            },
            install: {
                type: 'string',
                choices: ['yarn', 'npm', 'bun', 'skip'],
            },
        },
    }
);

if (cli.flags.h) {
    cli.showHelp();
} else {
    const name = cli.input.length > 0 ? cli.input[0].trim() : undefined;
    if (!name && !cli.flags.interactive) {
        console.error(
            'Please provide a name for your admin application: create-admin-app <name>'
        );
        process.exit(1);
    }
    const dataProvider = getDataProvider(cli.flags);
    const authProvider = getAuthProvider(cli.flags);
    const install = getInstall(cli.flags);
    const resources = getResources(cli.flags);

    render(
        <App
            name={name}
            dataProvider={dataProvider}
            authProvider={authProvider}
            resources={resources}
            install={install}
        />
    );
}
