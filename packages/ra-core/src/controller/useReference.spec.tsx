import * as React from 'react';
import expect from 'expect';

import { renderWithRedux } from 'ra-test';
import useReference from './useReference';
import { DataProviderContext } from '../dataProvider';

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

    it('should fetch reference on mount', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
        expect(dispatch.mock.calls[0][0].type).toBe('RA/CRUD_GET_MANY');
    });

    it('should not refetch reference on update', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
    });

    it('should refetch reference when id changes', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} id={2} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(10);
    });

    it('should refetch reference when reference prop changes', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} reference="comments" />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(10);
    });

    it('it should not refetch reference when other props change', async () => {
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        const { dispatch, rerender } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        rerender(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} className="foobar" />
            </DataProviderContext.Provider>
        );
        await new Promise(resolve => setTimeout(resolve));
        expect(dispatch).toBeCalledTimes(5);
    });

    it('should retrieve referenceRecord from redux state', () => {
        const hookValue = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };

        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} callback={hookValue} />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: { data: { 1: { id: 1 }, 2: { id: 2 } } },
                    },
                },
            }
        );

        expect(hookValue.mock.calls[0][0]).toEqual({
            referenceRecord: { id: 1 },
            loading: true,
            loaded: true,
            error: null,
            refetch: expect.any(Function),
        });
    });

    it('should set loading to true if no referenceRecord yet', () => {
        const hookValue = jest.fn();
        const dataProvider = {
            getMany: jest.fn(() =>
                Promise.resolve({ data: [{ id: 1, title: 'foo' }] })
            ),
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <UseReference {...defaultProps} callback={hookValue} />
            </DataProviderContext.Provider>,
            {
                admin: {
                    resources: {
                        posts: { data: {} },
                    },
                },
            }
        );

        expect(hookValue.mock.calls[0][0]).toEqual({
            referenceRecord: undefined,
            loading: true,
            loaded: false,
            error: null,
            refetch: expect.any(Function),
        });
    });
});
