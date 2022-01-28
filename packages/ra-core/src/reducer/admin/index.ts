import { combineReducers, Reducer } from 'redux';

import { selectedIds } from './selectedIds';
import { expandedRows } from './expandedRows';
import { listParams } from './listParams';
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
    selectedIds: selectedIds || defaultReducer,
    expandedRows: expandedRows || defaultReducer,
    listParams: listParams || defaultReducer,
}) as Reducer<ReduxState['admin']>;
