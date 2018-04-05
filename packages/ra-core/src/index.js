export * from './dataFetchActions';
export * from './actions';
export * from './auth';
export * from './i18n';
export * from './util';
export * from './controller';
export * from './form';
export createAppReducer, {
    getResources,
    getReferenceResource,
    getLocale,
    getNotification,
    getPossibleReferences,
    getPossibleReferenceValues,
} from './reducer';
export adminReducer from './reducer/admin';
export i18nReducer from './reducer/i18n';
export queryReducer from './reducer/admin/resource/list/queryReducer';

export {
    getIds,
    getReferences,
    getReferencesByIds,
    nameRelatedTo,
} from './reducer/admin/references/oneToMany';

export * from './sideEffect';
export CoreAdmin from './CoreAdmin';
export CoreAdminRouter from './CoreAdminRouter';
export RoutesWithLayout from './RoutesWithLayout';
export Resource from './Resource';
