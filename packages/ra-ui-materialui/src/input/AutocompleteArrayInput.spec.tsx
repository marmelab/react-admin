import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import expect from 'expect';
import { FormWithRedirect, TestTranslationProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { AutocompleteArrayInput } from './AutocompleteArrayInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

describe('<AutocompleteArrayInput />', () => {
    const defaultProps = {
        source: 'tags',
        resource: 'posts',
    };

    it('should extract suggestions from choices', () => {
        const { getByLabelText, getByText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );
        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText="foobar"
                        choices={[
                            { id: 't', foobar: 'Technical' },
                            { id: 'p', foobar: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText="foobar.name"
                        choices={[
                            { id: 't', foobar: { name: 'Technical' } },
                            { id: 'p', foobar: { name: 'Programming' } },
                        ]}
                    />
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        optionText={choice => choice.foobar}
                        choices={[
                            { id: 't', foobar: 'Technical' },
                            { id: 'p', foobar: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should translate the choices by default', () => {
        const { getByLabelText, getByText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <TestTranslationProvider translate={x => `**${x}**`}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                        />
                    </TestTranslationProvider>
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('**resources.posts.fields.tags**', {
                selector: 'input',
            })
        );

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('**Technical**')).not.toBeNull();
        expect(getByText('**Programming**')).not.toBeNull();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { getByLabelText, getByText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <TestTranslationProvider translate={x => `**${x}**`}>
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[
                                { id: 't', name: 'Technical' },
                                { id: 'p', name: 'Programming' },
                            ]}
                            translateChoice={false}
                        />
                    </TestTranslationProvider>
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('**resources.posts.fields.tags**', {
                selector: 'input',
            })
        );

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Technical')).not.toBeNull();
        expect(getByText('Programming')).not.toBeNull();
    });

    it('should make debounced calls to setFilter', async () => {
        const setFilter = jest.fn();
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                        setFilter={setFilter}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        }) as HTMLInputElement;

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        fireEvent.change(input, { target: { value: 'fooo' } });
        fireEvent.change(input, { target: { value: 'foooo' } });
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setFilter).toHaveBeenCalledTimes(1);
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        const { getByLabelText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                        shouldRenderSuggestions={v => v.length > 2}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'Te' } });
        expect(queryAllByRole('option')).toHaveLength(0);

        fireEvent.change(input, { target: { value: 'Tec' } });
        await waitFor(() => {
            expect(queryAllByRole('option')).toHaveLength(1);
        });
    });

    it('should not fail when value is empty and new choices are applied', () => {
        const { getByLabelText, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                )}
            />
        );

        rerender(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        }) as HTMLInputElement;
        expect(input.value).toEqual('');
    });

    it('should repopulate the suggestions after the suggestions are dismissed', () => {
        const { getByLabelText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(queryAllByRole('option')).toHaveLength(0);

        fireEvent.blur(input);
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '' } });
        expect(queryAllByRole('option')).toHaveLength(1);
    });

    it('should not rerender searchText while having focus and new choices arrive', () => {
        const optionText = jest.fn();
        const { getByLabelText, queryAllByRole, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                        optionText={v => {
                            optionText(v);
                            return v.name;
                        }}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        }) as HTMLInputElement;

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(queryAllByRole('option')).toHaveLength(0);

        rerender(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        optionText={v => {
                            optionText(v);
                            return v.name;
                        }}
                    />
                )}
            />
        );

        expect(input.value).toEqual('foo');
    });

    it('should revert the searchText on blur', () => {
        const { getByLabelText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        }) as HTMLInputElement;

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'foo' } });
        expect(queryAllByRole('option')).toHaveLength(0);
        fireEvent.blur(input);
        expect(input.value).toEqual('');
    });

    it('should show the suggestions when the input value is empty and the input is focused and choices arrived late', () => {
        const { getByLabelText, queryAllByRole, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => <AutocompleteArrayInput {...defaultProps} />}
            />
        );
        rerender(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                    />
                )}
            />
        );

        fireEvent.focus(
            getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );
        expect(queryAllByRole('option')).toHaveLength(2);
    });

    it('should resolve value from input value', () => {
        const onChange = jest.fn();
        const { getByLabelText, getByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        onChange={onChange}
                        choices={[{ id: 't', name: 'Technical' }]}
                    />
                )}
            />
        );

        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'Technical' } });
        fireEvent.click(getByRole('option'));
        fireEvent.blur(input);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(['t']);
    });

    it('should reset filter when input value changed', async () => {
        const setFilter = jest.fn();
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ tags: ['t'] }}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        setFilter={setFilter}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });
        userEvent.type(input, 'p');
        await new Promise(resolve => setTimeout(resolve, 260));
        expect(setFilter).toHaveBeenCalledTimes(1);
        expect(setFilter).toHaveBeenCalledWith('p');
        userEvent.type(input, '{arrowdown}{enter}');
        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
        });
        expect(setFilter).toHaveBeenCalledWith('');
    });

    it('should reset filter only when needed, even if the value is an array of objects (fixes #4454)', async () => {
        const setFilter = jest.fn();
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                defaultValues={{ tags: [{ id: 't' }] }}
                render={() => (
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
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });

        userEvent.type(input, 'p');
        await new Promise(resolve => setTimeout(resolve, 260));
        expect(setFilter).toHaveBeenCalledTimes(1);
        expect(setFilter).toHaveBeenCalledWith('p');
        userEvent.type(input, '{arrowdown}{enter}');

        await waitFor(() => {
            expect(setFilter).toHaveBeenCalledTimes(2);
            expect(setFilter).toHaveBeenCalledWith('');
        });
    });

    it('should allow customized rendering of suggesting item', () => {
        const SuggestionItem = ({ record }: { record?: any }) => (
            <div aria-label={record.name} />
        );

        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        optionText={<SuggestionItem />}
                        matchSuggestion={(filter, choice) => true}
                    />
                )}
            />
        );
        fireEvent.focus(
            getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            })
        );
        expect(getByLabelText('Technical')).not.toBeNull();
        expect(getByLabelText('Programming')).not.toBeNull();
    });

    it('should display helperText', () => {
        const { getByText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        helperText="Can I help you?"
                    />
                )}
            />
        );
        expect(getByText('Can I help you?')).not.toBeNull();
    });

    describe('error message', () => {
        const failingValidator = () => 'ra.validation.error';

        it('should not be displayed if field is pristine', () => {
            const { queryByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            expect(queryByText('ra.validation.error')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            const { getByLabelText, queryByText } = renderWithRedux(
                <FormWithRedirect
                    save={jest.fn()}
                    mode="onBlur"
                    render={() => (
                        <AutocompleteArrayInput
                            {...defaultProps}
                            choices={[{ id: 1, name: 'hello' }]}
                            validate={failingValidator}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.tags', {
                selector: 'input',
            });
            fireEvent.focus(input);
            fireEvent.blur(input);

            await waitFor(() => {
                expect(queryByText('ra.validation.error')).not.toBeNull();
            });
        });
    });

    it('updates suggestions when input is blurred and refocused', () => {
        const { getByLabelText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(queryAllByRole('option')).toHaveLength(2);
        fireEvent.blur(input);

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(queryAllByRole('option')).toHaveLength(2);
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        const onChange = jest.fn();

        const { getByLabelText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(queryAllByRole('option')).toHaveLength(1);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('passes options.suggestionsContainerProps to the suggestions container', () => {
        const { getByLabelText } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[{ id: 1, name: 'ab' }]}
                        options={{
                            suggestionsContainerProps: {
                                'aria-label': 'Me',
                            },
                        }}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });
        fireEvent.focus(input);

        expect(getByLabelText('Me')).not.toBeNull();
    });

    it('should limit suggestions when suggestionLimit is passed', () => {
        const { getByLabelText, queryAllByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...defaultProps}
                        choices={[
                            { id: 't', name: 'Technical' },
                            { id: 'p', name: 'Programming' },
                        ]}
                        suggestionLimit={1}
                    />
                )}
            />
        );
        const input = getByLabelText('resources.posts.fields.tags', {
            selector: 'input',
        });
        fireEvent.focus(input);
        expect(queryAllByRole('option')).toHaveLength(1);
    });

    it('should not render a LinearProgress if loading is true and a second has not passed yet', () => {
        const { queryByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        const { queryByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        const { queryByRole } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        {...{
                            ...defaultProps,
                        }}
                    />
                )}
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

        const {
            getByLabelText,
            getByText,
            queryByText,
            rerender,
        } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        await new Promise(resolve => setImmediate(resolve));
        rerender(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );

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
                setImmediate(() => resolve(newChoice));
            });
        };

        const {
            getByLabelText,
            getByText,
            queryByText,
            rerender,
        } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
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
        await new Promise(resolve => setImmediate(resolve));
        rerender(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        onCreate={handleCreate}
                    />
                )}
            />
        );

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

        const {
            getByLabelText,
            rerender,
            getByText,
            queryByText,
        } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
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
        await new Promise(resolve => setImmediate(resolve));
        rerender(
            <FormWithRedirect
                save={jest.fn()}
                render={() => (
                    <AutocompleteArrayInput
                        source="language"
                        resource="posts"
                        choices={choices}
                        create={<Create />}
                    />
                )}
            />
        );

        expect(queryByText('New Kid On The Block')).not.toBeNull();
    });
});
