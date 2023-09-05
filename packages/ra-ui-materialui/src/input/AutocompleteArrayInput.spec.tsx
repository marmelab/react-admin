import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    testDataProvider,
    TestTranslationProvider,
    useRecordContext,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';
import {
    InsideReferenceArrayInput,
    InsideReferenceArrayInputOnChange,
    OnChange,
} from './AutocompleteArrayInput.stories';

describe('<AutocompleteArrayInput />', () => {
    const defaultProps = {
        source: 'tags',
        resource: 'posts',
    };

    it('should extract suggestions from choices', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );
        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[
                            { id: 't', foobar: 'Technical' },
                            { id: 'p', foobar: 'Programming' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );

        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            { id: 't', foobar: { name: 'Technical' } },
                            { id: 'p', foobar: { name: 'Programming' } },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );

        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[
                            { id: 't', foobar: 'Technical' },
                            { id: 'p', foobar: 'Programming' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );

        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                        />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('**resources.posts.fields.tags**'),
            'a'
        );

        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('**Technical**')).not.toBeNull();
        expect(screen.getByText('**Programming**')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TestTranslationProvider translate={x => `**${x}**`}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                            translateChoice={false}
                        />
                    </SimpleForm>
                </TestTranslationProvider>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('**resources.posts.fields.tags**'),
            'a'
        );

        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
    });

    it('should make debounced calls to setFilter', async () => {
        const setFilter = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                        setFilter={setFilter}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.tags'
        ) as HTMLInputElement;

        userEvent.type(input, 'foo');
        userEvent.type(input, 'fooo');
        userEvent.type(input, 'foooo');
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setFilter).toHaveBeenCalledTimes(1);
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                        shouldRenderSuggestions={v => v.length > 2}
                        noOptionsText="No choices"
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.posts.fields.tags');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'Te' } });
        expect(screen.queryAllByRole('option')).toHaveLength(0);

        fireEvent.change(input, { target: { value: 'Tec' } });
        await waitFor(() => {
            expect(screen.queryAllByRole('option')).toHaveLength(1);
        });
    });

    it('should not fail when value is empty and new choices are applied', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.tags'
        ) as HTMLInputElement;
        expect(input.value).toEqual('');
    });

    it('should repopulate the suggestions after the suggestions are dismissed', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.tags');
        userEvent.type(input, 'foo');
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        fireEvent.blur(input);
        userEvent.type(input, 'a');
        expect(screen.queryAllByRole('option')).toHaveLength(1);
    });

    it('should not rerender searchText while having focus and new choices arrive', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.tags'
        ) as HTMLInputElement;

        fireEvent.focus(input);
        userEvent.type(input, 'foo');
        expect(input.value).toEqual('foo');
        expect(screen.queryAllByRole('option')).toHaveLength(0);

        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(input.value).toEqual('foo');
    });

    it('should revert the searchText on blur', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.tags'
        ) as HTMLInputElement;

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(screen.queryAllByRole('option')).toHaveLength(0);
        fireEvent.blur(input);
        await waitFor(() => {
            expect(input.value).toEqual('');
        });
    });

    it('should resolve value from input value', () => {
        const onChange = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        onChange={onChange}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.tags');

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'Technical' } });
        fireEvent.click(screen.getByRole('option'));
        fireEvent.blur(input);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            ['t'],
            [{ id: 't', name: 'Technical' }]
        );
    });

    it('should reset filter when input value changed', async () => {
        const setFilter = jest.fn();
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} record={{ tags: ['t'] }}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        setFilter={setFilter}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.posts.fields.tags');
        userEvent.type(input, 'p');
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setFilter).toHaveBeenCalledTimes(1);
        expect(setFilter).toHaveBeenCalledWith('p');
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} record={{ tags: ['p'] }}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        setFilter={setFilter}
                    />
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenCalledWith('');
        });
    });

    it('should reset filter only when needed, even if the value is an array of objects (fixes #4454)', async () => {
        const setFilter = jest.fn();
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    record={{ tags: [{ id: 't' }] }}
                >
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        parse={value => value && value.map(v => ({ id: v }))}
                        format={value => value && value.map(v => v.id)}
                        setFilter={setFilter}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.posts.fields.tags');
        userEvent.type(input, 'p');
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(1);
        });
        expect(setFilter).toHaveBeenCalledWith('p');
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    record={{ tags: [{ id: 'p' }] }}
                >
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        parse={value => value && value.map(v => ({ id: v }))}
                        format={value => value && value.map(v => v.id)}
                        setFilter={setFilter}
                    />
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
        });
        expect(setFilter).toHaveBeenCalledWith('');
    });

    it('should allow customized rendering of suggesting item', () => {
        const SuggestionItem = props => {
            const record = useRecordContext();
            return <div {...props} aria-label={record && record.name} />;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        optionText={<SuggestionItem />}
                        inputText={choice => choice?.name}
                        matchSuggestion={() => true}
                    />
                </SimpleForm>
            </AdminContext>
        );
        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );
        expect(screen.getByLabelText('Technical')).not.toBeNull();
        expect(screen.getByLabelText('Programming')).not.toBeNull();
    });

    it('should display helperText', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.getByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            expect(screen.queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm mode="onBlur" onSubmit={jest.fn()}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText('resources.posts.fields.tags');
            fireEvent.focus(input);
            fireEvent.blur(input);

            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.error')
                ).not.toBeNull();
            });
        });
    });

    it('updates suggestions when input is blurred and refocused', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.posts.fields.tags');

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(screen.queryAllByRole('option')).toHaveLength(2);
        fireEvent.blur(input);

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(screen.queryAllByRole('option')).toHaveLength(2);
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        const onChange = jest.fn();

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 1, name: 'ab' },
                            { id: 2, name: 'abc' },
                            { id: 3, name: '123' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.posts.fields.tags');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(screen.queryAllByRole('option')).toHaveLength(1);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should limit suggestions when suggestionLimit is passed', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        suggestionLimit={1}
                    />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText('resources.posts.fields.tags');
        userEvent.type(input, 'a');
        expect(screen.queryAllByRole('option')).toHaveLength(1);
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

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
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
                setTimeout(() => resolve(newChoice));
            });
        };

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
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

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.language'
        ) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        fireEvent.click(screen.getByText('Get the kid'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.queryByText('New Kid On The Block')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier when a create element is passed', () => {
        const choices = [
            { id: 't', foobar: 'Technical' },
            { id: 'p', foobar: 'Programming' },
        ];
        const newChoice = { id: 'js_fatigue', foobar: 'New Kid On The Block' };

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        create={<Create />}
                        optionText={choice => choice.foobar}
                        choices={choices}
                    />
                </SimpleForm>
            </AdminContext>
        );

        fireEvent.focus(
            screen.getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );
        expect(screen.queryAllByRole('option')).toHaveLength(2);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier when a create element is passed', () => {
        const choices = [
            { id: 't', foobar: { name: 'Technical' } },
            { id: 'p', foobar: { name: 'Programming' } },
        ];
        const newChoice = {
            id: 'js_fatigue',
            foobar: { name: 'New Kid On The Block' },
        };

        const Create = () => {
            const context = useCreateSuggestionContext();
            const handleClick = () => {
                choices.push(newChoice);
                context.onCreate(newChoice);
            };

            return <button onClick={handleClick}>Get the kid</button>;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        create={<Create />}
                        optionText="foobar.name"
                        choices={choices}
                    />
                </SimpleForm>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );
        expect(screen.queryAllByRole('option')).toHaveLength(3);
        expect(screen.getByText('Technical')).not.toBeNull();
        expect(screen.getByText('Programming')).not.toBeNull();
        expect(screen.getByText('ra.action.create_item')).not.toBeNull();
    });

    it('should support creation of a new choice through the onCreate event when optionText is a function', async () => {
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

        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                        optionText={() => `Choice is not displayed`}
                    />
                </SimpleForm>
            </AdminContext>
        );

        const input = screen.getByLabelText('resources.posts.fields.language', {
            selector: 'input',
        }) as HTMLInputElement;
        input.focus();
        fireEvent.change(input, { target: { value: 'New Kid On The Block' } });
        fireEvent.click(screen.getByText('ra.action.create_item'));
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                        optionText={choice => `Choice is ${choice.name}`}
                    />
                </SimpleForm>
            </AdminContext>
        );

        expect(
            screen.queryByText('Choice is New Kid On The Block')
        ).not.toBeNull();
    });

    it('should show the suggestions when the input value is empty and the input is focused and choices arrived late', () => {
        const { rerender } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        rerender(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                    />
                </SimpleForm>
            </AdminContext>
        );

        userEvent.type(
            screen.getByLabelText('resources.posts.fields.tags'),
            'a'
        );
        expect(screen.queryAllByRole('option')).toHaveLength(2);
    });

    it('should display "No options" and not throw any error inside a ReferenceArrayInput field when referenced list is empty', async () => {
        render(<InsideReferenceArrayInput />);
        // Give time for the (previously thrown) error to happen
        await new Promise(resolve => setTimeout(resolve, 1000));
        await waitFor(() => {
            screen.getByText('Author');
        });
        screen.getByRole('textbox').focus();
        fireEvent.click(screen.getByLabelText('Clear value'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'plop' },
        });
        await waitFor(
            () => {
                screen.getByText('No options');
            },
            { timeout: 2000 }
        );
    });

    it('should not display "No options" inside a ReferenceArrayInput field when referenced list loading', async () => {
        render(<InsideReferenceArrayInput />);
        // Give time for the (previously thrown) error to happen
        await new Promise(resolve => setTimeout(resolve, 1000));
        await waitFor(() => {
            screen.getByText('Author');
        });
        screen.getByRole('textbox').focus();
        fireEvent.click(screen.getByLabelText('Clear value'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'Vic' },
        });

        // As the No options message might only be displayed after a small delay,
        // we need to check for its presence for a few seconds.
        // This test failed before the fix
        const noOptionsAppeared = await new Promise(resolve => {
            let noOptionsAppeared = false;
            const checkForNoOptions = () => {
                noOptionsAppeared = screen.queryByText('No options') != null;
                if (noOptionsAppeared) {
                    clearInterval(interval);
                    resolve(noOptionsAppeared);
                }
            };

            const interval = setInterval(checkForNoOptions, 100);
            setTimeout(() => {
                clearInterval(interval);
                resolve(noOptionsAppeared);
            }, 2000);
        });

        expect(noOptionsAppeared).toBe(false);
    });

    it('should not crash if its value is not an array', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    defaultValues={{ tags: 'programming' }}
                >
                    <AutocompleteArrayInput
                        choices={[
                            { id: 'programming', name: 'Programming' },
                            { id: 'lifestyle', name: 'Lifestyle' },
                            { id: 'photography', name: 'Photography' },
                        ]}
                        {...defaultProps}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByRole('textbox')).not.toBeNull();
    });

    it('should not crash if its value is not an array and is empty', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()} defaultValues={{ tags: '' }}>
                    <AutocompleteArrayInput
                        choices={[
                            { id: 'programming', name: 'Programming' },
                            { id: 'lifestyle', name: 'Lifestyle' },
                            { id: 'photography', name: 'Photography' },
                        ]}
                        {...defaultProps}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByRole('textbox')).not.toBeNull();
    });

    it('should include full records when calling onChange', async () => {
        const onChange = jest.fn();
        render(<OnChange onChange={onChange} />);
        await screen.findByText('Editor');
        await screen.findByText('Reviewer');
        screen.getByRole('textbox').focus();
        fireEvent.click(await screen.findByText('Admin'));
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(
                ['u001', 'u003', 'admin'],
                [
                    {
                        id: 'u001',
                        name: 'Editor',
                    },
                    {
                        id: 'u003',
                        name: 'Reviewer',
                    },
                    {
                        id: 'admin',
                        name: 'Admin',
                    },
                ]
            );
        });
    });

    it('should include full records when calling onChange inside ReferenceArrayInput', async () => {
        const onChange = jest.fn();
        render(<InsideReferenceArrayInputOnChange onChange={onChange} />);
        (await screen.findByRole('textbox')).focus();
        fireEvent.click(await screen.findByText('Leo Tolstoy'));
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(
                [1],
                [
                    {
                        id: 1,
                        name: 'Leo Tolstoy',
                        language: 'Russian',
                    },
                ]
            );
        });
        expect(screen.getByDisplayValue('Russian')).not.toBeNull();
        screen.getAllByRole('textbox')[0].focus();
        fireEvent.click(await screen.findByText('Victor Hugo'));
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(
                [1, 2],
                [
                    {
                        id: 1,
                        name: 'Leo Tolstoy',
                        language: 'Russian',
                    },
                    {
                        id: 2,
                        name: 'Victor Hugo',
                        language: 'French',
                    },
                ]
            );
        });
        expect(screen.getByDisplayValue('French')).not.toBeNull();
    });
});
