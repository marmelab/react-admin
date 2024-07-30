import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from 'ra-no-code';
import { defaultTheme } from 'react-admin';
import { createTheme } from '@mui/material/styles';

// FIXME Material UI bug https://github.com/mui/material-ui/issues/13394
const theme = createTheme(defaultTheme);

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Root theme={theme} />
    </React.StrictMode>
);
