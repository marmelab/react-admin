import CoreAdmin from './CoreAdmin';
import CoreAdminContext, { AdminContextProps } from './CoreAdminContext';
import CoreAdminRouter, { AdminRouterProps } from './CoreAdminRouter';
import CoreAdminUI, { AdminUIProps } from './CoreAdminUI';
import createAdminStore from './createAdminStore';
import RoutesWithLayout, { RoutesWithLayoutProps } from './RoutesWithLayout';
import Resource from './Resource';

export type {
    AdminContextProps,
    AdminRouterProps,
    AdminUIProps,
    RoutesWithLayoutProps,
};

export {
    CoreAdmin,
    CoreAdminContext,
    CoreAdminRouter,
    CoreAdminUI,
    createAdminStore,
    RoutesWithLayout,
    Resource,
};
