import { put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { resetForm } from '../actions/formActions';
import { handleLocationChangeFactory } from './recordForm';

describe('recordForm saga', () => {
    it('does nothing on first location change', () => {
        const handleLocationChange = handleLocationChangeFactory();
        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/posts/create' },
        });

        expect(saga.next().value).toBeUndefined();
    });

    it('resets the form when navigating to another resource', () => {
        const handleLocationChange = handleLocationChangeFactory(
            '/posts/create'
        );
        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/comments/create' },
        });

        expect(saga.next().value).toEqual(put(resetForm()));
    });

    it('does not reset the form when navigating to another tab of the same form', () => {
        const handleLocationChange = handleLocationChangeFactory(
            '/comments/create'
        );

        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/comments/create/2' },
        });

        expect(saga.next().value).toBeUndefined();
    });

    it('does not reset the form when navigating to the first tab of the same form', () => {
        const handleLocationChange = handleLocationChangeFactory(
            '/comments/create/2'
        );

        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/comments/create' },
        });

        expect(saga.next().value).toBeUndefined();
    });

    it('resets the form when navigating to from a tab to another resource tabbed form', () => {
        const handleLocationChange = handleLocationChangeFactory(
            '/comments/create/2'
        );

        const saga = handleLocationChange({
            type: LOCATION_CHANGE,
            payload: { pathname: '/posts/edit/2' },
        });

        expect(saga.next().value).toEqual(put(resetForm()));
    });
});
