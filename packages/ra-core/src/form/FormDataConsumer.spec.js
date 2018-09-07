import React from 'react';
import { shallow } from 'enzyme';

import { FormDataConsumer } from './FormDataConsumer';

describe('FormDataConsumer', () => {
    it('does not call its children function with scopedFormData and getSource if it did not receive an index prop', () => {
        const children = jest.fn();
        const formData = { id: 123, title: 'A title' };

        shallow(
            <FormDataConsumer formData={formData}>{children}</FormDataConsumer>
        );

        expect(children).toHaveBeenCalledWith({
            formData,
        });
    });

    it('calls its children function with scopedFormData and getSource if it received an index prop', () => {
        const children = jest.fn(({ getSource }) => {
            getSource('id');
        });
        const formData = { id: 123, title: 'A title', authors: [{ id: 0 }] };

        shallow(
            <FormDataConsumer source="authors[0]" index={0} formData={formData}>
                {children}
            </FormDataConsumer>
        );

        expect(children.mock.calls[0][0].formData).toEqual(formData);
        expect(children.mock.calls[0][0].scopedFormData).toEqual({ id: 0 });
        expect(children.mock.calls[0][0].getSource('id')).toEqual(
            'authors[0].id'
        );
    });
});
