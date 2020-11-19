import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
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
    theme: {},
    loadingPrimary: 'ra.page.loading',
    loadingSecondary: 'ra.message.loading',
};

export default LoadingPage;
