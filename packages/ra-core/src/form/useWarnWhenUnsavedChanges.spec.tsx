import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import {
    MemoryRouter,
    Route,
    Routes,
    useNavigate,
    useParams,
} from 'react-router-dom';

import { useWarnWhenUnsavedChanges } from './useWarnWhenUnsavedChanges';

const Form = ({ onSubmit }) => {
    useWarnWhenUnsavedChanges(true, '/form');
    const params = useParams<'part'>();
    const navigate = useNavigate();
    const form = useFormContext();
    const onLeave = () => {
        navigate('/somewhere');
    };
    return (
        <form onSubmit={onSubmit}>
            <h1>Form {params.part}</h1>
            <label id="firstname-label">First Name</label>
            <input
                {...form.register('firstName')}
                aria-labelledby="firstname-label"
            />
            <label id="author-label">Author</label>
            <input
                {...form.register('author.name')}
                aria-labelledby="author-label"
            />
            <button type="button" onClick={() => navigate('/form')}>
                Root form
            </button>
            <button type="button" onClick={() => navigate('/form/part1')}>
                Form part 1
            </button>
            <button type="button" onClick={() => navigate('/form/part2')}>
                Form part 2
            </button>
            <button type="button" onClick={() => navigate('/form/show')}>
                Go to Show view
            </button>
            <button type="button" onClick={onLeave}>
                Leave
            </button>
            <button type="submit">Submit</button>
        </form>
    );
};

const FormUnderTest = () => {
    const navigate = useNavigate();
    const form = useForm();
    // Simulate react-admin save methods
    const save = () =>
        new Promise(resolve => {
            setTimeout(() => navigate('/submitted'), 100);
            resolve();
        });
    const onSubmit = () => {
        save();
    };
    return (
        <FormProvider {...form}>
            <Form onSubmit={form.handleSubmit(onSubmit)} />
        </FormProvider>
    );
};

const App = ({ initialEntries = ['/form'] }) => (
    <MemoryRouter initialEntries={initialEntries} initialIndex={0}>
        <Routes>
            <Route path="/form" element={<FormUnderTest />} />
            <Route path="/form/show" element={<span>Show</span>} />
            <Route path="/form/:part" element={<FormUnderTest />} />
            <Route path="/submitted" element={<span>Submitted</span>} />
            <Route path="/somewhere" element={<span>Somewhere</span>} />
        </Routes>
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
        window.confirm = jest.fn().mockReturnValue(true);
        render(<App />);
        fireEvent.click(screen.getByText('Leave'));
        await waitFor(() => screen.getByText('Somewhere'));
        expect(window.confirm).not.toHaveBeenCalled();
    });

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when leaving form with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            render(<App />);
            fireEvent.change(screen.getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(screen.getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(screen.getByText('Submit'));
            await waitFor(() => expect(window.confirm).not.toHaveBeenCalled());
            await waitFor(() => screen.getByText('Submitted'));
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when navigating to a sub page of a form with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            render(<App />);
            fireEvent.change(screen.getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(screen.getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(screen.getByText('Form part 1'));
            await waitFor(() => screen.getByText('Form part1'));
            expect(window.confirm).not.toHaveBeenCalled();
        }
    );

    test.each([
        ['simple', 'First Name'],
        ['nested', 'Author'],
    ])(
        'should not warn when navigating from a sub page with submit button after updating %s field',
        async (_, field) => {
            window.confirm = jest.fn().mockReturnValue(true);
            render(<App initialEntries={['/form/part1']} />);
            fireEvent.change(screen.getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(screen.getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(screen.getByText('Form part 2'));
            await waitFor(() => screen.getByText('Form part2'));
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
            render(<App initialEntries={['/form/part1']} />);
            fireEvent.change(screen.getByLabelText(field), {
                target: { value: 'John Doe' },
            });
            expect(screen.getByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(screen.getByText('Root form'));
            await waitFor(() => screen.getByText('Form'));
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
            render(<App />);
            const input = screen.getByLabelText(field) as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'John Doe' } });
            fireEvent.blur(input);
            expect(screen.queryByDisplayValue('John Doe')).not.toBeNull();
            fireEvent.click(screen.getByText('Leave'));
            expect(window.confirm).toHaveBeenCalledWith(
                'ra.message.unsaved_changes'
            );
            // check that we're still in the form and that the unsaved changes are here
            expect(screen.queryByDisplayValue('John Doe')).not.toBeNull();
            expect(screen.queryByText('Somewhere')).toBeNull();
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
            render(<App />);
            const input = screen.getByLabelText(field) as HTMLInputElement;
            fireEvent.change(input, { target: { value: 'John Doe' } });
            fireEvent.click(screen.getByText('Leave'));
            expect(window.confirm).toHaveBeenCalledWith(
                'ra.message.unsaved_changes'
            );
            // check that we're no longer in the form
            await waitFor(() => {
                expect(screen.queryByText(field)).toBeNull();
            });
            screen.getByText('Somewhere');
        }
    );

    it('should warn when navigating from root to the show view with unsaved changes', () => {
        // mock click on "cancel" in the confirm dialog
        window.confirm = jest.fn().mockReturnValue(false);
        render(<App />);
        const input = screen.getByLabelText('First Name') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'John Doe' } });
        fireEvent.blur(input);
        expect(screen.queryByDisplayValue('John Doe')).not.toBeNull();
        fireEvent.click(screen.getByText('Go to Show view'));
        expect(window.confirm).toHaveBeenCalledWith(
            'ra.message.unsaved_changes'
        );
        // check that we're still in the form and that the unsaved changes are here
        expect(screen.queryByDisplayValue('John Doe')).not.toBeNull();
        expect(screen.queryByText('Show')).toBeNull();
    });
    it('should warn when navigating from a sub page to the show view with unsaved changes', () => {
        // mock click on "cancel" in the confirm dialog
        window.confirm = jest.fn().mockReturnValue(false);
        render(<App initialEntries={['/form/part1']} />);
        const input = screen.getByLabelText('First Name') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'John Doe' } });
        fireEvent.blur(input);
        expect(screen.queryByDisplayValue('John Doe')).not.toBeNull();
        fireEvent.click(screen.getByText('Go to Show view'));
        expect(window.confirm).toHaveBeenCalledWith(
            'ra.message.unsaved_changes'
        );
        // check that we're still in the form and that the unsaved changes are here
        expect(screen.queryByDisplayValue('John Doe')).not.toBeNull();
        expect(screen.queryByText('Show')).toBeNull();
    });

    afterAll(() => delete window.confirm);
});
