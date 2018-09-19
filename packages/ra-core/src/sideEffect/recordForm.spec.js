import { put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { destroy } from 'redux-form';
import { resetForm } from '../actions/formActions';
import { handleLocationChange } from './recordForm';
import { REDUX_FORM_NAME } from '../form/constants';

describe('recordForm saga', () => {
    it('resets the form when the LOCATION_CHANGE action has no state', () => {
        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/comments/create' },
        });

        expect(saga.next().value).toEqual(put(resetForm()));
        expect(saga.next().value).toEqual(put(destroy(REDUX_FORM_NAME)));
    });

    it('does not reset the form when the LOCATION_CHANGE action state has skipFormReset set to true', () => {
        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/comments/create/2',
                state: { skipFormReset: true },
            },
        });

        expect(saga.next().value).toBeUndefined();
    });

    it('does not reset the form when navigating to same location', () => {
        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/comments/create/2',
            },
        });
        saga.next();
        saga.next();
        saga.next();

        const saga2 = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: {
                pathname: '/comments/create/2',
            },
        });

        expect(saga2.next().value).toBeUndefined();
    });
});
