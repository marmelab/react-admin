import { combineReducers } from 'redux';
import crud from '../../src/reducer';

export default combineReducers({
    comments: crud('comments'),
    posts: crud('posts'),
});
