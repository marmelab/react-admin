import * as React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AutocompleteInput } from './AutocompleteInput';
import { Form } from 'react-final-form';
import { FormDataConsumer, TestTranslationProvider } from 'ra-core';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import { renderWithRedux } from 'ra-test';
import { SimpleForm } from '../form';

describe('<AutocompleteInput />', () => {
    // Fix document.createRange is not a function error on fireEvent usage (Fixed in jsdom v16.0.0)
    // reported by https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
    global.document.createRange = () => ({
        setStart: () => {},
        setEnd: () => {},
        commonAncestorContainer: {
            nodeName: 'BODY',
            ownerDocument: document,
        },
    });

    const defaultProps = {
        source: 'role',
        resource: 'users',
    };

    it('should use a Downshift', () => {
        const { getByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'hello' }]}
                    />
                )}
            />
        );
        expect(getByRole('combobox')).not.toBeNull();
    });

    it('should set AutocompleteInput value to an empty string when the selected item is null', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('')).not.toBeNull();
    });

    it('should use the input parameter value as the initial state and input searchText', () => {
        const { queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('should use optionValue as value identifier', async () => {
        const { getByLabelText, queryByText, queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar"
                        choices={[
                            { foobar: 2, name: 'foo' },
                            { foobar: 3, name: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionValue including "." as value identifier', async () => {
        const { getByLabelText, queryByDisplayValue, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionValue="foobar.id"
                        choices={[
                            { foobar: { id: 2 }, name: 'foo' },
                            { foobar: { id: 3 }, name: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a string value as text identifier', async () => {
        const { getByLabelText, queryByText, queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[
                            { id: 2, foobar: 'foo' },
                            { id: 3, foobar: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();

        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a string value including "." as text identifier', async () => {
        const { getByLabelText, queryByText, queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            { id: 2, foobar: { name: 'foo' } },
                            { id: 3, foobar: { name: 'bar' } },
                        ]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();

        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('bar')).not.toBeNull();
        });
    });

    it('should use optionText with a function value as text identifier', async () => {
        const { getByLabelText, queryByText, queryByDisplayValue } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[
                            { id: 2, foobar: 'foo' },
                            { id: 3, foobar: 'bar' },
                        ]}
                    />
                )}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();

        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('bar')).not.toBeNull();
        });
    });

    it('should translate the value by default', () => {
        const { queryByDisplayValue } = render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(queryByDisplayValue('**foo**')).not.toBeNull();
    });

    it('should not translate the value if translateChoice is false', () => {
        const { queryByDisplayValue } = render(
            <TestTranslationProvider translate={x => `**${x}**`}>
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            translateChoice={false}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            </TestTranslationProvider>
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
        expect(queryByDisplayValue('**foo**')).toBeNull();
    });

    it('should show the suggestions on focus', async () => {
        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[{ id: 2, name: 'foo' }]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('foo')).not.toBeNull();
        });
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        const { getByLabelText, queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        shouldRenderSuggestions={() => false}
                        choices={[
                            { id: 1, name: 'bar' },
                            { id: 2, name: 'foo' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        await waitFor(() => {
            expect(queryByText('foo')).toBeNull();
        });
    });

    describe('Fix issue #1410', () => {
        it('should not fail when value is null and new choices are applied', () => {
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            expect(input.value).toEqual('');
            // Temporary workaround until we can upgrade testing-library in v4
            input.focus();

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'bar' }]}
                        />
                    )}
                />
            );

            expect(input.value).toEqual('');
        });

        it('should repopulate the suggestions after the suggestions are dismissed', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'bar' } });
            expect(queryByText('foo')).toBeNull();

            // Temporary workaround until we can upgrade testing-library in v4
            input.blur();
            input.focus();
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryByText('foo')).not.toBeNull();
        });

        it('should not rerender searchText while having focus and new choices arrive', () => {
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.change(input, { target: { value: 'foo' } });

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: null }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'bar' }]}
                        />
                    )}
                />
            );

            expect(input.value).toEqual('foo');
        });

        it('should revert the searchText when allowEmpty is false', async () => {
            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 2, name: 'foo' }]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'bar' } });
            fireEvent.blur(input);
            await waitFor(() => {
                expect(input.value).toEqual('foo');
            });
        });

        it('should show the suggestions when the input value is null and the input is focussed and choices arrived late', () => {
            const { getByLabelText, queryByText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => <AutocompleteInput {...defaultProps} />}
                />
            );

            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.focus(input);

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );
            expect(
                queryByText('foo', {
                    selector: '[role="option"] *',
                })
            ).not.toBeNull();
            expect(
                queryByText('bar', {
                    selector: '[role="option"] *',
                })
            ).not.toBeNull();
        });

        it('should reset filter when input value changed', () => {
            const setFilter = jest.fn();
            const { getByLabelText, rerender } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 2 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            setFilter={setFilter}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.change(input, { target: { value: 'bar' } });
            expect(setFilter).toHaveBeenCalledTimes(3);
            expect(setFilter).toHaveBeenCalledWith('bar');

            rerender(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 1 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            setFilter={setFilter}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );
            expect(setFilter).toHaveBeenCalledTimes(5);
            expect(setFilter).toHaveBeenCalledWith('');
        });

        it('should allow customized rendering of suggesting item', () => {
            const SuggestionItem = ({ record }: { record?: any }) => (
                <div aria-label={record && record.name} />
            );

            const { getByLabelText, queryByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            optionText={<SuggestionItem />}
                            inputText={record => record && record.name}
                            matchSuggestion={() => true}
                            choices={[
                                { id: 1, name: 'bar' },
                                { id: 2, name: 'foo' },
                            ]}
                        />
                    )}
                />
            );

            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.focus(input);
            expect(queryByLabelText('bar')).not.toBeNull();
            expect(queryByLabelText('foo')).not.toBeNull();
        });
    });

    it('should throw an error if no inputText was provided when the optionText returns an element', () => {
        const mock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const SuggestionItem = ({ record }: { record?: any }) => (
            <div aria-label={record && record.name} />
        );

        const t = () => {
            act(() => {
                render(
                    <Form
                        onSubmit={jest.fn()}
                        render={() => (
                            <AutocompleteInput
                                {...defaultProps}
                                optionText={() => <SuggestionItem />}
                                matchSuggestion={() => true}
                                choices={[
                                    { id: 1, name: 'bar' },
                                    { id: 2, name: 'foo' },
                                ]}
                            />
                        )}
                    />
                );
            });
        };
        expect(t).toThrow(
            'When optionText returns a React element, you must also provide the inputText prop'
        );
        mock.mockRestore();
    });

    it('should display helperText if specified', () => {
        const { queryByText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        helperText="Can I help you?"
                        choices={[{ id: 1, name: 'hello' }]}
                    />
                )}
            />
        );
        expect(queryByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            expect(queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });
            fireEvent.focus(input);
            fireEvent.blur(input);

            expect(queryByText('ra.validation.error')).not.toBeNull();
        });
    });

    describe('Fix issue #2121', () => {
        it('updates suggestions when input is blurred and refocused', () => {
            const { queryAllByRole, getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[
                                { id: 1, name: 'ab' },
                                { id: 2, name: 'abc' },
                                { id: 3, name: '123' },
                            ]}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.users.fields.role', {
                selector: 'input',
            });

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'a' } });
            expect(queryAllByRole('option').length).toEqual(2);
            fireEvent.blur(input);

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'a' } });
            expect(queryAllByRole('option').length).toEqual(2);
        });
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        const { queryAllByRole, getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        await waitFor(() => expect(queryAllByRole('option').length).toEqual(1));
    });

    it('passes options.suggestionsContainerProps to the suggestions container', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ role: 2 }}
                render={() => (
                    <AutocompleteInput
                        {...defaultProps}
                        options={{
                            suggestionsContainerProps: {
                                'aria-label': 'My Suggestions Container',
                            },
                        }}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.users.fields.role', {
            selector: 'input',
        });
        fireEvent.focus(input);

        expect(getByLabelText('My Suggestions Container')).not.toBeNull();
    });

    describe('Fix issue #4660', () => {
        it('should accept 0 as an input value', () => {
            const { queryByDisplayValue } = render(
                <Form
                    onSubmit={jest.fn()}
                    initialValues={{ role: 0 }}
                    render={() => (
                        <AutocompleteInput
                            {...defaultProps}
                            choices={[{ id: 0, name: 'foo' }]}
                        />
                    )}
                />
            );
            expect(queryByDisplayValue('foo')).not.toBeNull();
        });
    });

    it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
        const { queryByRole } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...{
                            ...defaultProps,
                            loaded: true,
                            loading: true,
                        }}
                    />
                )}
            />
        );

        expect(queryByRole('progressbar')).toBeNull();
    });

    it('should render a LinearProgress if loading is true and a second has passed', async () => {
        const { queryByRole } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        {...{
                            ...defaultProps,
                            loaded: true,
                            loading: true,
                        }}
                    />
                )}
            />
        );

        await new Promise(resolve => setTimeout(resolve, 1001));

        expect(queryByRole('progressbar')).not.toBeNull();
    });

    it('should not render a LinearProgress if loading is false', () => {
        const { queryByRole } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => <AutocompleteInput {...defaultProps} />}
            />
        );

        expect(queryByRole('progressbar')).toBeNull();
    });

    it('should support creation of a new choice through the onCreate event', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const handleCreate = filter => {
            const newChoice = {
                id: 'js_fatigue',
                name: filter,
            };
            choices.push(newChoice);
            return newChoice;
        };

        const { getByLabelText, getByText, queryByText, rerender } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.language', {
            selector: 'input',
        }) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        resettable
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );
        fireEvent.click(getByLabelText('ra.action.clear_input_value'));

        expect(queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event with a promise', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const handleCreate = filter => {
            return new Promise(resolve => {
                const newChoice = {
                    id: 'js_fatigue',
                    name: filter,
                };
                choices.push(newChoice);
                setTimeout(() => resolve(newChoice), 100);
            });
        };

        const { getByLabelText, getByText, queryByText, rerender } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                        resettable
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.language', {
            selector: 'input',
        }) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        resettable
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );
        fireEvent.click(getByLabelText('ra.action.clear_input_value'));

        expect(queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should support creation of a new choice through the create element', async () => {
        const choices = [
            { id: 'ang', name: 'Angular' },
            { id: 'rea', name: 'React' },
        ];
        const newChoice = { id: 'js_fatigue', name: 'New Kid On The Block' };

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        const { getByLabelText, rerender, getByText, queryByText } = render(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                        resettable
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.language', {
            selector: 'input',
        }) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(getByText('ra.action.create_item'));
        fireEvent.click(getByText('Get the kid'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <Form
                validateOnBlur
                onSubmit={jest.fn()}
                render={() => (
                    <AutocompleteInput
                        source="language"
                        resource="posts"
                        resettable
                        choices={choices}
                        create={<Create />}
                    />
                )}
            />
        );
        fireEvent.click(getByLabelText('ra.action.clear_input_value'));

        expect(queryByText('New Kid On The Block')).not.toBeNull();
    });

    it("should allow to edit the input if it's inside a FormDataConsumer", () => {
        const { getByLabelText } = renderWithRedux(
            <SimpleForm validateOnBlur basePath="/posts" resource="posts">
                <FormDataConsumer>
                    {({ formData, ...rest }) => {
                        return (
                            <AutocompleteInput
                                label="Id"
                                choices={[
                                    {
                                        name: 'General Practitioner',
                                        id: 'GeneralPractitioner',
                                    },
                                    {
                                        name: 'Physiotherapist',
                                        id: 'Physiotherapist',
                                    },
                                    {
                                        name: 'Clinical Pharmacist',
                                        id: 'ClinicalPharmacist',
                                    },
                                ]}
                                source="id"
                            />
                        );
                    }}
                </FormDataConsumer>
            </SimpleForm>
        );
        const input = getByLabelText('Id', {
            selector: 'input',
        }) as HTMLInputElement;
        fireEvent.focus(input);
        userEvent.type(input, 'Hello World!');
        expect(input.value).toEqual('Hello World!');
    });
});
