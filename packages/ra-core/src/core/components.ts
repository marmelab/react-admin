import CoreAdmin from './CoreAdmin';
import CoreAdminContext, { AdminContextProps } from './CoreAdminContext';
import CoreAdminUI, { AdminUIProps } from './CoreAdminUI';
import createAdminStore from './createAdminStore';

export * from './CoreAdminRouter';
export * from './CustomRoutes';
export * from './Resource';

export type { AdminContextProps, AdminUIProps };

export { CoreAdmin, CoreAdminContext, CoreAdminUI, createAdminStore };
