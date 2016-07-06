import { combineReducers } from 'redux';
import crud from '../../src/reducer';
import loading from '../../src/loading';

export default combineReducers({
    comments: crud('comments'),
    posts: crud('posts'),
    loading,
});
