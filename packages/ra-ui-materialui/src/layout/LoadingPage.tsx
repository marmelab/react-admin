import * as React from 'react';
import {
    adaptV4Theme,
    Theme,
    StyledEngineProvider,
} from '@mui/material/styles';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/styles';

import { createMuiTheme } from './createMuiTheme';
import Loading from './Loading';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const LoadingPage = ({ theme, ...props }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <Loading {...props} />
        </ThemeProvider>
    </StyledEngineProvider>
);

LoadingPage.propTypes = {
    theme: PropTypes.object,
    classes: PropTypes.object,
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};

LoadingPage.defaultProps = {
    theme: createMuiTheme(adaptV4Theme({})),
    loadingPrimary: 'ra.page.loading',
    loadingSecondary: 'ra.message.loading',
};

export default LoadingPage;
