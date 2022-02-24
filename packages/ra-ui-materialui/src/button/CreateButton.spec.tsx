import * as React from 'react';
import { render } from '@testing-library/react';
import expect from 'expect';
import { MutationMode } from 'ra-core';

import { AdminContext } from '../AdminContext';
import CreateButton from './CreateButton';

const invalidButtonDomProps = {
    invalid: false,
    pristine: false,
    record: { id: 123, foo: 'bar' },
    redirect: 'list',
    resource: 'posts',
    saving: false,
    submitOnEnter: true,
    mutationMode: 'pessimistic' as MutationMode,
};

describe('<CreateButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const { getByLabelText } = render(
            <AdminContext>
                <CreateButton {...invalidButtonDomProps} />
            </AdminContext>
        );

        expect(spy).not.toHaveBeenCalled();
        expect(getByLabelText('ra.action.create').tagName).toEqual('A');

        spy.mockRestore();
    });
});
