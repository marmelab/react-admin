import { combineReducers } from 'redux';
import resource from '../../src/reducer/resource';
import loading from '../../src/reducer/loading';
import notification from '../../src/reducer/notification';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    comments: resource('comments'),
    posts: resource('posts'),
    loading,
    notification,
    routing: routerReducer,
});
