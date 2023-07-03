#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
    `
	Usage
	  $ create-admin-app <name>

    Examples
	  $ create-admin-app my-admin
`
);

if (cli.flags.h) {
    cli.showHelp();
} else {
    render(<App name={cli.input.length > 0 ? cli.input[0] : 'my-admin'} />);
}
