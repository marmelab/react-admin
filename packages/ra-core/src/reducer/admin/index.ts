import { combineReducers } from 'redux';
import resources, {
    getResources as resourceGetResources,
    getReferenceResource as resourceGetReferenceResource,
} from './resource';
import loading from './loading';
import notifications from './notifications';
import references, {
    getPossibleReferenceValues as referencesGetPossibleReferenceValues,
} from './references';
import ui from './ui';
import customQueries from './customQueries';
import { ReduxState } from '../../types';

const defaultReducer = () => null;

export default combineReducers({
    /**
     * ts-jest does some aggressive module mocking when unit testing reducers individually.
     * To avoid 'No reducer provided for key "..."' warnings,
     * we pass default reducers. Sorry for legibility.
     *
     * @see https://stackoverflow.com/questions/43375079/redux-warning-only-appearing-in-tests
     */
    resources: resources || defaultReducer,
    customQueries: customQueries || defaultReducer,
    loading: loading || defaultReducer,
    notifications: notifications || defaultReducer,
    references: references || defaultReducer,
    ui: ui || defaultReducer,
});

export const getPossibleReferenceValues = (state: ReduxState, props) =>
    referencesGetPossibleReferenceValues(state.references, props);

export const getResources = (state: ReduxState) =>
    resourceGetResources(state.resources);

export const getReferenceResource = (state: ReduxState, props) => {
    return resourceGetReferenceResource(state.resources, props);
};

export { getPossibleReferences } from './references';
