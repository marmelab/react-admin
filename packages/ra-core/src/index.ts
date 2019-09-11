import createAppReducer from './reducer';
import adminReducer from './reducer/admin';
import queryReducer from './reducer/admin/resource/list/queryReducer';
import CoreAdmin from './CoreAdmin';
import CoreAdminRouter from './CoreAdminRouter';
import createAdminStore from './createAdminStore';
import RoutesWithLayout from './RoutesWithLayout';
import Resource from './Resource';

export {
    createAppReducer,
    adminReducer,
    queryReducer,
    CoreAdmin,
    CoreAdminRouter,
    createAdminStore,
    RoutesWithLayout,
    Resource,
};
export * from './dataFetchActions';
export * from './actions';
export * from './auth';
export * from './dataProvider';
export * from './i18n';
export * from './inference';
export * from './util';
export * from './controller';
export * from './form';
export {
    getResources,
    getReferenceResource,
    getNotification,
    getPossibleReferences,
    getPossibleReferenceValues,
} from './reducer';

export {
    getIds,
    getReferences,
    getReferencesByIds,
    nameRelatedTo,
} from './reducer/admin/references/oneToMany';

export * from './sideEffect';
export * from './types';
