import * as React from 'react';
import PropTypes from 'prop-types';

import { Loading } from './Loading';

export const LoadingPage = ({
    loadingPrimary = 'ra.page.loading',
    loadingSecondary = 'ra.message.loading',
    ...props
}) => (
    <Loading
        loadingPrimary={loadingPrimary}
        loadingSecondary={loadingSecondary}
        {...props}
    />
);

LoadingPage.propTypes = {
    theme: PropTypes.object,
    className: PropTypes.string,
    loadingPrimary: PropTypes.string,
    loadingSecondary: PropTypes.string,
};
