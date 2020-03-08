import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import admin, {
    getResources as adminGetResources,
    getReferenceResource as adminGetReferenceResource,
    getPossibleReferenceValues as adminGetPossibleReferenceValues,
} from './admin';
export { getNotification } from './admin/notifications';

interface CustomReducers {
    [key: string]: Reducer;
}

export default (customReducers: CustomReducers, history) =>
    combineReducers({
        admin,
        router: connectRouter(history),
        ...customReducers,
    });

export const getPossibleReferenceValues = (state, props) =>
    adminGetPossibleReferenceValues(state.admin, props);
export const getResources = state => adminGetResources(state.admin);
export const getReferenceResource = (state, props) =>
    adminGetReferenceResource(state.admin, props);

export { getPossibleReferences } from './admin';
