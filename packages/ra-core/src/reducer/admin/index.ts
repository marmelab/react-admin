import { combineReducers } from 'redux';
import notifications from './notifications';
import ui from './ui';
import { selectedIds } from './selectedIds';
import { expandedRows } from './expandedRows';
import { listParams } from './listParams';

const defaultReducer = () => null;

export default combineReducers({
    /**
     * ts-jest does some aggressive module mocking when unit testing reducers individually.
     * To avoid 'No reducer provided for key "..."' warnings,
     * we pass default reducers. Sorry for legibility.
     *
     * @see https://stackoverflow.com/questions/43375079/redux-warning-only-appearing-in-tests
     */
    notifications: notifications || defaultReducer,
    ui: ui || defaultReducer,
    selectedIds: selectedIds || defaultReducer,
    expandedRows: expandedRows || defaultReducer,
    listParams: listParams || defaultReducer,
});
