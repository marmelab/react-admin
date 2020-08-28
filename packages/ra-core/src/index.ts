import createAppReducer from './reducer';
import adminReducer from './reducer/admin';
import queryReducer from './reducer/admin/resource/list/queryReducer';

export { createAppReducer, adminReducer, queryReducer };
export * from './core';
export * from './actions';
export * from './auth';
export * from './dataProvider';
export * from './export';
export * from './i18n';
export * from './inference';
export * from './loading';
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
