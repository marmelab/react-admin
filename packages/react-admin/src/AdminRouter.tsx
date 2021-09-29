import * as React from 'react';
import { CoreAdminRouter, AdminRouterProps } from 'ra-core';
import { LoadingPage } from 'ra-ui-materialui';

const AdminRouter = (props: AdminRouterProps) => <CoreAdminRouter {...props} />;

AdminRouter.defaultProps = {
    loading: LoadingPage,
};

export default AdminRouter;
