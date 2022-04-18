import * as React from 'react';
import { FunctionComponent, ReactElement, useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFormContext } from 'react-hook-form';
import { CoreAdminContext } from '../core';
import { testDataProvider } from '../dataProvider';
import { Form } from './Form';
import { useInput, InputProps } from './useInput';
import { required } from './validate';

const Input: FunctionComponent<
    {
        children: (props: ReturnType<typeof useInput>) => ReactElement;
    } & InputProps
> = ({ children, ...props }) => {
    const inputProps = useInput(props);
    return children(inputProps);
};

describe('useInput', () => {
    it('returns the props needed for an input', () => {
        let inputProps;
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
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
                </Form>
            </CoreAdminContext>
        );

        expect(inputProps.id).toEqual('title');
        expect(inputProps.isRequired).toEqual(true);
        expect(inputProps.field).toBeDefined();
        expect(inputProps.field.name).toEqual('title');
        expect(inputProps.field.value).toEqual('A title');
        expect(inputProps.fieldState).toBeDefined();
    });

    it('allows to override the input id', () => {
        let inputProps;
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <Input id="my-title" source="title" resource="posts">
                        {props => {
                            inputProps = props;
                            return <div />;
                        }}
                    </Input>
                </Form>
            </CoreAdminContext>
        );

        expect(inputProps.id).toEqual('my-title');
        expect(inputProps.field).toBeDefined();
        expect(inputProps.field.name).toEqual('title');
        expect(inputProps.fieldState).toBeDefined();
    });

    it('allows to extend the input event handlers', () => {
        const handleBlur = jest.fn();
        const handleChange = jest.fn();

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <Input
                        source="title"
                        resource="posts"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        defaultValue=""
                    >
                        {({ id, field }) => {
                            return (
                                <input
                                    type="text"
                                    id={id}
                                    aria-label="Title"
                                    {...field}
                                />
                            );
                        }}
                    </Input>
                </Form>
            </CoreAdminContext>
        );
        const input = screen.getByLabelText('Title');

        fireEvent.change(input, {
            target: { value: 'A title' },
        });
        expect(handleChange).toHaveBeenCalled();

        fireEvent.blur(input);
        expect(handleBlur).toHaveBeenCalled();
    });

    it('applies the defaultValue when input does not have a value', () => {
        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input source="title" resource="posts" defaultValue="foo">
                        {({ id, field }) => {
                            return (
                                <input
                                    type="text"
                                    id={id}
                                    aria-label="Title"
                                    {...field}
                                />
                            );
                        }}
                    </Input>
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByDisplayValue('foo')).not.toBeNull();
    });

    it('does not apply the defaultValue when input has a value of 0', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1, views: 0 }}>
                    <Input source="views" resource="posts" defaultValue={99}>
                        {({ id, field }) => {
                            return (
                                <input
                                    type="number"
                                    id={id}
                                    aria-label="Views"
                                    {...field}
                                />
                            );
                        }}
                    </Input>
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByDisplayValue('99')).toBeNull();
    });

    it('does not apply the defaultValue when input has a value of 0', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1, views: 0 }}>
                    <Input source="views" resource="posts" defaultValue={99}>
                        {({ id, field }) => {
                            return (
                                <input
                                    type="number"
                                    id={id}
                                    aria-label="Views"
                                    {...field}
                                />
                            );
                        }}
                    </Input>
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByDisplayValue('99')).toBeNull();
    });

    const BooleanInput = ({
        source,
        defaultValue,
    }: {
        source: string;
        defaultValue?: boolean;
    }) => (
        <Input source={source} defaultValue={defaultValue} resource="posts">
            {() => <BooleanInputValue source={source} />}
        </Input>
    );

    const BooleanInputValue = ({ source }) => {
        const values = useFormContext().getValues();
        return (
            <>
                {typeof values[source] === 'undefined'
                    ? 'undefined'
                    : values[source]
                    ? 'true'
                    : 'false'}
            </>
        );
    };

    it('does not change the value if the field is of type checkbox and has no value', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1 }}>
                    <BooleanInput source="is_published" />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByText('undefined')).not.toBeNull();
    });

    it('applies the defaultValue true when the field is of type checkbox and has no value', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1 }}>
                    <BooleanInput source="is_published" defaultValue={true} />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByText('true')).not.toBeNull();
    });

    it('applies the defaultValue false when the field is of type checkbox and has no value', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1 }}>
                    <BooleanInput source="is_published" defaultValue={false} />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByText('false')).not.toBeNull();
    });

    it('does not apply the defaultValue true when the field is of type checkbox and has a value', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form
                    record={{ id: 1, is_published: false }}
                    onSubmit={jest.fn()}
                >
                    <BooleanInput source="is_published" defaultValue={true} />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByText('false')).not.toBeNull();
    });

    it('does not apply the defaultValue false when the field is of type checkbox and has a value', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form
                    record={{ id: 1, is_published: true }}
                    onSubmit={jest.fn()}
                >
                    <BooleanInput source="is_published" defaultValue={false} />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.queryByText('true')).not.toBeNull();
    });

    test('should apply the provided format function before passing the value to the real input', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <Input
                        format={value => `${value} formatted`}
                        source="test"
                        children={({ id, field }) => {
                            return <input type="text" id={id} {...field} />;
                        }}
                        defaultValue="test"
                    />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.getByDisplayValue('test formatted')).not.toBeNull();
    });

    test('should apply the provided parse function before applying the value from the real input', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <Input
                        defaultValue=""
                        parse={value => (value + 1).toString()}
                        source="test"
                        children={({ id, field }) => {
                            useEffect(() => {
                                field.onChange(999);
                            }, [field]);

                            return <input type="text" id={id} {...field} />;
                        }}
                    />
                </Form>
            </CoreAdminContext>
        );
        expect(screen.getByDisplayValue('1000')).not.toBeNull();
    });
});
