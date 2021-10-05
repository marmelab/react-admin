import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { Form, Field } from 'react-final-form';
import { Route, MemoryRouter, useHistory } from 'react-router-dom';

import useWarnWhenUnsavedChanges from './useWarnWhenUnsavedChanges';

const FormBody = ({ handleSubmit }) => {
    useWarnWhenUnsavedChanges(true);
    const history = useHistory();
    const onLeave = () => {
        history.push('/somewhere');
    };
    return (
        <form onSubmit={handleSubmit}>
            <label id="firstname-label">First Name</label>
            <Field
                name="firstName"
                aria-labelledby="firstname-label"
                component="input"
            />
            <label id="author-label">Author</label>
            <Field
                name="author.name"
                aria-labelledby="author-label"
                component="input"
            />
            <button type="button" onClick={onLeave}>
                Leave
            </button>
            <button type="submit">Submit</button>
        </form>
    );
};

const FormUnderTest = ({ initialValues = {} }) => {
    const history = useHistory();
    const onSubmit = () => {
        history.push('/submitted');
    };
    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            component={FormBody}
        />
    );
};

const App = () => (
    <MemoryRouter initialEntries={['/form']} initialIndex={0}>
        <Route path="/form">
            <FormUnderTest />
        </Route>
        <Route path="/submitted" render={() => <span>Submitted</span>} />
        <Route path="/somewhere" render={() => <span>Somewhere</span>} />
    </MemoryRouter>
);

describe('useWarnWhenUnsavedChanges', () => {
    it('should not warn when leaving form with no changes', () => {
        const { getByText } = render(<App />);
        fireEvent.click(getByText('Submit'));
        getByText('Submitted');
    });

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when leaving form with submit button after updating %s field',
        (_, field) => {
            const { getByLabelText, getByText } = render(<App />);
            fireEvent.change(getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            fireEvent.click(getByText('Submit'));
            getByText('Submitted');
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should warn when leaving form with unsaved changes after updating %s field',
        (_, field) => {
            // mock click on "cancel" in the confirm dialog
            window.confirm = jest.fn().mockReturnValue(false);
            const { getByLabelText, getByText, queryByText } = render(<App />);
            const input = getByLabelText(field) as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'John Doe' } });
            fireEvent.click(getByText('Leave'));
            expect(window.confirm).toHaveBeenCalledWith(
                'ra.message.unsaved_changes'
            );
            // check that we're still in the form and that the unsaved changes are here
            expect(
                (getByLabelText('First Name') as HTMLInputElement).value
            ).toBe('John Doe');
            expect(queryByText('Somewhere')).toBeNull();
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should warn when leaving form with unsaved changes but accept override',
        (_, field) => {
            // mock click on "OK" in the confirm dialog
            window.confirm = jest.fn().mockReturnValue(true);
            const { getByLabelText, getByText, queryByText } = render(<App />);
            const input = getByLabelText(field) as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'John Doe' } });
            fireEvent.click(getByText('Leave'));
            expect(window.confirm).toHaveBeenCalledWith(
                'ra.message.unsaved_changes'
            );
            // check that we're no longer in the form
            expect(queryByText(field)).toBeNull();
            getByText('Somewhere');
        }
    );

    afterAll(() => delete window.confirm);
});
