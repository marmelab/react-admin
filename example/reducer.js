import { combineReducers } from 'redux';
import { adminReducer } from 'admin-on-rest';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    admin: adminReducer(['comments', 'posts']),
    routing: routerReducer,
});
