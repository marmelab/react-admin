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
                    value2: 'value2record',
                    value3: 'value3',
                }
            )
        ).toEqual({
            value1: 'value1',
            value2: 'value2record',
            value3: 'value3',
        });
    });
    test('should merge initial values from all sources when defaultValue is a function and other sources are objects', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
        expect(
            getFormInitialValues(
                () => ({
                    value1: 'value1',
                    value2: 'value2',
                }),
                {
                    value2: 'value2record',
                    value3: 'value3',
                }
            )
        ).toEqual({
            value1: 'value1',
            value2: 'value2record',
            value3: 'value3',
        });
    });
});
