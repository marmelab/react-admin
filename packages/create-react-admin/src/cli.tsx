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
	  --interactive    Enable the CLI interactive mode
	  --data-provider  Set the data provider to use ("ra-data-fakerest", "ra-data-simple-rest", "ra-data-json-server" or "none")
	  --auth-provider  Set the auth provider to use ("local-auth-provider" or "none")
	  --resource       Add a resource that will be initialized with guessers (can be used multiple times). Set to "skip" to bypass the interactive resource step.
	  --install        Set the package manager to use for installing dependencies ("yarn", "npm", "pnpm", "bun" or "skip" to bypass the interactive install step)

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
                choices: ['yarn', 'npm', 'skip'],
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
    const dataProvider =
        cli.flags.dataProvider ?? (cli.flags.interactive ? undefined : 'none');
    const authProvider =
        cli.flags.authProvider ?? (cli.flags.interactive ? undefined : 'none');
    const install =
        cli.flags.install ?? (cli.flags.interactive ? undefined : 'npm');
    const resources =
        cli.flags.resource.length > 0
            ? cli.flags.resource
            : cli.flags.interactive
              ? undefined
              : ['skip'];

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
