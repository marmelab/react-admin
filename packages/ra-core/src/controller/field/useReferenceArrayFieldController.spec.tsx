import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { useReferenceArrayFieldController } from './useReferenceArrayFieldController';
import { testDataProvider } from '../../dataProvider';
import { CoreAdminContext } from '../../core';

const ReferenceArrayFieldController = props => {
    const { children, ...rest } = props;
    const controllerProps = useReferenceArrayFieldController({
        sort: {
            field: 'id',
            order: 'ASC',
        },
        ...rest,
    });
    return children(controllerProps);
};

describe('<useReferenceArrayFieldController />', () => {
    const dataProvider = testDataProvider({
        getMany: jest.fn().mockResolvedValue({
            data: [
                { id: 1, title: 'bar1' },
                { id: 2, title: 'bar2' },
            ],
        }),
    });

    afterEach(async () => {
        // @ts-ignore
        dataProvider.getMany.mockClear();
        // wait for the getManyAggregate batch to resolve
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));
    });

    it('should set the isLoading prop to true when related records are not yet fetched', () => {
        const children = jest.fn().mockReturnValue('child');
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2] }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: true,
                isLoading: true,
                data: undefined,
                error: null,
            })
        );
    });

    it('should call dataProvider.getMAny on mount and return the result in the data prop', async () => {
        const children = jest.fn().mockReturnValue('child');
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2] }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [
                    { id: 1, title: 'bar1' },
                    { id: 2, title: 'bar2' },
                ],
                error: null,
            })
        );
    });

    it('should filter string data based on the filter props', async () => {
        const children = jest.fn().mockReturnValue('child');
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2] }}
                    filter={{ title: 'bar1' }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [{ id: 1, title: 'bar1' }],
                error: null,
            })
        );
    });

    it('should filter array data based on the filter props', async () => {
        const children = jest.fn().mockReturnValue('child');
        const dataProvider = testDataProvider({
            getMany: jest.fn().mockResolvedValue({
                data: [
                    { id: 1, items: ['one', 'two'] },
                    { id: 2, items: ['three'] },
                    { id: 3, items: 'four' },
                    { id: 4, items: ['five'] },
                ],
            }),
        });
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <ReferenceArrayFieldController
                    resource="foo"
                    reference="bar"
                    record={{ id: 1, barIds: [1, 2, 3, 4] }}
                    filter={{ items: ['two', 'four', 'five'] }}
                    source="barIds"
                >
                    {children}
                </ReferenceArrayFieldController>
            </CoreAdminContext>
        );
        await waitFor(() =>
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1)
        );
        expect(children).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: { field: 'id', order: 'ASC' },
                isFetching: false,
                isLoading: false,
                data: [
                    { id: 1, items: ['one', 'two'] },
                    { id: 3, items: 'four' },
                    { id: 4, items: ['five'] },
                ],
                error: null,
            })
        );
    });
});
