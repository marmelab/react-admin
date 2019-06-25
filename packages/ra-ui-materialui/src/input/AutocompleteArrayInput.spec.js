import React from 'react';
import {
    cleanup,
    fireEvent,
    render,
    waitForDomChange,
} from 'react-testing-library';

import { AutocompleteArrayInput } from './AutocompleteArrayInput';

describe('<AutocompleteArrayInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        // We have to specify the id ourselves here because the
        // TextInput is not wrapped inside a FormInput
        id: 'foo',
        source: 'foo',
        resource: 'bar',
        meta: {},
        input: { onChange: () => {} },
        translate: x => x,
    };

    it('should extract suggestions from choices', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );

        fireEvent.click(getByLabelText('resources.bar.fields.foo'));

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Male')).toBeDefined();
        expect(getByText('Female')).toBeDefined();
    });

    it('should use optionText with a string value as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                optionText="foobar"
                choices={[
                    { id: 'M', foobar: 'Male' },
                    { id: 'F', foobar: 'Female' },
                ]}
            />
        );

        fireEvent.click(getByLabelText('resources.bar.fields.foo'));

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Male')).toBeDefined();
        expect(getByText('Female')).toBeDefined();
    });

    it('should use optionText with a string value including "." as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                optionText="foobar.name"
                choices={[
                    { id: 'M', foobar: { name: 'Male' } },
                    { id: 'F', foobar: { name: 'Female' } },
                ]}
            />
        );

        fireEvent.click(getByLabelText('resources.bar.fields.foo'));

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Male')).toBeDefined();
        expect(getByText('Female')).toBeDefined();
    });

    it('should use optionText with a function value as text identifier', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                optionText={choice => choice.foobar}
                choices={[
                    { id: 'M', foobar: 'Male' },
                    { id: 'F', foobar: 'Female' },
                ]}
            />
        );

        fireEvent.click(getByLabelText('resources.bar.fields.foo'));

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Male')).toBeDefined();
        expect(getByText('Female')).toBeDefined();
    });

    it('should translate the choices by default', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                translate={x => `**${x}**`}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
            />
        );

        fireEvent.click(getByLabelText('resources.bar.fields.foo'));

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('**Male**')).toBeDefined();
        expect(getByText('**Female**')).toBeDefined();
    });

    it('should not translate the choices if translateChoice is false', () => {
        const { getByLabelText, getByText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                translate={x => `**${x}**`}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                translateChoice={false}
            />
        );

        fireEvent.click(getByLabelText('resources.bar.fields.foo'));

        expect(queryAllByRole('option')).toHaveLength(2);
        expect(getByText('Male')).toBeDefined();
        expect(getByText('Female')).toBeDefined();
    });

    it('should respect shouldRenderSuggestions over default if passed in', async () => {
        const { getByLabelText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: ['M'], onChange: () => {} }}
                choices={[{ id: 'M', name: 'Male' }]}
                shouldRenderSuggestions={v => v.length > 2}
            />
        );
        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'Ma' } });
        expect(queryAllByRole('option')).toHaveLength(0);

        fireEvent.change(input, { target: { value: 'Mal' } });
        expect(queryAllByRole('option')).toHaveLength(1);
    });

    describe('Fix issue #1410', () => {
        it('should not fail when value is empty and new choices are applied', () => {
            const { getByLabelText, rerender } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );

            rerender(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );
            const input = getByLabelText('resources.bar.fields.foo');
            expect(input.value).toEqual('');
        });

        it('should repopulate the suggestions after the suggestions are dismissed', () => {
            const { getByLabelText, queryAllByRole } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );

            const input = getByLabelText('resources.bar.fields.foo');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);

            fireEvent.blur(input);
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '' } });
            expect(queryAllByRole('option')).toHaveLength(1);
        });

        it('should not rerender searchtext while having focus and new choices arrive', () => {
            const optionText = jest.fn();
            const { getByLabelText, queryAllByRole, rerender } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: ['M'], onChange: () => {} }}
                    meta={{ active: true }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    optionText={v => {
                        optionText(v);
                        return v.name;
                    }}
                />
            );
            const input = getByLabelText('resources.bar.fields.foo');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);

            rerender(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: ['M'], onChange: () => {} }}
                    meta={{ active: true }}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    optionText={v => {
                        optionText(v);
                        return v.name;
                    }}
                />
            );
            expect(getByLabelText('resources.bar.fields.foo').value).toEqual(
                'foo'
            );
        });

        it('should allow input value to be cleared when allowEmpty is true and input text is empty', () => {
            const { getByLabelText, queryAllByRole } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    allowEmpty
                    input={{ value: ['M'], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );

            const input = getByLabelText('resources.bar.fields.foo');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);
            fireEvent.blur(input);

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '' } });
            expect(queryAllByRole('option')).toHaveLength(1);
        });

        it('should revert the searchText when allowEmpty is false', async () => {
            const { getByLabelText, queryAllByRole } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: ['M'], onChange: () => {} }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );

            const input = getByLabelText('resources.bar.fields.foo');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'foo' } });
            expect(queryAllByRole('option')).toHaveLength(0);
            fireEvent.blur(input);
            await waitForDomChange();
            expect(getByLabelText('resources.bar.fields.foo').value).toEqual(
                ''
            );
        });

        it('should show the suggestions when the input value is empty and the input is focussed and choices arrived late', () => {
            const { getByLabelText, queryAllByRole, rerender } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                />
            );
            rerender(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                />
            );

            fireEvent.focus(getByLabelText('resources.bar.fields.foo'));
            expect(queryAllByRole('option')).toHaveLength(2);
        });

        it('should resolve value from input value', async () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange }}
                    choices={[{ id: 'M', name: 'Male' }]}
                />
            );

            const input = getByLabelText('resources.bar.fields.foo');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'male' } });
            fireEvent.blur(input);

            await waitForDomChange();
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(['M']);
        });

        it('should reset filter when input value changed', () => {
            const setFilter = jest.fn();
            const { getByLabelText, rerender } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [1] }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    setFilter={setFilter}
                />
            );
            const input = getByLabelText('resources.bar.fields.foo');
            fireEvent.change(input, { target: { value: 'de' } });
            expect(setFilter).toHaveBeenCalledTimes(1);
            expect(setFilter).toHaveBeenCalledWith('de');

            rerender(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [2] }}
                    choices={[{ id: 'M', name: 'Male' }]}
                    setFilter={setFilter}
                />
            );
            expect(setFilter).toHaveBeenCalledTimes(2);
        });

        it('should allow customized rendering of suggesting item', () => {
            const { getByLabelText } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [1] }}
                    choices={[
                        { id: 'M', name: 'Male' },
                        { id: 'F', name: 'Female' },
                    ]}
                    suggestionComponent={React.forwardRef(
                        (
                            { suggestion, query, isHighlighted, ...props },
                            ref
                        ) => (
                            <div
                                {...props}
                                ref={ref}
                                aria-label={suggestion.name}
                            />
                        )
                    )}
                />
            );
            fireEvent.focus(getByLabelText('resources.bar.fields.foo'));
            expect(getByLabelText('Male')).toBeDefined();
            expect(getByLabelText('Female')).toBeDefined();
        });
    });

    it('should display helperText', () => {
        const { getByText } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                helperText="Can I help you?"
            />
        );
        expect(getByText('Can I help you?')).toBeDefined();
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    meta={{ touched: false, error: 'Required' }}
                />
            );
            expect(queryByText('Required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { queryByText } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required' }}
                />
            );
            expect(queryByText('Required')).toBeDefined();
        });
    });

    describe('Fix issue #2121', () => {
        it('updates suggestions when input is blurred and refocused', async () => {
            const { getByLabelText, queryAllByRole } = render(
                <AutocompleteArrayInput
                    {...defaultProps}
                    input={{ value: [], onChange: () => {} }}
                    choices={[
                        { id: 1, name: 'ab' },
                        { id: 2, name: 'abc' },
                        { id: 3, name: '123' },
                    ]}
                />
            );
            const input = getByLabelText('resources.bar.fields.foo');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'ab' } });
            expect(queryAllByRole('option')).toHaveLength(2);
            fireEvent.blur(input);
            await waitForDomChange();

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'ab' } });
            expect(queryAllByRole('option')).toHaveLength(2);
        });
    });

    it('does not automatically select a matched choice if there are more than one', () => {
        const { getByLabelText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange: () => {} }}
                choices={[
                    { id: 1, name: 'ab' },
                    { id: 2, name: 'abc' },
                    { id: 3, name: '123' },
                ]}
            />
        );

        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'ab' } });
        expect(queryAllByRole('option')).toHaveLength(2);
    });

    it('does not automatically select a matched choice if there is only one', async () => {
        const onChange = jest.fn();

        const { getByLabelText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange }}
                choices={[
                    { id: 1, name: 'ab' },
                    { id: 2, name: 'abc' },
                    { id: 3, name: '123' },
                ]}
            />
        );
        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(queryAllByRole('option')).toHaveLength(1);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('automatically selects a matched choice on blur if there is only one', async () => {
        const onChange = jest.fn();

        const { getByLabelText } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                input={{ value: [], onChange }}
                choices={[
                    { id: 1, name: 'ab' },
                    { id: 2, name: 'abc' },
                    { id: 3, name: '123' },
                ]}
            />
        );
        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.blur(input);
        await waitForDomChange();

        expect(onChange).toHaveBeenCalled();
    });

    it('passes options.suggestionsContainerProps to the suggestions container', () => {
        const { getByLabelText } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[{ id: 1, name: 'ab' }]}
                options={{
                    suggestionsContainerProps: {
                        'aria-label': 'Me',
                    },
                }}
            />
        );
        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.focus(input);

        expect(getByLabelText('Me')).toBeDefined();
    });

    it('should limit suggestions when suggestionLimit is passed', () => {
        const { getByLabelText, queryAllByRole } = render(
            <AutocompleteArrayInput
                {...defaultProps}
                choices={[
                    { id: 'M', name: 'Male' },
                    { id: 'F', name: 'Female' },
                ]}
                suggestionLimit={1}
            />
        );
        const input = getByLabelText('resources.bar.fields.foo');
        fireEvent.focus(input);
        expect(queryAllByRole('option')).toHaveLength(1);
    });
});
