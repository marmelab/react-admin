#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';
import { QueryClient, QueryClientProvider } from 'react-query';

const cli = meow(
    `
	Usage
	  $ ra-ts-generator <paths>

    <paths>
        A list of paths to files containing react-admin resources types.
        They must be named exports.
        They must have a JsDoc comment with a @resource tag.

        If no paths are provided, the CLI will look for a file named types.ts in the src directory.

    Options
	  --out, -o     The output directory. Default to ./src/generated

    Examples
	  $ ra-ts-generator ./src/types.ts
`,
    {
        importMeta: import.meta,
        flags: {
            out: {
                type: 'string',
                shortFlag: 'o',
                default: './src/generated',
            },
        },
    }
);

if (cli.flags.h) {
    cli.showHelp();
} else {
    render(
        // @ts-ignore
        <QueryClientProvider client={new QueryClient()}>
            <App fileNames={cli.input} out={cli.flags.out} />
        </QueryClientProvider>
    );
}
