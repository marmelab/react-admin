import * as React from 'react';
import { useEffect } from 'react';
import expect from 'expect';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Form, Field } from 'react-final-form';
import { Route, MemoryRouter, useHistory } from 'react-router-dom';

import useWarnWhenUnsavedChanges from './useWarnWhenUnsavedChanges';

const FormBody = ({ handleSubmit, submitSucceeded }) => {
    useWarnWhenUnsavedChanges(true, '/form');
    const history = useHistory();
    const onLeave = () => {
        history.push('/somewhere');
    };
    useEffect(() => {
        if (submitSucceeded) {
            setTimeout(() => {
                history.push('/submitted');
            }, 100);
        }
    }, [submitSucceeded, history]);
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
            <button type="button" onClick={() => history.push('/form')}>
                Root form
            </button>
            <button type="button" onClick={() => history.push('/form/part1')}>
                Form part 1
            </button>
            <button type="button" onClick={() => history.push('/form/part2')}>
                Form part 2
            </button>
            <button type="button" onClick={onLeave}>
                Leave
            </button>
            <button type="submit">Submit</button>
        </form>
    );
};

const FormUnderTest = ({ initialValues = {} }) => {
    const onSubmit = () => {
        // The redirection can't happen on submit because final-form keep the form
        // dirty state even after the submit.
        return undefined;
    };
    return (
        <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            component={FormBody}
        />
    );
};

const App = ({ initialEntries = ['/form'] }) => (
    <MemoryRouter
        initialEntries={initialEntries}
        initialIndex={0}
        getUserConfirmation={(message, callback) => {
            const confirmed = window.confirm(message);
            callback(confirmed);
        }}
    >
        <Route path="/form/:subpath?">
            <FormUnderTest />
        </Route>
        <Route path="/submitted" render={() => <span>Submitted</span>} />
        <Route path="/somewhere" render={() => <span>Somewhere</span>} />
    </MemoryRouter>
);

describe('useWarnWhenUnsavedChanges', () => {
    let originalConsoleError;
    beforeAll(() => {
        originalConsoleError = console.error;
        console.error = jest.fn(message => {
            if (message.includes('Error: Not implemented: window.confirm')) {
                return;
            }
            originalConsoleError(message);
        });
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    it('should not warn when leaving form with no changes', async () => {
        const { getByText } = render(<App />);
        fireEvent.click(getByText('Submit'));
        await waitFor(() => getByText('Submitted'));
    });

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when leaving form with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            const { getByLabelText, getByDisplayValue, getByText } = render(
                <App />
            );
            fireEvent.change(getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(getByText('Submit'));
            await new Promise(resolve => setTimeout(resolve, 101));

            // We don't check whether the redirection happened because final-form keeps the form
            // dirty state even after the submit.
            expect(window.confirm).not.toHaveBeenCalled();
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when navigating to a sub page of a form with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            const { getByLabelText, getByDisplayValue, getByText } = render(
                <App />
            );
            fireEvent.change(getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(getByText('Form part 1'));
            // We don't check whether the redirection happened because final-form keeps the form
            // dirty state even after the submit.
            expect(window.confirm).not.toHaveBeenCalled();
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when navigating from a sub page of a form to the another part with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            const { getByLabelText, getByDisplayValue, getByText } = render(
                <App initialEntries={['/form/part1']} />
            );
            fireEvent.change(getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(getByText('Form part 2'));
            // We don't check whether the redirection happened because final-form keeps the form
            // dirty state even after the submit.
            expect(window.confirm).not.toHaveBeenCalled();
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when navigating from a sub page of a form to the root part with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            const { getByLabelText, getByDisplayValue, getByText } = render(
                <App initialEntries={['/form/part1']} />
            );
            fireEvent.change(getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(getByText('Root form'));
            // We don't check whether the redirection happened because final-form keeps the form
            // dirty state even after the submit.
            expect(window.confirm).not.toHaveBeenCalled();
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
            const {
                getByLabelText,
                queryByDisplayValue,
                getByText,
                queryByText,
            } = render(<App />);
            const input = getByLabelText(field) as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'John Doe' } });
            fireEvent.blur(input);
            expect(queryByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(getByText('Leave'));
            expect(window.confirm).toHaveBeenCalledWith(
                'ra.message.unsaved_changes'
            );
            // check that we're still in the form and that the unsaved changes are here
            expect(queryByDisplayValue('John Doe')).not.toBeNull();
            expect(queryByText('Somewhere')).toBeNull();
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should warn when leaving form with unsaved changes but accept override',
        async (_, field) => {
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
            await waitFor(() => {
                expect(queryByText(field)).toBeNull();
            });
            getByText('Somewhere');
        }
    );

    afterAll(() => delete window.confirm);
});
