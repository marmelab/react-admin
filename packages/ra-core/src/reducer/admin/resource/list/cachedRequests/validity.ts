import { Reducer } from 'redux';
import { GET_LIST } from '../../../../../core';

type State = Date;

const initialState = null;

const validityReducer: Reducer<State> = (
    previousState = initialState,
    { payload, meta }
) => {
    switch (meta.fetchResponse) {
        case GET_LIST: {
            if (payload.validUntil) {
                // store the validity date
                return payload.validUntil;
            } else {
                // remove the validity date
                return initialState;
            }
        }
        default:
            return previousState;
    }
};

export default validityReducer;
