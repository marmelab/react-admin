import createAppReducer from './reducer';
import adminReducer from './reducer/admin';
import i18nReducer from './reducer/i18n';
import queryReducer from './reducer/admin/resource/list/queryReducer';
import CoreAdmin from './CoreAdmin';
import CoreAdminRouter from './CoreAdminRouter';
import createAdminStore from './createAdminStore';
import RoutesWithLayout from './RoutesWithLayout';
import Resource from './Resource';

export {
    createAppReducer,
    adminReducer,
    i18nReducer,
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
export * from './i18n';
export * from './inference';
export * from './util';
export * from './controller';
export * from './form';
export {
    getResources,
    getReferenceResource,
    getLocale,
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
