import { SET_RESOURCE_SELECTION } from '../../../../actions/bulkActions';

const pull = require('lodash.pull');
const concat = require('lodash.concat');

export default () => (
    previousState = [],
    { type, payload, requestPayload }
) => {
    switch (type) {
        case SET_RESOURCE_SELECTION:
            if (payload.isSelected) {
                return concat(previousState, payload.resourceId);
            } else {
                return pull(previousState, payload.resourceId);
            }
        default:
            return previousState;
    }
};
