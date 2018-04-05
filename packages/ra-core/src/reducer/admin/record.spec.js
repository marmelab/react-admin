import assert from 'assert';
import { INITIALIZE_FORM } from '../../actions/formActions';
import { LOCATION_CHANGE } from 'react-router-redux';
import reducer from './record';

describe('record reducer', () => {
    it('should return an empty record by default', () => {
        assert.deepEqual({}, reducer(undefined, {}));
    });

    it('should return an empty record upon LOCATION_CHANGE', () => {
        assert.deepEqual(
            {},
            reducer({ foo: 'bar' }, { type: LOCATION_CHANGE })
        );
    });

    it('should return the current record with new fields upon INITIALIZE_FORM', () => {
        assert.deepEqual(
            { foo: 'bar', bar: 'foo', deep: { very: { deep: 'gotme' } } },
            reducer(
                { foo: 'bar' },
                {
                    type: INITIALIZE_FORM,
                    payload: { bar: 'foo', 'deep.very.deep': 'gotme' },
                }
            )
        );
    });
});
