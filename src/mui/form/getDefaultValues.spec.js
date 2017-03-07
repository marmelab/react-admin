import { createElement } from 'react';
import assert from 'assert';
import getDefaultValues from '../form/getDefaultValues';

const someTitle = 'some value';

const formElements = {
    children: [
        createElement('input', { defaultValue: someTitle, source: 'title' }),
        createElement('input', { defaultValue: someTitle, source: 'nested.title' }),
    ],
};

const expectedResult = {
    title: someTitle,
    nested: {
        title: someTitle,
    },
};

describe('getDefaultValues', () => {
    it('should get defaults values from form correctly', () => {
        const defaultValuesResult = getDefaultValues({}, formElements);
        assert.deepEqual(defaultValuesResult, expectedResult);
    });
});
