import { getRecord } from './useCreateController';

describe('useCreateController', () => {
    describe('getRecord', () => {
        const location = {
            pathname: '/foo',
            search: undefined,
            state: undefined,
            hash: undefined,
        };

        it('should return an empty record by default', () => {
            expect(getRecord(location, undefined)).toEqual({});
        });

        it('should return location state record when set', () => {
            expect(
                getRecord(
                    {
                        ...location,
                        state: { record: { foo: 'bar' } },
                    },
                    undefined
                )
            ).toEqual({ foo: 'bar' });
        });

        it('should return location search when set', () => {
            expect(
                getRecord(
                    {
                        ...location,
                        search: '?source={"foo":"baz","array":["1","2"]}',
                    },
                    undefined
                )
            ).toEqual({ foo: 'baz', array: ['1', '2'] });
        });

        it('should return location state record when both state and search are set', () => {
            expect(
                getRecord(
                    {
                        ...location,
                        state: { record: { foo: 'bar' } },
                        search: '?foo=baz',
                    },
                    undefined
                )
            ).toEqual({ foo: 'bar' });
        });
    });
});
