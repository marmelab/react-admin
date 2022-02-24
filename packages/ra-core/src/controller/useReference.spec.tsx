import * as React from 'react';
import expect from 'expect';
import { render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../core';
import { useReference } from './useReference';
import { testDataProvider, useGetMany } from '../dataProvider';

const UseReference = ({ callback = null, ...rest }) => {
    const hookValue = useReference(rest as any);
    if (callback) callback(hookValue);
    return <div>hello</div>;
};

describe('useReference', () => {
    const defaultProps = {
        id: '1',
        reference: 'posts',
    };

    let dataProvider;

    beforeEach(() => {
        dataProvider = testDataProvider({
            getMany: jest
                .fn()
                .mockResolvedValue({ data: [{ id: 1, title: 'foo' }] }),
        });
    });

    it('should fetch reference on mount', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: ['1'],
            });
        });
    });

    it('should not refetch reference on update', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
    });

    it('should refetch reference when id changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} id={2} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
    });

    it('should refetch reference when reference prop changes', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} reference="comments" />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
        });
    });

    it('it should not refetch reference when other props change', async () => {
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} className="bar" />
            </CoreAdminContext>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
    });

    it('should retrieve referenceRecord from dataProvider state', async () => {
        const hookValue = jest.fn();
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} callback={hookValue} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(hookValue).toHaveBeenCalledTimes(2);
        });
        expect(hookValue.mock.calls[0][0]).toEqual({
            referenceRecord: undefined,
            isFetching: true,
            isLoading: true,
            error: null,
            refetch: expect.any(Function),
        });
        expect(hookValue.mock.calls[1][0]).toEqual({
            referenceRecord: { id: 1, title: 'foo' },
            isFetching: false,
            isLoading: false,
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should retrieve referenceRecord from query cache', async () => {
        const FecthGetMany = () => {
            useGetMany('posts', { ids: ['1'] });
            return <span>dummy</span>;
        };
        const hookValue = jest.fn();
        const { rerender } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <FecthGetMany />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
        });
        rerender(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} callback={hookValue} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(hookValue).toHaveBeenCalledTimes(2);
        });
        expect(hookValue.mock.calls[0][0]).toEqual({
            referenceRecord: { id: 1, title: 'foo' },
            isFetching: true,
            isLoading: false,
            error: null,
            refetch: expect.any(Function),
        });
        expect(hookValue.mock.calls[1][0]).toEqual({
            referenceRecord: { id: 1, title: 'foo' },
            isFetching: false,
            isLoading: false,
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should aggregate multiple calls for the same resource into one', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} id={1} />
                <UseReference {...defaultProps} id={2} />
                <UseReference {...defaultProps} id={3} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2, 3],
            });
        });
    });

    it('should not aggregate multiple calls for the different resources', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} id={1} />
                <UseReference {...defaultProps} id={2} />
                <UseReference {...defaultProps} id={3} reference="comments" />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(2);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2],
            });
            expect(dataProvider.getMany).toHaveBeenCalledWith('comments', {
                ids: [3],
            });
        });
    });

    it('should deduplicated repeated ids', async () => {
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <UseReference {...defaultProps} id={1} />
                <UseReference {...defaultProps} id={1} />
                <UseReference {...defaultProps} id={2} />
            </CoreAdminContext>
        );
        await waitFor(() => {
            expect(dataProvider.getMany).toHaveBeenCalledTimes(1);
            expect(dataProvider.getMany).toHaveBeenCalledWith('posts', {
                ids: [1, 2],
            });
        });
    });
});
