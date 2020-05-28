import * as React from 'react';
import expect from 'expect';
import { render, cleanup, fireEvent } from '@testing-library/react';
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
    afterEach(cleanup);

    it('should not warn when leaving form with no changes', () => {
        const { getByText } = render(<App />);
        fireEvent.click(getByText('Submit'));
        getByText('Submitted');
    });

    it('should not warn when leaving form with submit button', () => {
        const { getByLabelText, getByText } = render(<App />);
        const input = getByLabelText('First Name') as HTMLInputElement;
        input.value = 'John Doe';
        fireEvent.click(getByText('Submit'));
        getByText('Submitted');
    });

    it('should warn when leaving form with unsaved changes', () => {
        // mock click on "cancel" in the confirm dialog
        window.confirm = jest.fn().mockReturnValue(false);
        const { getByLabelText, getByText, queryByText } = render(<App />);
        const input = getByLabelText('First Name') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'John Doe' } });
        fireEvent.click(getByText('Leave'));
        expect(window.confirm).toHaveBeenCalledWith(
            'ra.message.unsaved_changes'
        );
        // check that we're still in the form and that the unsaved changes are here
        expect((getByLabelText('First Name') as HTMLInputElement).value).toBe(
            'John Doe'
        );
        expect(queryByText('Somewhere')).toBeNull();
    });

    it('should warn when leaving form with unsaved changes but accept override', () => {
        // mock click on "OK" in the confirm dialog
        window.confirm = jest.fn().mockReturnValue(true);
        const { getByLabelText, getByText, queryByText } = render(<App />);
        const input = getByLabelText('First Name') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'John Doe' } });
        fireEvent.click(getByText('Leave'));
        expect(window.confirm).toHaveBeenCalledWith(
            'ra.message.unsaved_changes'
        );
        // check that we're no longer in the form
        expect(queryByText('First Name')).toBeNull();
        getByText('Somewhere');
    });

    afterAll(() => delete window.confirm);
});
