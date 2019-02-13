import { LOCATION_CHANGE } from 'react-router-redux';
import { destroy } from 'redux-form';

import formMiddleware from './formMiddleware';
import { REDUX_FORM_NAME } from './constants';
import { resetForm } from '../actions/formActions';

describe('form middleware', () => {
    it('does not prevent actions other than LOCATION_CHANGE to be handled', () => {
        const next = jest.fn();
        const action = { type: '@@redux-form/INITIALIZE' };

        formMiddleware()(next)(action);

        expect(next).toHaveBeenCalledWith(action);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('does not prevent LOCATION_CHANGE actions to be handled if their state contains a skipFormReset set to true', () => {
        const next = jest.fn();
        const action = {
            type: LOCATION_CHANGE,
            payload: { state: { skipFormReset: true } },
        };
        formMiddleware()(next)(action);

        expect(next).toHaveBeenCalledWith(action);
    });

    it('resets the record state and destroy the redux form before letting the location change to be handled', () => {
        const next = jest.fn();
        const action = {
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/posts/create',
            },
        };
        formMiddleware()(next)(action);

        expect(next).toHaveBeenCalledWith(resetForm());
        expect(next).toHaveBeenCalledWith(destroy(REDUX_FORM_NAME));
        expect(next).toHaveBeenCalledWith(action);
        expect(next).toHaveBeenCalledTimes(3);
    });

    it('does not resets the record and form if LOCATION_CHANGE targets the same location', () => {
        const next = jest.fn();
        const action = {
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/posts/create',
            },
        };
        const middleware = formMiddleware()(next);
        middleware(action);
        middleware(action);
        expect(next).toHaveBeenCalledWith(resetForm());
        expect(next).toHaveBeenCalledWith(destroy(REDUX_FORM_NAME));
        expect(next).toHaveBeenCalledWith(action);
        expect(next).toHaveBeenCalledTimes(4);
    });
});
