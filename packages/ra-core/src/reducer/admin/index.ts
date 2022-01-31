import { combineReducers, Reducer } from 'redux';

import { ReduxState } from '../../types';

export default combineReducers({
    // FIXME temp reducer because Reux cannot work without at least one reducer
    dummy: (state = null) => state,
}) as Reducer<ReduxState['admin']>;
