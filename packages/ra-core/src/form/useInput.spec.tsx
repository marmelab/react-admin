import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import FormWithRedirect from './FormWithRedirect';
import useInput, { InputProps } from './useInput';
import { required } from './validate';
import { renderWithRedux } from '../../../ra-test/esm';

const Input: FunctionComponent<
    { children: (props: any) => ReactElement } & InputProps
> = ({ children, ...props }) => {
    const inputProps = useInput(props);
    return children(inputProps);
};

describe('useInput', () => {
    it('returns the props needed for an input', () => {
        let inputProps;
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <Input
                        defaultValue="A title"
                        source="title"
                        resource="posts"
                        validate={required()}
                    >
                        {props => {
                            inputProps = props;
                            return <div />;
                        }}
                    </Input>
                )}
            />
        );

        expect(inputProps.id).toEqual('title');
        expect(inputProps.isRequired).toEqual(true);
        expect(inputProps.input).toBeDefined();
        expect(inputProps.input.name).toEqual('title');
        expect(inputProps.input.value).toEqual('A title');
        expect(inputProps.meta).toBeDefined();
    });

    it('allows to override the input id', () => {
        let inputProps;
        render(
            <Form
                onSubmit={jest.fn()}
                render={() => (
                    <Input id="my-title" source="title" resource="posts">
                        {props => {
                            inputProps = props;
                            return <div />;
                        }}
                    </Input>
                )}
            />
        );

        expect(inputProps.id).toEqual('my-title');
        expect(inputProps.input).toBeDefined();
        expect(inputProps.input.name).toEqual('title');
        expect(inputProps.meta).toBeDefined();
    });

    it('allows to extend the input event handlers', () => {
        const handleBlur = jest.fn();
        const handleChange = jest.fn();
        const handleFocus = jest.fn();
        let formApi;

        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ form }) => {
                    formApi = form;

                    return (
                        <Input
                            source="title"
                            resource="posts"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        >
                            {({ id, input }) => {
                                return (
                                    <input
                                        type="text"
                                        id={id}
                                        aria-label="Title"
                                        {...input}
                                    />
                                );
                            }}
                        </Input>
                    );
                }}
            />
        );
        const input = getByLabelText('Title');
        // Temporary workaround until we can upgrade testing-library in v4
        input.focus();
        expect(handleFocus).toHaveBeenCalled();
        expect(formApi.getState().active).toEqual('title');

        fireEvent.change(input, {
            target: { value: 'A title' },
        });
        expect(handleChange).toHaveBeenCalled();
        expect(formApi.getState().values).toEqual({ title: 'A title' });

        input.blur();
        expect(handleBlur).toHaveBeenCalled();
        expect(formApi.getState().active).toBeUndefined();
    });

    it('applies the defaultValue when input does not have a value', () => {
        const { queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                onSubmit={jest.fn()}
                render={() => {
                    return (
                        <Input
                            source="title"
                            resource="posts"
                            defaultValue="foo"
                        >
                            {({ id, input }) => {
                                return (
                                    <input
                                        type="text"
                                        id={id}
                                        aria-label="Title"
                                        {...input}
                                    />
                                );
                            }}
                        </Input>
                    );
                }}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('does not apply the defaultValue when input has a value of 0', () => {
        const { queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                onSubmit={jest.fn()}
                record={{ id: 1, views: 0 }}
                render={() => {
                    return (
                        <Input
                            source="views"
                            resource="posts"
                            defaultValue={99}
                        >
                            {({ id, input }) => {
                                return (
                                    <input
                                        type="number"
                                        id={id}
                                        aria-label="Views"
                                        {...input}
                                    />
                                );
                            }}
                        </Input>
                    );
                }}
            />
        );
        expect(queryByDisplayValue('99')).toBeNull();
    });

    it('applies the initialValue when input does not have a value', () => {
        const { queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                onSubmit={jest.fn()}
                render={() => {
                    return (
                        <Input
                            source="title"
                            resource="posts"
                            initialValue="foo"
                        >
                            {({ id, input }) => {
                                return (
                                    <input
                                        type="text"
                                        id={id}
                                        aria-label="Title"
                                        {...input}
                                    />
                                );
                            }}
                        </Input>
                    );
                }}
            />
        );
        expect(queryByDisplayValue('foo')).not.toBeNull();
    });

    it('does not apply the initialValue when input has a value of 0', () => {
        const { queryByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                onSubmit={jest.fn()}
                record={{ id: 1, views: 0 }}
                render={() => {
                    return (
                        <Input
                            source="views"
                            resource="posts"
                            initialValue={99}
                        >
                            {({ id, input }) => {
                                return (
                                    <input
                                        type="number"
                                        id={id}
                                        aria-label="Views"
                                        {...input}
                                    />
                                );
                            }}
                        </Input>
                    );
                }}
            />
        );
        expect(queryByDisplayValue('99')).toBeNull();
    });
});
