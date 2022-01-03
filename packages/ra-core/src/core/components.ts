import CoreAdminContext, { AdminContextProps } from './CoreAdminContext';
import CoreAdminUI, { AdminUIProps } from './CoreAdminUI';
import createAdminStore from './createAdminStore';

export * from './CoreAdmin';
export * from './CoreAdminRouter';
export * from './CustomRoutes';
export * from './Resource';

export type { AdminContextProps, AdminUIProps };

export { CoreAdminContext, CoreAdminUI, createAdminStore };
