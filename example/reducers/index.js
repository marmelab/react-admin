import { combineReducers } from 'redux';
import crud from '../../src/reducer';
import loading from '../../src/reducer/loading';
import notification from '../../src/reducer/notification';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    comments: crud('comments'),
    posts: crud('posts'),
    loading,
    notification,
    routing: routerReducer,
});
