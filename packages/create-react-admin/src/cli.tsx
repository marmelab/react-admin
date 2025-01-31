#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';
import { SupportedDataProviders } from './StepDataProvider.js';
import { SupportedAuthProviders } from './StepAuthProvider.js';

const cli = meow(
    `
	Usage
	  $ create-admin-app <name>

    Options
	  --data-provider  Set the data provider to use ("ra-data-fakerest", "ra-data-simple-rest", "ra-data-json-server" or "none")
	  --auth-provider  Set the auth provider to use ("local-auth-provider" or "none")
	  --resource       Add a resource that will be initialized with guessers (can be used multiple times). Set to "skip" to bypass the interactive resource step.
	  --install        Set the package manager to use for installing dependencies ("yarn", "npm" or "skip" to bypass the interactive install step)
	  --basic          Skip all the interactive steps and create a basic app with no data provider, no auth provider, no resources and no install step

    Examples
	  $ create-admin-app my-admin
	  $ create-admin-app my-admin --data-provider ra-data-json-server --auth-provider local-auth-provider --resource posts --resource comments --install npm
	  $ create-admin-app my-admin --basic
`,
    {
        flags: {
            help: {
                type: 'boolean',
                alias: 'h',
            },
            basic: {
                type: 'boolean',
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
                choices: ['yarn', 'npm', 'skip'],
            },
        },
    }
);

if (cli.flags.h) {
    cli.showHelp();
} else {
    const dataProvider = cli.flags.basic ? 'none' : cli.flags.dataProvider;
    const authProvider = cli.flags.basic ? 'none' : cli.flags.authProvider;
    const install = cli.flags.basic ? 'skip' : cli.flags.install;
    const resources =
        cli.flags.basic ||
        cli.flags.resource.includes('skip')
            ? []
            : cli.flags.resource;

    render(
        <App
            name={cli.input.length > 0 ? cli.input[0] : undefined}
            dataProvider={dataProvider}
            authProvider={authProvider}
            resources={resources}
            install={install}
        />
    );
}
