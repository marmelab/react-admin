import * as React from 'react';
import { cleanup } from '@testing-library/react';

import { renderWithRedux } from '../util';
import FormWithRedirect from './FormWithRedirect';
import useInput from './useInput';

describe('FormWithRedirect', () => {
    afterEach(cleanup);
    const Input = props => {
        const { input } = useInput(props);

        return <input type="text" {...input} />;
    };

    it('Does not make the form dirty when reinitialized from a record', () => {
        const renderProp = jest.fn(() => (
            <Input source="name" defaultValue="Bar" />
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
        expect(getByDisplayValue('Foo')).not.toBeNull();
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
});
