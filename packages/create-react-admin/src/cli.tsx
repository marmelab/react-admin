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
    render(
        <App
            name={cli.input.length > 0 ? cli.input[0] : undefined}
            dataProvider={cli.flags.dataProvider}
            authProvider={cli.flags.authProvider}
            resources={
                cli.flags.resource.includes('skip')
                    ? []
                    : cli.flags.resource.length > 0
                    ? cli.flags.resource
                    : undefined
            }
            install={cli.flags.install}
        />
    );
}
