import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { testDataProvider } from '../../dataProvider/testDataProvider';
import { CoreAdminContext } from '../../core';
import { useReferenceOneFieldController } from './useReferenceOneFieldController';

const ReferenceOneFieldController = props => {
    const { children, page = 1, perPage = 1, ...rest } = props;
    const controllerProps = useReferenceOneFieldController({
        page,
        perPage,
        ...rest,
    });
    return children(controllerProps);
};

describe('useReferenceOneFieldController', () => {
    it('should set isLoading to true when the related record is not yet fetched', async () => {
        const ComponentToTest = ({ isLoading }: { isLoading?: boolean }) => {
            return <div>isLoading: {isLoading.toString()}</div>;
        };
        const dataProvider = testDataProvider({
            getManyReference: () => Promise.resolve({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceOneFieldController
                    record={{ id: 123 }}
                    source="id"
                    reference="bios"
                    target="author_id"
                >
                    {props => <ComponentToTest {...props} />}
                </ReferenceOneFieldController>
            </CoreAdminContext>
        );

        expect(screen.queryByText('isLoading: true')).not.toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('isLoading: false')).not.toBeNull();
        });
    });

    it('should set isLoading to false when related records have been fetched and there are results', async () => {
        const ComponentToTest = ({ isLoading }: { isLoading?: boolean }) => {
            return <div>isLoading: {isLoading.toString()}</div>;
        };
        const dataProvider = testDataProvider({
            getManyReference: () =>
                Promise.resolve({
                    data: [{ id: 1, title: 'hello' }],
                    total: 1,
                }) as any,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceOneFieldController
                    record={{ id: 123 }}
                    source="id"
                    reference="bios"
                    target="author_id"
                >
                    {props => <ComponentToTest {...props} />}
                </ReferenceOneFieldController>
            </CoreAdminContext>
        );

        expect(screen.queryByText('isLoading: true')).not.toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('isLoading: false')).not.toBeNull();
        });
    });

    it('should call dataProvider.getManyReferences on mount', async () => {
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceOneFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    reference="bios"
                    target="author_id"
                    sort={{ field: 'name', order: 'DESC' }}
                    filter={{ gender: 'female' }}
                >
                    {() => 'null'}
                </ReferenceOneFieldController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getManyReference).toHaveBeenCalledWith('bios', {
                target: 'author_id',
                id: 123,
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'name', order: 'DESC' },
                filter: { gender: 'female' },
                signal: undefined,
            });
        });
    });

    it('should pass referenceRecord to children function', async () => {
        const children = jest.fn().mockReturnValue('children');
        const dataProvider = testDataProvider({
            getManyReference: () =>
                Promise.resolve({
                    data: [{ id: 1, title: 'hello' }],
                    total: 1,
                }) as any,
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceOneFieldController
                    resource="authors"
                    source="id"
                    record={{ id: 123, name: 'James Joyce' }}
                    reference="books"
                    target="author_id"
                >
                    {children}
                </ReferenceOneFieldController>
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(children).toHaveBeenCalledWith(
                expect.objectContaining({
                    referenceRecord: { id: 1, title: 'hello' },
                })
            );
        });
    });

    it('should support custom source', async () => {
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });

        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceOneFieldController
                    resource="authors"
                    source="uniqueName"
                    record={{
                        id: 123,
                        uniqueName: 'jamesjoyce256',
                        name: 'James Joyce',
                    }}
                    reference="books"
                    target="author_id"
                >
                    {() => 'null'}
                </ReferenceOneFieldController>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.getManyReference).toHaveBeenCalledWith(
                'books',
                {
                    id: 'jamesjoyce256',
                    target: 'author_id',
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                    signal: undefined,
                }
            );
        });
    });

    it('should call crudGetManyReference when its props changes', async () => {
        const dataProvider = testDataProvider({
            getManyReference: jest
                .fn()
                .mockResolvedValue({ data: [], total: 0 }),
        });
        const ControllerWrapper = ({ record }) => (
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceOneFieldController
                    resource="authors"
                    source="id"
                    record={record}
                    reference="books"
                    target="author_id"
                >
                    {() => 'null'}
                </ReferenceOneFieldController>
            </CoreAdminContext>
        );

        const { rerender } = render(
            <ControllerWrapper record={{ id: 123, name: 'James Joyce' }} />
        );
        expect(dataProvider.getManyReference).toBeCalledTimes(1);
        rerender(
            <ControllerWrapper record={{ id: 456, name: 'Marcel Proust' }} />
        );
        await waitFor(() => {
            expect(dataProvider.getManyReference).toBeCalledTimes(2);
            expect(dataProvider.getManyReference).toHaveBeenCalledWith(
                'books',
                {
                    id: 456,
                    target: 'author_id',
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                    signal: undefined,
                }
            );
        });
    });
});
