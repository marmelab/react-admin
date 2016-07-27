import { push } from 'react-router-redux';
import {
    CRUD_GET_ONE,
} from '../actions/dataActions';
import { showNotification } from '../actions/notificationActions';

export default (type, resource, payload, error) => {
    switch (type) {
    case CRUD_GET_ONE:
        return [
            showNotification('Element does not exist', 'warning'),
            push(payload.basePath),
        ];
    default:
        return [];
    }
};
