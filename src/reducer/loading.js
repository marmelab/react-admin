import { FETCH_START, FETCH_END, FETCH_ERROR, FETCH_CANCEL } from '../actions/fetchActions';

export default (previousState = 0, { type }) => {
    switch (type) {
    case FETCH_START:
        return previousState + 1;
    case FETCH_END:
    case FETCH_ERROR:
    case FETCH_CANCEL:
        return Math.max(previousState - 1, 0);
    default:
        return previousState;
    }
};
