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
                    value2: 'value2default',
                    value3: 'value3',
                },
                {
                    value3: 'value3record',
                    value4: 'value4',
                }
            )
        ).toEqual({
            value1: 'value1',
            value2: 'value2',
            value3: 'value3record',
            value4: 'value4',
        });
    });
    test('should merge initial values from all sources when all initialValues is a function and other sources are objects', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
        expect(
            getFormInitialValues(
                record => ({
                    value1: 'value1',
                    value2: 'value2',
                    value5: record.value4 + 'updated',
                }),
                {
                    value2: 'value2default',
                    value3: 'value3',
                },
                {
                    value3: 'value3record',
                    value4: 'value4',
                }
            )
        ).toEqual({
            value1: 'value1',
            value2: 'value2',
            value3: 'value3record',
            value4: 'value4',
            value5: 'value4updated',
        });
    });
    test('should merge initial values from all sources when all defaultValue is a function and other sources are objects', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
        expect(
            getFormInitialValues(
                {
                    value1: 'value1',
                    value2: 'value2',
                },
                record => ({
                    value2: 'value2default',
                    value3: 'value3',
                    value5: record.value4 + 'updated',
                }),
                {
                    value3: 'value3record',
                    value4: 'value4',
                }
            )
        ).toEqual({
            value1: 'value1',
            value2: 'value2',
            value3: 'value3record',
            value4: 'value4',
            value5: 'value4updated',
        });
    });
    test('should merge initial values from all sources when all expect record are functions', () => {
        jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
        expect(
            getFormInitialValues(
                record => ({
                    value1: 'value1',
                    value2: 'value2',
                    value5: record.value4 + 'updated',
                }),
                record => ({
                    value2: 'value2default',
                    value3: 'value3',
                    value6: record.value4 + 'updated',
                }),
                {
                    value3: 'value3record',
                    value4: 'value4',
                }
            )
        ).toEqual({
            value1: 'value1',
            value2: 'value2',
            value3: 'value3record',
            value4: 'value4',
            value5: 'value4updated',
            value6: 'value4updated',
        });
    });
});
