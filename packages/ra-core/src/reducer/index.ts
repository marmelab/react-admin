import { combineReducers, Reducer } from 'redux';
import admin, {
    getResources as adminGetResources,
    getReferenceResource as adminGetReferenceResource,
} from './admin';
export { getNotification } from './admin/notifications';

interface CustomReducers {
    [key: string]: Reducer;
}

export default (customReducers: CustomReducers) =>
    combineReducers({
        admin,
        ...customReducers,
    });

export const getResources = state => adminGetResources(state.admin);
export const getReferenceResource = (state, props) =>
    adminGetReferenceResource(state.admin, props);
