import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Loading from './Loading';

const LoadingPage = ({ theme, ...props }) => (
    <ThemeProvider theme={theme}>
        <Loading {...props} />
    </ThemeProvider>
);

LoadingPage.propTypes = {
    theme: PropTypes.object,
    classes: PropTypes.object,
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};

LoadingPage.defaultProps = {
    theme: createTheme({}),
    loadingPrimary: 'ra.page.loading',
    loadingSecondary: 'ra.message.loading',
};

export default LoadingPage;
