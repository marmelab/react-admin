import assert from 'assert';
import removeKey from './removeKey';

describe('removeKey', () => {
    const target = {
        foo: 'bar',
        deep: {
            foo: '',
            deep2: {
                foo: '',
            },
            deep3: {
                foo: '',
                deep4: '',
            },
        },
    };

    it('remove simple key from target', () => {
        assert.deepEqual(removeKey(target, 'foo'), {
            deep: {
                foo: '',
                deep2: {
                    foo: '',
                },
                deep3: {
                    foo: '',
                    deep4: '',
                },
            },
        });
    });

    it('remove first level deep key from target', () => {
        assert.deepEqual(removeKey(target, 'deep.foo'), {
            foo: 'bar',
            deep: {
                deep2: {
                    foo: '',
                },
                deep3: {
                    foo: '',
                    deep4: '',
                },
            },
        });
    });

    it('remove deep key from target', () => {
        assert.deepEqual(removeKey(target, 'deep.deep2.foo'), {
            foo: 'bar',
            deep: {
                foo: '',
                deep3: {
                    foo: '',
                    deep4: '',
                },
            },
        });
    });

    it('remove deep key from target keeping deep object if not empty', () => {
        assert.deepEqual(removeKey(target, 'deep.deep3.foo'), {
            foo: 'bar',
            deep: {
                foo: '',
                deep2: {
                    foo: '',
                },
                deep3: {
                    deep4: '',
                },
            },
        });
    });
});
