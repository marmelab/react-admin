import * as React from 'react';
import { screen, waitFor } from '@testing-library/dom';
import { renderWithRedux } from 'ra-test';

import FormWithRedirect from './FormWithRedirect';
import { useInput } from './useInput';

describe('FormWithRedirect', () => {
    const Input = props => {
        const { input } = useInput(props);

        return <input type="text" {...input} />;
    };

    it('Does not make the form dirty when reinitialized from a record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));

        const { rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[0][0].isDirty).toEqual(false);
        expect(screen.getByDisplayValue('Bar')).not.toBeNull();

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

        expect(renderProp).toHaveBeenCalledTimes(3);
        expect(
            renderProp.mock.calls[renderProp.mock.calls.length - 1][0].isDirty
        ).toEqual(false);
        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
    });

    it('Does not make the form dirty when initialized from a record with a missing field and this field has an defaultValue', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                render={renderProp}
                record={{ id: 1 }}
            />
        );

        expect(renderProp.mock.calls[0][0].isDirty).toEqual(false);
        expect(
            renderProp.mock.calls[renderProp.mock.calls.length - 1][0].isDirty
        ).toEqual(false);
        expect(screen.getByDisplayValue('Bar')).not.toBeNull();
        expect(renderProp).toHaveBeenCalledTimes(2);
    });

    it('Does not make the form dirty when reinitialized from a different record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
        ));
        const { rerender } = renderWithRedux(
            <FormWithRedirect
                save={jest.fn()}
                redirect={false}
                saving={false}
                version={0}
                record={{ id: 1, name: 'Foo' }}
                render={renderProp}
            />
        );

        expect(renderProp.mock.calls[0][0].isDirty).toEqual(false);
        expect(screen.getByDisplayValue('Foo')).not.toBeNull();

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

        expect(renderProp.mock.calls[1][0].isDirty).toEqual(false);
        expect(
            renderProp.mock.calls[renderProp.mock.calls.length - 1][0].isDirty
        ).toEqual(false);
        expect(screen.getByDisplayValue('Foo')).not.toBeNull();
        expect(renderProp).toHaveBeenCalledTimes(4);
    });
});
