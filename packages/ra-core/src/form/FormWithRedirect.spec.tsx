import * as React from 'react';

import { renderWithRedux } from 'ra-test';
import FormWithRedirect from './FormWithRedirect';
import useInput from './useInput';
import { waitFor } from '@testing-library/dom';

describe('FormWithRedirect', () => {
    const Input = props => {
        const { input } = useInput(props);

        return <input type="text" {...input} />;
    };

    it('Does not make the form dirty when reinitialized from a record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" initialValue="Bar" />
        ));
        const { getByDisplayValue, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[0][0].pristine).toEqual(true);
        expect(getByDisplayValue('Bar')).not.toBeNull();

        rerender(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                render={renderProp}
                record={{ id: 1, name: 'Foo' }}
            />
        );

        expect(renderProp.mock.calls[1][0].pristine).toEqual(true);
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Does not make the form dirty when initialized from a record with a missing field and this field has an initialValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" initialValue="Bar" />
        ));
        const { getByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                render={renderProp}
                record={{ id: 1 }}
            />
        );

        expect(renderProp.mock.calls[0][0].pristine).toEqual(true);
        expect(getByDisplayValue('Bar')).not.toBeNull();
        expect(renderProp).toHaveBeenCalledTimes(1);
    });

    it('Makes the form dirty when initialized from a record with a missing field and this field has a defaultValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        const { getByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                render={renderProp}
                record={{ id: 1 }}
            />
        );

        expect(renderProp.mock.calls[1][0].pristine).toEqual(false);
        expect(getByDisplayValue('Bar')).not.toBeNull();
        // 4 times because the first initialization with an empty value
        // triggers a change on the input which has a defaultValue
        // This is expected and identical to what FinalForm does (https://final-form.org/docs/final-form/types/FieldConfig#defaultvalue)
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Does not make the form dirty when reinitialized from a different record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        const { getByDisplayValue, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{ id: 1, name: 'Foo' }}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[0][0].pristine).toEqual(true);
        expect(getByDisplayValue('Foo')).not.toBeNull();

        rerender(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{ id: 1, name: 'Foo', anotherServerAddedProp: 'Bar' }}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[1][0].pristine).toEqual(true);
        expect(getByDisplayValue('Foo')).not.toBeNull();
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Makes the form dirty when reinitialized from a different record with a missing field and this field has a defaultValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        const { getByDisplayValue, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{ id: 1, name: 'Foo' }}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[0][0].pristine).toEqual(true);
        expect(getByDisplayValue('Foo')).not.toBeNull();

        rerender(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{
                    id: 2,
                    name: undefined,
                    anotherServerAddedProp: 'Bazinga',
                }}
                render={renderProp}
            />
        );

        expect(renderProp).toHaveBeenCalledTimes(3);
        expect(renderProp.mock.calls[2][0].pristine).toEqual(false);
        expect(getByDisplayValue('Bar')).not.toBeNull();
    });

    it('Does not make the form dirty when reinitialized from a different record with a missing field and this field has an initialValue', async () => {
        const renderProp = jest.fn(() => (
            <Input source="name" initialValue="Bar" />
        ));
        const { getByDisplayValue, rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{ id: 1, name: 'Foo' }}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[0][0].pristine).toEqual(true);
        expect(getByDisplayValue('Foo')).not.toBeNull();

        rerender(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{
                    id: 2,
                    name: undefined,
                    anotherServerAddedProp: 'Bazinga',
                }}
                render={renderProp}
            />
        );

        await waitFor(() => {
            expect(getByDisplayValue('Bar')).not.toBeNull();
        });
        expect(
            renderProp.mock.calls[renderProp.mock.calls.length - 1][0].pristine
        ).toEqual(true);
    });
});
