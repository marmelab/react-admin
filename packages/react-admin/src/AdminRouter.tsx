import * as React from 'react';
import { FC } from 'react';
import { CoreAdminRouter, AdminRouterProps } from 'ra-core';
import { Loading } from 'ra-ui-materialui';

const AdminRouter: FC<AdminRouterProps> = props => (
    <CoreAdminRouter {...props} />
);

AdminRouter.defaultProps = {
    loading: Loading,
};

export default AdminRouter;
