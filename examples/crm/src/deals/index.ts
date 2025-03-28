import * as React from 'react';
const DealList = React.lazy(() => import('./DealList'));

export default {
    list: DealList,
};
