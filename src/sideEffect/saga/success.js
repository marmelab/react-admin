import { push } from 'react-router-redux';
import {
    CRUD_CREATE,
    CRUD_UPDATE,
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
            push(`${payload.basePath}/${response.json.id}`),
        ];
    default:
        return [];
    }
};
