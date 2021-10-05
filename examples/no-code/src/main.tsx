import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'ra-no-code';
import { defaultTheme } from 'react-admin';
import {
    unstable_createMuiStrictModeTheme,
    createMuiTheme,
    adaptV4Theme,
} from '@mui/material/styles';

// FIXME MUI bug https://github.com/mui-org/material-ui/issues/13394
const theme =
    process.env.NODE_ENV !== 'production'
        ? unstable_createMuiStrictModeTheme(defaultTheme)
        : createMuiTheme(adaptV4Theme(defaultTheme));

ReactDOM.render(
    <React.StrictMode>
        <Root theme={theme} />
    </React.StrictMode>,
    document.getElementById('root')
);
