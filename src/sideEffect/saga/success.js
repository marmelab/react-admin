import { push } from 'react-router-redux';
import {
    CRUD_CREATE,
    CRUD_UPDATE,
    CRUD_DELETE,
} from '../../actions/dataActions';
import { showNotification } from '../../actions/notificationActions';

export default (type, resource, payload, response) => {
    switch (type) {
    case CRUD_UPDATE:
        return [
            showNotification('Element updated'),
            push(payload.basePath),
        ];
    case CRUD_CREATE:
        return [
            showNotification('Element created'),
            push(`${payload.basePath}/${response.id}`),
        ];
    case CRUD_DELETE:
        return [
            showNotification('Element deleted'),
            push(payload.basePath),
        ];
    default:
        return [];
    }
};
