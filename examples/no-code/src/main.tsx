import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'ra-no-code';
import { defaultTheme } from 'react-admin';
import { createTheme } from '@mui/material/styles';

// FIXME MUI bug https://github.com/mui-org/material-ui/issues/13394
const theme = createTheme(defaultTheme);

ReactDOM.render(
    <React.StrictMode>
        <Root theme={theme} />
    </React.StrictMode>,
    document.getElementById('root')
);
