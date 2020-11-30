import * as React from 'react';
import { useEffect } from 'react';
import { cleanup } from '@testing-library/react';
import { CreateBase } from './CreateBase';
import { useSaveContext } from './SaveContext';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';
import { renderWithRedux } from '../../util';

describe('CreateBase', () => {
    afterEach(cleanup);

    const defaultProps = {
        basePath: '',
        hasCreate: true,
        hasEdit: true,
        hasList: true,
        hasShow: true,
        id: 12,
        resource: 'posts',
        debounce: 200,
    };

    it('should give access to the current onSuccess function', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.onSuccess('test');
            }, []);

            return null;
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateBase
                    {...defaultProps}
                    undoable={false}
                    onSuccess={onSuccess}
                >
                    <Child />
                </CreateBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        expect(onSuccess).toHaveBeenCalledWith('test');
    });

    it('should give access to the current onFailure function', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.onFailure({ message: 'test' });
            }, []);

            return null;
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateBase
                    {...defaultProps}
                    undoable={false}
                    onFailure={onFailure}
                >
                    <Child />
                </CreateBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        expect(onFailure).toHaveBeenCalledWith({ message: 'test' });
    });

    it('should give access to the current transform function', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const transform = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.transform({ message: 'test' });
            }, []);

            return null;
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <CreateBase
                    {...defaultProps}
                    undoable={false}
                    transform={transform}
                >
                    <Child />
                </CreateBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        expect(transform).toHaveBeenCalledWith({ message: 'test' });
    });
});
