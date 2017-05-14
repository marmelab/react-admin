import assert from 'assert';
import removeEmptyValues from './removeEmptyValues';

const obj = {
    name: {
        first: 'john',
        last: '',
    },
    age: 20,
    phone: {
        home: '  ',
    },
    emails: ['', 'john@doe.com', ''],
    admin: false,
};

describe('Remove Empty Values', () => {
    it('should remove empty values', () => {
        const valuesWithoutEmpty = removeEmptyValues(obj);
        assert.deepEqual(valuesWithoutEmpty, {
            name: {
                first: 'john',
            },
            age: 20,
            emails: ['john@doe.com'],
            admin: false,
        });
    });
});

