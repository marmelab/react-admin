import * as createAppReducer from './reducer';
import * as adminReducer from './reducer/admin';
import * as i18nReducer from './reducer/i18n';
import * as queryReducer from './reducer/admin/resource/list/queryReducer';
import * as CoreAdmin from './CoreAdmin';
import * as CoreAdminRouter from './CoreAdminRouter';
import * as createAdminStore from './createAdminStore';
import * as RoutesWithLayout from './RoutesWithLayout';
import * as Resource from './Resource';

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
