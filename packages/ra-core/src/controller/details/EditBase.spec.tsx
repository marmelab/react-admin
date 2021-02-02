import * as React from 'react';
import { useEffect } from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { EditBase } from './EditBase';
import { useSaveContext } from './SaveContext';
import { DataProviderContext } from '../../dataProvider';
import { DataProvider } from '../../types';
import { renderWithRedux } from 'ra-test';

describe('EditBase', () => {
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
                saveContext.onSuccessRef.current('test');
            }, [saveContext.onSuccessRef]);

            return null;
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditBase
                    {...defaultProps}
                    undoable={false}
                    onSuccess={onSuccess}
                >
                    <Child />
                </EditBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        expect(onSuccess).toHaveBeenCalledWith('test');
    });

    it('should allow to override the onSuccess function', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onSuccess = jest.fn();
        const onSuccessOverride = jest.fn();

        const SetOnSuccess = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.setOnSuccess(onSuccessOverride);
            }, [saveContext]);

            return null;
        };
        const Child = () => {
            const saveContext = useSaveContext();

            const handleClick = () => {
                saveContext.onSuccessRef.current('test');
            };

            return <button aria-label="save" onClick={handleClick} />;
        };
        const { getByLabelText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditBase
                    {...defaultProps}
                    undoable={false}
                    onSuccess={onSuccess}
                >
                    <>
                        <SetOnSuccess />
                        <Child />
                    </>
                </EditBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        getByLabelText('save').click();

        expect(onSuccessOverride).toHaveBeenCalledWith('test');
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
                saveContext.onFailureRef.current({ message: 'test' });
            }, [saveContext.onFailureRef]);

            return null;
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditBase
                    {...defaultProps}
                    undoable={false}
                    onFailure={onFailure}
                >
                    <Child />
                </EditBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        expect(onFailure).toHaveBeenCalledWith({ message: 'test' });
    });

    it('should allow to override the onFailure function', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const onFailure = jest.fn();
        const onFailureOverride = jest.fn();

        const SetOnSuccess = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.setOnFailure(onFailureOverride);
            }, [saveContext]);

            return null;
        };
        const Child = () => {
            const saveContext = useSaveContext();

            const handleClick = () => {
                saveContext.onFailureRef.current({ message: 'test' });
            };

            return <button aria-label="save" onClick={handleClick} />;
        };
        const { getByLabelText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditBase
                    {...defaultProps}
                    undoable={false}
                    onFailure={onFailure}
                >
                    <>
                        <SetOnSuccess />
                        <Child />
                    </>
                </EditBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        getByLabelText('save').click();

        expect(onFailureOverride).toHaveBeenCalledWith({ message: 'test' });
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
                saveContext.transformRef.current({ message: 'test' });
            }, [saveContext.transformRef]);

            return null;
        };
        renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditBase
                    {...defaultProps}
                    undoable={false}
                    transform={transform}
                >
                    <Child />
                </EditBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        expect(transform).toHaveBeenCalledWith({ message: 'test' });
    });

    it('should allow to override the transform function', () => {
        const dataProvider = ({
            getOne: () => Promise.resolve({ data: { id: 12 } }),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        } as unknown) as DataProvider;
        const transform = jest.fn();
        const transformOverride = jest.fn();

        const SetOnSuccess = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.setTransform(transformOverride);
            }, [saveContext]);

            return null;
        };
        const Child = () => {
            const saveContext = useSaveContext();

            const handleClick = () => {
                saveContext.transformRef.current('test');
            };

            return <button aria-label="save" onClick={handleClick} />;
        };
        const { getByLabelText } = renderWithRedux(
            <DataProviderContext.Provider value={dataProvider}>
                <EditBase
                    {...defaultProps}
                    undoable={false}
                    transform={transform}
                >
                    <>
                        <SetOnSuccess />
                        <Child />
                    </>
                </EditBase>
            </DataProviderContext.Provider>,
            { admin: { resources: { posts: { data: {} } } } }
        );

        getByLabelText('save').click();

        expect(transformOverride).toHaveBeenCalledWith('test');
    });
});
