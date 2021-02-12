import * as React from 'react';
import { render } from '@testing-library/react';

import { FormDataConsumerView } from './FormDataConsumer';

describe('FormDataConsumerView', () => {
    it('does not call its children function with scopedFormData and getSource if it did not receive an index prop', () => {
        const children = jest.fn();
        const formData = { id: 123, title: 'A title' };

        render(
            <FormDataConsumerView
                form="a-form"
                formData={formData}
                source="a-field"
            >
                {children}
            </FormDataConsumerView>
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

        render(
            <FormDataConsumerView
                form="a-form"
                source="authors[0]"
                index={0}
                formData={formData}
            >
                {children}
            </FormDataConsumerView>
        );

        expect(children.mock.calls[0][0].formData).toEqual(formData);
        expect(children.mock.calls[0][0].scopedFormData).toEqual({ id: 0 });
        expect(children.mock.calls[0][0].getSource('id')).toEqual(
            'authors[0].id'
        );
    });
});
