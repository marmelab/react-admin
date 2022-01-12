import * as React from 'react';
import { screen, render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../core';
import { testDataProvider } from '../dataProvider';
import { FormWithRedirect } from './FormWithRedirect';
import useInput from './useInput';

describe('FormWithRedirect', () => {
    const Input = props => {
        const { input } = useInput(props);

        return <input type="text" {...input} />;
    };

    it('Does not make the form dirty when reinitialized from a record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" initialValue="Bar" />
        ));
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    render={renderProp}
                    record={{ id: 1, name: 'Foo' }}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Does not make the form dirty when initialized from a record with a missing field and this field has an initialValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" initialValue="Bar" />
        ));
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    render={renderProp}
                    record={{ id: 1 }}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );
        expect(renderProp).toHaveBeenCalledTimes(1);
    });

    it('Makes the form dirty when initialized from a record with a missing field and this field has a defaultValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    render={renderProp}
                    record={{ id: 1 }}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: false })
        );
        // twice because the first initialization with an empty value
        // triggers a change on the input which has a defaultValue
        // This is expected and identical to what FinalForm does (https://final-form.org/docs/final-form/types/FieldConfig#defaultvalue)
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Does not make the form dirty when reinitialized from a different record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    record={{ id: 1, name: 'Foo' }}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
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
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Makes the form dirty when reinitialized from a different record with a missing field and this field has a defaultValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    record={{ id: 1, name: 'Foo' }}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    record={{
                        id: 2,
                        name: undefined,
                        anotherServerAddedProp: 'Bazinga',
                    }}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: false })
        );
        expect(renderProp).toHaveBeenCalledTimes(3);
    });

    it('Does not make the form dirty when reinitialized from a different record with a missing field and this field has an initialValue', async () => {
        const renderProp = jest.fn(() => (
            <Input source="name" initialValue="Bar" />
        ));
        const { rerender } = render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    record={{ id: 1, name: 'Foo' }}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(renderProp).toHaveBeenLastCalledWith(
            expect.objectContaining({ pristine: true })
        );

        rerender(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <FormWithRedirect
                    save={jest.fn()}
                    redirect={false}
                    saving={false}
                    record={{
                        id: 2,
                        name: undefined,
                        anotherServerAddedProp: 'Bazinga',
                    }}
                    render={renderProp}
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        });
        expect(
            renderProp.mock.calls[renderProp.mock.calls.length - 1][0].pristine
        ).toEqual(true);
    });
});
