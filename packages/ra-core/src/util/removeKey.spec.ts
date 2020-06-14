import expect from 'expect';
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
        expect(removeKey(target, 'foo')).toEqual({
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
        expect(removeKey(target, 'deep.foo')).toEqual({
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
        expect(removeKey(target, 'deep.deep2.foo')).toEqual({
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
        expect(removeKey(target, 'deep.deep3.foo')).toEqual({
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
