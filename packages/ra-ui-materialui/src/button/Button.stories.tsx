import * as React from 'react';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { Button } from './Button';

const theme = createTheme();

export default { title: 'ra-ui-materialui/button/Button' };

export const Basic = () => (
    <ThemeProvider theme={theme}>
        <Button label="button" />
    </ThemeProvider>
);

export const WithIcon = () => (
    <ThemeProvider theme={theme}>
        <Button label="button">
            <AddIcon />
        </Button>
    </ThemeProvider>
);
