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
        console.warn(
            'Providing an auth-provider when using ra-supabase is not supported. It will be ignored.'
        );
        return 'none';
    }
    if (flags.authProvider) return getAuthProviderName(flags.authProvider);
    if (getDataProviderName(flags.dataProvider) === 'ra-supabase')
        return 'none';
    if (flags.interactive) return undefined;
    return 'none';
};

const getDefaultInstaller = (userAgent: string) => {
    if (!userAgent) return 'npm';
    const pkgSpec = userAgent.split(' ')[0];
    const pkgSpecArr = pkgSpec.split('/');
    return pkgSpecArr[0];
};

const getInstall = (flags: typeof cli.flags, userAgent: string) => {
    if (flags.install) return flags.install;
    if (flags.interactive) return undefined;
    return getDefaultInstaller(userAgent);
};

const getResources = (flags: typeof cli.flags) => {
    if (flags.resource.length > 0) return flags.resource;
    if (flags.interactive) return undefined;
    return ['skip'];
};

const cli = meow(
    `
	Usage
	  $ create-react-admin <name>

    Options
	  --interactive    Enable the CLI interactive mode
	  --data-provider  Set the data provider to use ("fakerest", "simple-rest", "json-server", "supabase" or "none")
	  --auth-provider  Set the auth provider to use ("local-auth-provider" or "none")
	  --resource       Add a resource that will be initialized with guessers (can be used multiple times). Set to "skip" to bypass the interactive resource step.
	  --install        Set the package manager to use for installing dependencies ("yarn", "npm", "bun", "pnpm" or "skip" to bypass the interactive install step)

    Examples
	  $ npx create-react-admin@latest my-admin
	  $ npx create-react-admin@latest my-admin --data-provider json-server --auth-provider local-auth-provider --resource posts --resource comments --install npm
	  $ yarn create react-admin my-admin
	  $ yarn create react-admin my-admin --data-provider json-server --auth-provider local-auth-provider --resource posts --resource comments --install npm
	  $ bun create react-admin@latest my-admin
	  $ bun create react-admin@latest my-admin --data-provider json-server --auth-provider local-auth-provider --resource posts --resource comments --install npm
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
                choices: ['yarn', 'npm', 'bun', 'pnpm', 'skip'],
            },
        },
    }
);

if (cli.flags.h || cli.flags.help) {
    cli.showHelp();
} else {
    const name = cli.input.length > 0 ? cli.input[0].trim() : undefined;
    if (!name && !cli.flags.interactive) {
        console.error(
            'Please provide a name for your admin application: create-react-admin <name>'
        );
        process.exit(1);
    }
    const dataProvider = getDataProvider(cli.flags);
    const authProvider = getAuthProvider(cli.flags);
    const install = getInstall(cli.flags, process.env.npm_config_user_agent);
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
