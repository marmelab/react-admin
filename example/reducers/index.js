import { combineReducers } from 'redux';
import { resourceReducer, loadingReducer, notificationReducer } from 'admin-on-rest';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    comments: resourceReducer('comments'),
    posts: resourceReducer('posts'),
    loading: loadingReducer,
    notification: notificationReducer,
    routing: routerReducer,
});
