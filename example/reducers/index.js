import { combineReducers } from 'redux';
import crud from '../../src/reducer';
import loading from '../../src/loading';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    comments: crud('comments'),
    posts: crud('posts'),
    loading,
    routing: routerReducer,
});
