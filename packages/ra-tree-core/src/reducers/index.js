import { combineReducers } from 'redux';
import expanded from './expanded';
import moving from './moving';

export default combineReducers({
    expanded,
    moving,
});
