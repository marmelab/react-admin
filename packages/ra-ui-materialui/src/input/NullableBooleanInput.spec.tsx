import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import NullableBooleanInput from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        source: 'inStock',
        resource: 'products',
    };

    it('should give three different choices for true, false or unknown', () => {
        const { getAllByRole, getByRole, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <NullableBooleanInput {...defaultProps} />}
            />
        );

        fireEvent.click(getByRole('button'));
        const options = getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0].getAttribute('data-value')).toEqual('');
        const optionFalse = queryByText('ra.boolean.false');
        expect(optionFalse).not.toBeNull();
        expect(optionFalse.getAttribute('data-value')).toEqual('false');
        const optionYes = queryByText('ra.boolean.true');
        expect(optionYes).not.toBeNull();
        expect(optionYes.getAttribute('data-value')).toEqual('true');
    });

    it('convert values correctly', () => {
        const onSubmit = jest.fn();
        const { getByLabelText, getAllByRole } = render(
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <NullableBooleanInput {...defaultProps} />
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );

        fireEvent.click(getAllByRole('button')[0]);
        fireEvent.click(getAllByRole('option')[1]);
        fireEvent.click(getByLabelText('Save'));
        expect(onSubmit.mock.calls[0][0]).toEqual({
            inStock: false,
        });

        fireEvent.click(getAllByRole('button')[0]);
        fireEvent.click(getAllByRole('option')[2]);
        fireEvent.click(getByLabelText('Save'));
        expect(onSubmit.mock.calls[1][0]).toEqual({
            inStock: true,
        });

        fireEvent.click(getAllByRole('button')[0]);
        fireEvent.click(getAllByRole('option')[0]);
        fireEvent.click(getByLabelText('Save'));
        expect(onSubmit.mock.calls[2][0]).toEqual({
            inStock: null,
        });
    });
});
