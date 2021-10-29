import getFormInitialValues from './getFormInitialValues';

describe('getFormInitialValues', () => {
    test('should merge initial values from all sources when all are objects', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
        expect(
            getFormInitialValues(
                {
                    value1: 'value1',
                    value2: 'value2',
                },
                {
                    id: 1,
                    value2: 'value2record',
                    value3: 'value3',
                }
            )
        ).toEqual({
            id: 1,
            value1: 'value1',
            value2: 'value2record',
            value3: 'value3',
        });
    });
    test('should merge initial values from all sources when defaultValues is a function and other sources are objects', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
        expect(
            getFormInitialValues(
                record => ({
                    value1: 'value1',
                    value2: 'value2',
                    value5: record.value4 + 'updated',
                }),
                {
                    id: 1,
                    value3: 'value3record',
                    value4: 'value4',
                }
            )
        ).toEqual({
            id: 1,
            value1: 'value1',
            value2: 'value2',
            value3: 'value3record',
            value4: 'value4',
            value5: 'value4updated',
        });
    });
});
