import * as React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { CoreAdminContext } from '../core';
import { testDataProvider } from '../dataProvider';
import { Form } from './Form';
import { useNotificationContext } from '../notification';
import { useInput } from './useInput';
import { required } from './validate';

describe('Form', () => {
    const Input = props => {
        const { field, fieldState } = useInput(props);
        return (
            <>
                <input
                    aria-label="name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    {...field}
                />
                <p>{fieldState.error?.message}</p>
            </>
        );
    };

    const IsDirty = () => {
        const state = useFormState();

        return <p>isDirty: {state.isDirty.toString()}</p>;
    };

    it('Does not make the form dirty when reinitialized from a record', () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()}>
                    <Input source="name" defaultValue="Bar" />
                    <IsDirty />
                </Form>
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1, name: 'Foo' }}>
                    <Input source="name" defaultValue="Bar" />
                    <IsDirty />
                </Form>
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();
    });

    it('Does not make the form dirty when initialized from a record with a missing field and this field has an defaultValue', () => {
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1 }}>
                    <Input source="name" defaultValue="Bar" />
                    <IsDirty />
                </Form>
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();
    });

    it('Does not make the form dirty when reinitialized from a different record', () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={jest.fn()} record={{ id: 1, name: 'Foo' }}>
                    <Input source="name" defaultValue="Bar" />
                    <IsDirty />
                </Form>
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form
                    onSubmit={jest.fn()}
                    record={{
                        id: 1,
                        name: 'Foo',
                        anotherServerAddedProp: 'Bar',
                    }}
                >
                    <Input source="name" defaultValue="Bar" />
                    <IsDirty />
                </Form>
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();
    });

    it('Displays a notification on submit when invalid', async () => {
        const Notification = () => {
            const { notifications } = useNotificationContext();
            return notifications.length > 0 ? (
                <div>{notifications[0].message}</div>
            ) : null;
        };

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <>
                    <Form onSubmit={jest.fn()}>
                        <Input source="name" validate={required()} />
                        <button type="submit">Submit</button>
                    </Form>
                    <Notification />
                </>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            screen.getByText('ra.message.invalid_form');
        });
    });

    it('Displays submission errors', async () => {
        const Notification = () => {
            const { notifications } = useNotificationContext();
            return notifications.length > 0 ? (
                <div>{notifications[0].message}</div>
            ) : null;
        };

        const onSubmit = jest.fn(() =>
            Promise.resolve({
                name: 'This name is already taken',
            })
        );

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <>
                    <Form onSubmit={onSubmit}>
                        <Input source="name" />
                        <button type="submit">Submit</button>
                    </Form>
                    <Notification />
                </>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            screen.getByText('This name is already taken');
        });
    });

    it('should set null or undefined values to null', async () => {
        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo"
                        parse={() => null}
                        format={() => '23'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: null });
        });
    });

    it('should set null or undefined deep values to null', async () => {
        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo.bar"
                        parse={() => null}
                        format={() => '23'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: { bar: null } });
        });
    });

    it('should accept string values', async () => {
        const str = 'hello';
        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input source="foo" parse={() => str} format={() => str} />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: str });
        });
    });
    it('should accept date values', async () => {
        const date = new Date();

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo"
                        parse={() => date}
                        format={() => 'date'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: date });
        });
    });

    it('should accept array values', async () => {
        const arr = [1, 2, 3];

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo"
                        parse={() => arr}
                        format={() => 'arr'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: arr });
        });
    });

    it('should accept object values', async () => {
        const obj = { foo: 1 };

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo"
                        parse={() => obj}
                        format={() => 'obj'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: obj });
        });
    });
    it('should accept deep object values', async () => {
        const obj = { foo: { bar: 1 } };

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo"
                        parse={() => obj}
                        format={() => 'obj'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: obj });
        });
    });
    it('should accept object values in arrays', async () => {
        const obj = [{ foo: 1 }, { foo: 2 }];

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit}>
                    <Input
                        source="foo"
                        parse={() => obj}
                        format={() => 'obj'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: obj });
        });
    });
    it('should accept adding objects in arrays', async () => {
        const obj = [{ foo: 1, foo2: 2 }, { foo: 3 }, { foo: 4 }];

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form
                    defaultValues={{ foo: [{ foo: 1 }, { foo: 4 }] }}
                    onSubmit={onSubmit}
                >
                    <Input
                        source="foo"
                        parse={() => obj}
                        format={() => 'obj'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: obj });
        });
    });
    it('should accept removing objects in array of objects', async () => {
        const obj = [{ foo: 1 }, { foo: 4 }];

        const onSubmit = jest.fn();
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form
                    defaultValues={{
                        foo: [{ foo: 1, foo2: 2 }, { foo: 3 }, { foo: 4 }],
                    }}
                    onSubmit={onSubmit}
                >
                    <Input
                        source="foo"
                        parse={() => obj}
                        format={() => 'obj'}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.change(screen.getByLabelText('name'), {
            target: { value: '' },
        });
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({ foo: obj });
        });
    });
    describe('defaultValues', () => {
        it('should use defaultValues when the record has no value for the field', () => {
            render(
                <CoreAdminContext>
                    <Form defaultValues={{ foo: 'bar' }} record={{ id: 1 }}>
                        <Input source="foo" />
                    </Form>
                </CoreAdminContext>
            );
            expect(
                (screen.getByLabelText('name') as HTMLInputElement).value
            ).toBe('bar');
        });
        it('should not use defaultValues when the record has a value for the field', () => {
            render(
                <CoreAdminContext>
                    <Form
                        defaultValues={{ foo: 'bar' }}
                        record={{ id: 1, foo: 'hello' }}
                    >
                        <Input source="foo" />
                    </Form>
                </CoreAdminContext>
            );
            expect(
                (screen.getByLabelText('name') as HTMLInputElement).value
            ).toBe('hello');
        });
        it('should accept a function as defaultValues', () => {
            render(
                <CoreAdminContext>
                    <Form
                        defaultValues={() => ({ foo: 'bar' })}
                        record={{ id: 1 }}
                    >
                        <Input source="foo" />
                    </Form>
                </CoreAdminContext>
            );
            expect(
                (screen.getByLabelText('name') as HTMLInputElement).value
            ).toBe('bar');
        });
        it("should not ignore defaultValues when it's not of the same type", async () => {
            const defaultValues = { foo: 'foobar' };
            const values = { foo: { hello: 'world' } };

            const onSubmit = jest.fn();
            render(
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
                        <Input
                            source="foo"
                            parse={() => values.foo}
                            format={() => 'obj'}
                        />
                        <button type="submit">Submit</button>
                    </Form>
                </CoreAdminContext>
            );

            fireEvent.change(screen.getByLabelText('name'), {
                target: { value: '' },
            });
            fireEvent.click(screen.getByText('Submit'));

            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(values);
            });
        });
    });

    it('should accept react-hook-form resolvers', async () => {
        const onSubmit = jest.fn();
        const schema = yup
            .object({
                title: yup.string().required(),
                number: yup.number().positive().integer().required(),
            })
            .required();

        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Form onSubmit={onSubmit} resolver={yupResolver(schema)}>
                    <Input source="title" />
                    <Input
                        source="number"
                        aria-label="Number"
                        defaultValue={-10}
                    />
                    <button type="submit">Submit</button>
                </Form>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            screen.getByText('title is a required field');
        });
        screen.getByText('number must be a positive number');
    });
});
