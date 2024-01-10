import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'ra-no-code';
import { defaultTheme } from 'react-admin';
import { createTheme } from '@mui/material/styles';

// FIXME Material UI bug https://github.com/mui/material-ui/issues/13394
const theme = createTheme(defaultTheme);

ReactDOM.render(
    <React.StrictMode>
        <Root theme={theme} />
    </React.StrictMode>,
    document.getElementById('root')
);
