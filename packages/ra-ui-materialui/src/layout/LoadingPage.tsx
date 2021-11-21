import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { Loading } from './Loading';

export const LoadingPage = ({
    theme = DefaultTheme,
    loadingPrimary = 'ra.page.loading',
    loadingSecondary = 'ra.message.loading',
    ...props
}) => (
    <ThemeProvider theme={theme}>
        <Loading
            loadingPrimary={loadingPrimary}
            loadingSecondary={loadingSecondary}
            {...props}
        />
    </ThemeProvider>
);

LoadingPage.propTypes = {
    theme: PropTypes.object,
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};

const DefaultTheme = createTheme({});
