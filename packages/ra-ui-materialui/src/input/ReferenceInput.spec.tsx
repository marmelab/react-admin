import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { ReferenceInput } from './ReferenceInput';
import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { testDataProvider, useChoicesContext } from 'ra-core';

describe('<ReferenceInput />', () => {
    const defaultProps = {
        reference: 'posts',
        resource: 'comments',
        source: 'post_id',
    };

    it('should pass the correct resource down to child component', async () => {
        const MyComponent = () => {
            const { resource } = useChoicesContext();
            return <div>{resource}</div>;
        };
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceInput {...defaultProps}>
                        <MyComponent />
                    </ReferenceInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByText('posts')).not.toBeNull();
        });
    });

    it('should provide a ChoicesContext with all available choices', async () => {
        const Children = () => {
            const { total } = useChoicesContext();
            return <div aria-label="total">{total}</div>;
        };
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({ data: [{ id: 1 }, { id: 2 }], total: 2 }),
        });
        render(
            <AdminContext dataProvider={dataProvider}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ReferenceInput {...defaultProps}>
                        <Children />
                    </ReferenceInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.getByLabelText('total').innerHTML).toEqual('2');
        });
    });
});
