export * from '../lib/dataFetchActions';

export * from '../lib/actions/accumulateActions';
export * from '../lib/actions/authActions';
export * from '../lib/actions/dataActions';
export * from '../lib/actions/fetchActions';
export * from '../lib/actions/filterActions';
export * from '../lib/actions/formActions';
export * from '../lib/actions/listActions';
export * from '../lib/actions/localeActions';
export * from '../lib/actions/notificationActions';
export * from '../lib/actions/resourcesActions';
export * from '../lib/actions/uiActions';
export * from '../lib/actions/undoActions';

export * from '../lib/auth/types';
export Authenticated from '../lib/auth/Authenticated';
export WithPermissions from '../lib/auth/WithPermissions';

import {
    getListControllerProps,
    sanitizeListRestProps,
} from '../lib/controller/ListController';
export CreateController from '../lib/controller/CreateController';
export EditController from '../lib/controller/EditController';
export ListController from '../lib/controller/ListController';
export ShowController from '../lib/controller/ShowController';
export { getListControllerProps, sanitizeListRestProps };
export ReferenceArrayFieldController from '../lib/controller/field/ReferenceArrayFieldController';
export ReferenceFieldController from '../lib/controller/field/ReferenceFieldController';
export ReferenceManyFieldController from '../lib/controller/field/ReferenceManyFieldController';
export ReferenceArrayInputController from '../lib/controller/input/ReferenceArrayInputController';
export ReferenceInputController from '../lib/controller/input/ReferenceInputController';

export addField from '../lib/form/addField';
export FormDataConsumer from '../lib/form/FormDataConsumer';
export FormField, { isRequired } from '../lib/form/FormField';
export getDefaultValues from '../lib/form/getDefaultValues';
export withDefaultValue from '../lib/form/withDefaultValue';
export * from '../lib/form/validate';
export * from '../lib/form/constants';

export { DEFAULT_LOCALE } from '../lib/i18n';
export * from '../lib/i18n/TranslationUtils';
export defaultI18nProvider from '../lib/i18n/defaultI18nProvider';
export translate from '../lib/i18n/translate';
export TranslationProvider from '../lib/i18n/TranslationProvider';

export createAppReducer, {
    getResources,
    getReferenceResource,
    getLocale,
    getNotification,
    getPossibleReferences,
    getPossibleReferenceValues,
} from '../lib/reducer';
export adminReducer from '../lib/reducer/admin';
export i18nReducer from '../lib/reducer/i18n';
export queryReducer from '../lib/reducer/admin/resource/list/queryReducer';

export adminSaga from '../lib/sideEffect/admin';
export authSaga from '../lib/sideEffect/auth';
export callbackSaga from '../lib/sideEffect/callback';
export fetchSaga from '../lib/sideEffect/fetch';
export errorSaga from '../lib/sideEffect/error';
export notificationSaga from '../lib/sideEffect/notification';
export redirectionSaga from '../lib/sideEffect/redirection';
export accumulateSaga from '../lib/sideEffect/accumulate';
export refreshSaga from '../lib/sideEffect/refresh';
export i18nSaga from '../lib/sideEffect/i18n';
export undoSaga from '../lib/sideEffect/undo';
export recordForm from '../lib/sideEffect/recordForm';

export * as fetchUtils from '../lib/util/fetch';
export downloadCSV from '../lib/util/downloadCSV';
export FieldTitle from '../lib/util/FieldTitle';
export getFetchedAt from '../lib/util/getFetchedAt';
export HttpError from '../lib/util/HttpError';
export linkToRecord from '../lib/util/linkToRecord';
export removeEmpty from '../lib/util/removeEmpty';
export removeKey from '../lib/util/removeKey';
export resolveRedirectTo from '../lib/util/resolveRedirectTo';

export {
    getIds,
    getReferences,
    getReferencesByIds,
    nameRelatedTo,
} from '../lib/reducer/admin/references/oneToMany';

export CoreAdmin from '../lib/CoreAdmin';
export CoreAdminRouter from '../lib/CoreAdminRouter';
export createAdminStore from '../lib/createAdminStore';
export RoutesWithLayout from '../lib/RoutesWithLayout';
export Resource from '../lib/Resource';
