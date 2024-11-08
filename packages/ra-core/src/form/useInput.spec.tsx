import * as React from 'react';
import { FunctionComponent, ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CoreAdminContext, SourceContextProvider } from '../core';
import { testDataProvider } from '../dataProvider';
import { Form } from './Form';
import { useInput, InputProps, UseInputValue } from './useInput';
import { required } from './validate';

const Input: FunctionComponent<
    {
        children: (props: ReturnType<typeof useInput>) => ReactElement;
    } & InputProps
> = props => {
    const inputProps = useInput(props);
    return props.children(inputProps);
};

const InputWithCustomOnChange: FunctionComponent<
    {
        children: (props: ReturnType<typeof useInput>) => ReactElement;
    } & InputProps & { setContextValue?: (value: string) => void }
> = ({ children, setContextValue, ...props }) => {
    const { getValues } = useFormContext();

    return (
        <Input
            {...props}
            onChange={e => {
                if (props.onChange) {
                    props.onChange(e);
                }
                if (setContextValue) {
                    setContextValue(getValues()[props.source]);
                }
            }}
        >
            {children}
        </Input>
    );
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

        expect(inputProps.id).toEqual(':r0:');
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

    it('custom onChange handler should have access to updated context input value', () => {
        let targetValue, contextValue;
        const handleChange = e => {
            targetValue = e.target.value;
        };
        const setContextValue = value => {
            contextValue = value;
        };

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <InputWithCustomOnChange
                        source="title"
                        resource="posts"
                        onChange={handleChange}
                        setContextValue={setContextValue}
                        defaultValue=""
                    >
                        {({ id, field }) => (
                            <input
                                type="text"
                                id={id}
                                aria-label="Title"
                                {...field}
                            />
                        )}
                    </InputWithCustomOnChange>
                </Form>
            </CoreAdminContext>
        );
        const input = screen.getByLabelText('Title');

        fireEvent.change(input, {
            target: { value: 'Changed title' },
        });
        expect(targetValue).toBe('Changed title');
        expect(contextValue).toBe('Changed title');
    });

    describe('defaultValue', () => {
        it('applies the defaultValue when input does not have a value', () => {
            const onSubmit = jest.fn();
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={onSubmit}>
                        <Input
                            source="title"
                            resource="posts"
                            defaultValue="foo"
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
            expect(screen.queryByDisplayValue('foo')).not.toBeNull();
        });

        it('does not apply the defaultValue when input has a value of 0', () => {
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} record={{ id: 1, views: 0 }}>
                        <Input
                            source="views"
                            resource="posts"
                            defaultValue={99}
                        >
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
                        <BooleanInput
                            source="is_published"
                            defaultValue={true}
                        />
                    </Form>
                </CoreAdminContext>
            );
            expect(screen.queryByText('true')).not.toBeNull();
        });

        it('applies the defaultValue false when the field is of type checkbox and has no value', () => {
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} record={{ id: 1 }}>
                        <BooleanInput
                            source="is_published"
                            defaultValue={false}
                        />
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
                        <BooleanInput
                            source="is_published"
                            defaultValue={true}
                        />
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
                        <BooleanInput
                            source="is_published"
                            defaultValue={false}
                        />
                    </Form>
                </CoreAdminContext>
            );
            expect(screen.queryByText('true')).not.toBeNull();
        });
    });

    describe('format', () => {
        it('should format null values to an empty string to avoid console warnings about controlled/uncontrolled components', () => {
            let inputProps;
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} record={{ id: 1, views: null }}>
                        <Input source="views" resource="posts">
                            {props => {
                                inputProps = props;
                                return <div />;
                            }}
                        </Input>
                    </Form>
                </CoreAdminContext>
            );
            expect(inputProps.field.value).toEqual('');
        });

        it('should format undefined values to an empty string to avoid console warnings about controlled/uncontrolled components', () => {
            let inputProps;
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} record={{ id: 1 }}>
                        <Input source="views" resource="posts">
                            {props => {
                                inputProps = props;
                                return <div />;
                            }}
                        </Input>
                    </Form>
                </CoreAdminContext>
            );
            expect(inputProps.field.value).toEqual('');
        });

        it('should format null default values to an empty string to avoid console warnings about controlled/uncontrolled components', () => {
            let inputProps;
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()}>
                        <Input
                            source="views"
                            resource="posts"
                            defaultValue={null}
                        >
                            {props => {
                                inputProps = props;
                                return <div />;
                            }}
                        </Input>
                    </Form>
                </CoreAdminContext>
            );
            expect(inputProps.field.value).toEqual('');
        });

        it('should apply the provided format function before passing the value to the real input', () => {
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
    });

    describe('parse', () => {
        it('should apply the provided parse function before applying the value from the real input', () => {
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()}>
                        <Input
                            defaultValue=""
                            parse={value => (value + 1).toString()}
                            source="test"
                            children={({ id, field }) => {
                                return (
                                    <>
                                        <input type="text" id={id} {...field} />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                field.onChange(999);
                                            }}
                                        >
                                            Set to 999
                                        </button>
                                    </>
                                );
                            }}
                        />
                    </Form>
                </CoreAdminContext>
            );

            fireEvent.click(screen.getByText('Set to 999'));
            expect(screen.getByDisplayValue('1000')).not.toBeNull();
        });

        it('should parse empty strings to null by default', async () => {
            const onSubmit = jest.fn();
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={onSubmit}>
                        <Input
                            defaultValue="foo"
                            source="test"
                            children={({ id, field }) => {
                                const value = useWatch({ name: 'test' });

                                return (
                                    <>
                                        <input type="text" id={id} {...field} />
                                        <div>
                                            'test' value in form:&nbsp;
                                            <code>
                                                {JSON.stringify(value)} (
                                                {typeof value})
                                            </code>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                field.onChange('');
                                            }}
                                        >
                                            Set to empty
                                        </button>
                                    </>
                                );
                            }}
                        />
                    </Form>
                </CoreAdminContext>
            );
            fireEvent.click(screen.getByText('Set to empty'));
            await screen.findByText('null (object)');
        });
    });

    describe('validate', () => {
        it('calls a custom validator with value, allValues, props', async () => {
            let validator = jest.fn();
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} mode="onChange">
                        <Input
                            defaultValue="A title"
                            source="title"
                            resource="posts"
                            validate={validator}
                        >
                            {props => (
                                <input
                                    type="text"
                                    onChange={props.field.onChange}
                                    data-testid="title-input"
                                />
                            )}
                        </Input>
                        <Input
                            defaultValue="A description"
                            source="description"
                            resource="posts"
                        >
                            {() => <div />}
                        </Input>
                    </Form>
                </CoreAdminContext>
            );

            fireEvent.change(await screen.findByTestId('title-input'), {
                target: { value: 'A new title' },
            });
            await waitFor(() => {
                expect(validator).toHaveBeenCalledWith(
                    'A new title',
                    { title: 'A new title', description: 'A description' },
                    expect.objectContaining({
                        defaultValue: 'A title',
                        source: 'title',
                        finalSource: 'title',
                        resource: 'posts',
                    })
                );
            });
        });

        it('calls a custom validator with the final source in respect to the SourceContext', async () => {
            let validator = jest.fn();
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} mode="onChange">
                        <SourceContextProvider
                            value={{
                                getSource: source => `posts.0.${source}`,
                                getLabel: label => label,
                            }}
                        >
                            <Input
                                defaultValue="A title"
                                source="title"
                                resource="posts"
                                validate={validator}
                            >
                                {props => (
                                    <input
                                        type="text"
                                        onChange={props.field.onChange}
                                        data-testid="title-input"
                                    />
                                )}
                            </Input>
                        </SourceContextProvider>
                    </Form>
                </CoreAdminContext>
            );

            fireEvent.change(await screen.findByTestId('title-input'), {
                target: { value: 'A new title' },
            });
            await waitFor(() => {
                expect(validator).toHaveBeenCalledWith(
                    'A new title',
                    { posts: [{ title: 'A new title' }] },
                    expect.objectContaining({
                        defaultValue: 'A title',
                        source: 'title',
                        finalSource: 'posts.0.title',
                        resource: 'posts',
                    })
                );
            });
        });

        it('should validate and be dirty for inputs that were disabled and re-enabled', async () => {
            let inputProps: UseInputValue | undefined;

            const DisabledEnableInput = () => {
                const [disabled, setDisabled] = React.useState(false);

                return (
                    <>
                        <button
                            type="button"
                            onClick={() => setDisabled(disabled => !disabled)}
                        >
                            Toggle
                        </button>
                        <Input
                            source="title"
                            resource="posts"
                            validate={required()}
                            disabled={disabled}
                        >
                            {props => {
                                inputProps = props; // Capture the latest props
                                return (
                                    <input
                                        type="text"
                                        id={props.id}
                                        aria-label="Title"
                                        {...props.field}
                                    />
                                );
                            }}
                        </Input>
                    </>
                );
            };

            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form onSubmit={jest.fn()} mode="onChange">
                        <DisabledEnableInput />
                    </Form>
                </CoreAdminContext>
            );

            // Initial state assertions
            expect(inputProps?.fieldState.isDirty).toBe(false);
            expect(inputProps?.field.disabled).toBe(false);

            // Disable the input
            fireEvent.click(screen.getByText('Toggle'));

            await waitFor(() => {
                expect(inputProps?.fieldState.isDirty).toBe(false);
                expect(inputProps?.field.disabled).toBe(true);
            });

            // Re-enable the input
            fireEvent.click(screen.getByText('Toggle'));

            await waitFor(() => {
                expect(inputProps?.fieldState.isDirty).toBe(false);
                expect(inputProps?.field.disabled).toBe(false);
            });

            // Type in the input
            fireEvent.change(screen.getByLabelText('Title'), {
                target: { value: 'A title' },
            });

            // Assert that the field is now dirty
            await waitFor(() => {
                expect(inputProps?.fieldState.isDirty).toBe(true); // Now the input should be dirty
                expect(inputProps?.field.value).toBe('A title');
            });

            // Clear the input
            fireEvent.change(screen.getByLabelText('Title'), {
                target: { value: '' },
            });

            // Assert that the field is now dirty and invalid because it is required
            await waitFor(() => {
                expect(inputProps?.fieldState.isDirty).toBe(true); // Now the input should be dirty
                expect(inputProps?.field.value).toBe('');
                expect(inputProps?.fieldState.invalid).toBe(true);
            });
        });
    });
});
