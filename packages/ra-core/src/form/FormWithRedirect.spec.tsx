import * as React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { useFormState } from 'react-hook-form';

import { CoreAdminContext } from '../core';
import { testDataProvider } from '../dataProvider';
import { FormWithRedirect } from './FormWithRedirect';
import { useNotificationContext } from '../notification';
import { useInput } from './useInput';
import { required } from './validate';

describe('FormWithRedirect', () => {
    const Input = props => {
        const { field, fieldState } = useInput(props);
        return (
            <input type="text" aria-invalid={fieldState.invalid} {...field} />
        );
    };

    const IsDirty = () => {
        const state = useFormState();

        return <p>isDirty: {state.isDirty.toString()}</p>;
    };

    it('Does not make the form dirty when reinitialized from a record', () => {
        const renderProp = jest.fn(() => (
            <>
                <Input source="name" defaultValue="Bar" />
                <IsDirty />
            </>
        ));
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    saving={false}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    saving={false}
                    render={renderProp}
                    record={{ id: 1, name: 'Foo' }}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();
    });

    it('Does not make the form dirty when initialized from a record with a missing field and this field has an defaultValue', () => {
        const renderProp = jest.fn(() => (
            <>
                <Input source="name" defaultValue="Bar" />
                <IsDirty />
            </>
        ));
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    saving={false}
                    render={renderProp}
                    record={{ id: 1 }}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();
    });

    it('Does not make the form dirty when reinitialized from a different record', () => {
        const renderProp = jest.fn(() => (
            <>
                <Input source="name" defaultValue="Bar" />
                <IsDirty />
            </>
        ));
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    saving={false}
                    record={{ id: 1, name: 'Foo' }}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(screen.getByText('isDirty: false')).not.toBeNull();

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    onSubmit={jest.fn()}
                    saving={false}
                    record={{
                        id: 1,
                        name: 'Foo',
                        anotherServerAddedProp: 'Bar',
                    }}
                    render={renderProp}
                />
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
                    <FormWithRedirect
                        onSubmit={jest.fn()}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Input source="name" validate={required()} />
                                <button type="submit">Submit</button>
                            </form>
                        )}
                    />
                    <Notification />
                </>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            screen.getByText('ra.message.invalid_form');
        });
    });
});
