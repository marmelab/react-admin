import * as React from 'react';
import { render } from '@testing-library/react';
import expect from 'expect';
import { MutationMode } from 'ra-core';

import { Button } from './Button';
import { AdminContext } from '../AdminContext';

const invalidButtonDomProps = {
    invalid: false,
    pristine: false,
    record: { id: 123, foo: 'bar' },
    resource: 'posts',
    saving: false,
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<Button />', () => {
    it('should render as submit type with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <AdminContext>
                <Button label="button" {...invalidButtonDomProps} />
            </AdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('button').getAttribute('type')).toEqual('button');

        spy.mockRestore();
    });
});
