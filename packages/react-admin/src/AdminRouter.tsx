import * as React from 'react';
import { FC } from 'react';
import { CoreAdminRouter, AdminRouterProps } from 'ra-core';
import { LoadingPage } from 'ra-ui-materialui';

const AdminRouter: FC<AdminRouterProps> = props => (
    <CoreAdminRouter {...props} />
);

AdminRouter.defaultProps = {
    loading: LoadingPage,
};

export default AdminRouter;
