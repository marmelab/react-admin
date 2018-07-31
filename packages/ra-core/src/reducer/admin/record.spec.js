import assert from 'assert';
import { INITIALIZE_FORM, RESET_FORM } from '../../actions/formActions';
import reducer from './record';

describe('record reducer', () => {
    it('should return an empty record by default', () => {
        assert.deepEqual({}, reducer(undefined, {}));
    });

    it('should return an empty record upon RESET_FORM', () => {
        assert.deepEqual({}, reducer({ foo: 'bar' }, { type: RESET_FORM }));
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
