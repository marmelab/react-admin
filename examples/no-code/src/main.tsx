import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'ra-no-code';
import { defaultTheme } from 'react-admin';
import {
    unstable_createMuiStrictModeTheme,
    createMuiTheme,
} from '@material-ui/core/styles';

// FIXME MUI bug https://github.com/mui-org/material-ui/issues/13394
const theme =
    process.env.NODE_ENV !== 'production'
        ? unstable_createMuiStrictModeTheme(defaultTheme)
        : createMuiTheme(defaultTheme);

ReactDOM.render(
    <React.StrictMode>
        <Root theme={theme} />
    </React.StrictMode>,
    document.getElementById('root')
);
