import { crudGetList } from '../../../../actions/dataActions';

export default resource => (previousState = 0, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    if (type === crudGetList.SUCCESS) {
        return payload.total;
    }
    return previousState;
};
