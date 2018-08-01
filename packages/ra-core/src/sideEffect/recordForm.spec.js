import { put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { resetForm } from '../actions/formActions';
import { handleLocationChange } from './recordForm';

describe('recordForm saga', () => {
    it('resets the form when the LOCATION_CHANGE action has no state', () => {
        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/comments/create' },
        });

        expect(saga.next().value).toEqual(put(resetForm()));
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
});
