import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'react-final-form';

import NullableBooleanInput from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        source: 'isPublished',
        resource: 'posts',
    };

    it('should give three different choices for true, false or unknown', () => {
        let formApi;
        const { getByText, getByRole, getAllByRole } = render(
            <Form
                onSubmit={jest.fn}
                render={({ form }) => {
                    formApi = form;
                    return <NullableBooleanInput {...defaultProps} />;
                }}
            />
        );
        const select = getByRole('button');
        fireEvent.click(select);
        const options = getAllByRole('option');
        expect(options.length).toEqual(3);

        fireEvent.click(getByText('ra.boolean.null'));
        expect(formApi.getState().values.isPublished).toBeNull();

        fireEvent.click(select);
        fireEvent.click(getByText('ra.boolean.false'));
        expect(formApi.getState().values.isPublished).toEqual(false);

        fireEvent.click(select);
        fireEvent.click(getByText('ra.boolean.true'));
        expect(formApi.getState().values.isPublished).toEqual(true);
    });
});
