import * as React from 'react';
import expect from 'expect';
import { useEffect } from 'react';
import { screen, render, cleanup } from '@testing-library/react';

import { CreateBase } from './CreateBase';
import { useSaveContext } from '../SaveContext';
import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';

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
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        });
        const onSuccess = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.onSuccessRef.current('test');
            }, [saveContext.onSuccessRef]);

            return null;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} mutationOptions={{ onSuccess }}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );
        expect(onSuccess).toHaveBeenCalledWith('test');
    });

    it('should allow to override the onSuccess function', () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        });
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
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} mutationOptions={{ onSuccess }}>
                    <>
                        <SetOnSuccess />
                        <Child />
                    </>
                </CreateBase>
            </CoreAdminContext>
        );

        getByLabelText('save').click();

        expect(onSuccessOverride).toHaveBeenCalledWith('test');
    });

    it('should give access to the current onError function', () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        });
        const onError = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.onFailureRef.current({ message: 'test' });
            }, [saveContext.onFailureRef]);

            return null;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} mutationOptions={{ onError }}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );

        expect(onError).toHaveBeenCalledWith({ message: 'test' });
    });

    it('should allow to override the onFailure function', () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        });
        const onError = jest.fn();
        const onErrorOverride = jest.fn();

        const SetOnSuccess = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.setOnFailure(onErrorOverride);
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
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} mutationOptions={{ onError }}>
                    <>
                        <SetOnSuccess />
                        <Child />
                    </>
                </CreateBase>
            </CoreAdminContext>
        );

        screen.getByLabelText('save').click();

        expect(onErrorOverride).toHaveBeenCalledWith({ message: 'test' });
    });

    it('should give access to the current transform function', () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        });
        const transform = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.transformRef.current({ message: 'test' });
            }, [saveContext.transformRef]);

            return null;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} transform={transform}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );

        expect(transform).toHaveBeenCalledWith({ message: 'test' });
    });

    it('should allow to override the transform function', () => {
        const dataProvider = testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 12 } } as any),
            update: (_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } }),
        });
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
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} transform={transform}>
                    <>
                        <SetOnSuccess />
                        <Child />
                    </>
                </CreateBase>
            </CoreAdminContext>
        );

        screen.getByLabelText('save').click();

        expect(transformOverride).toHaveBeenCalledWith('test');
    });
});
