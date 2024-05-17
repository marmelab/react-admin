import * as React from 'react';

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
