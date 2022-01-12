import * as React from 'react';
import expect from 'expect';
import { useEffect } from 'react';
import { screen, render, waitFor } from '@testing-library/react';

import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { useSaveContext } from '../saveContext';
import { CreateBase } from './CreateBase';

describe('CreateBase', () => {
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

    it('should give access to the save function', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });

        const Child = () => {
            const saveContext = useSaveContext();

            useEffect(() => {
                saveContext.save({ test: 'test' });
            }, []); // eslint-disable-line

            return null;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('posts', {
                data: { test: 'test' },
            });
        });
    });

    it('should allow to override the onSuccess function', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });
        const onSuccess = jest.fn();
        const onSuccessOverride = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            const handleClick = () => {
                saveContext.save(
                    { test: 'test' },
                    { onSuccess: onSuccessOverride }
                );
            };

            return <button aria-label="save" onClick={handleClick} />;
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} mutationOptions={{ onSuccess }}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );

        getByLabelText('save').click();

        await waitFor(() => {
            expect(onSuccessOverride).toHaveBeenCalledWith(
                {
                    id: 1,
                    test: 'test',
                },
                { data: { test: 'test' }, resource: 'posts' },
                undefined
            );
        });
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should allow to override the onFailure function', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn((_, { data }) =>
                Promise.reject({ message: 'test' })
            ),
        });
        const onError = jest.fn();
        const onErrorOverride = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();

            const handleClick = () => {
                saveContext.save(
                    { test: 'test' },
                    { onFailure: onErrorOverride }
                );
            };

            return <button aria-label="save" onClick={handleClick} />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} mutationOptions={{ onError }}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );

        screen.getByLabelText('save').click();

        await waitFor(() => {
            expect(onErrorOverride).toHaveBeenCalledWith(
                { message: 'test' },
                { data: { test: 'test' }, resource: 'posts' },
                undefined
            );
        });
        expect(onError).not.toHaveBeenCalled();
    });

    it('should allow to override the transform function', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn((_, { data }) =>
                Promise.resolve({ data: { id: 1, ...data } })
            ),
        });
        const transform = jest.fn();
        const transformOverride = jest
            .fn()
            .mockReturnValueOnce({ test: 'test transformed' });

        const Child = () => {
            const saveContext = useSaveContext();

            const handleClick = () => {
                saveContext.save(
                    { test: 'test' },
                    { transform: transformOverride }
                );
            };

            return <button aria-label="save" onClick={handleClick} />;
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <CreateBase {...defaultProps} transform={transform}>
                    <Child />
                </CreateBase>
            </CoreAdminContext>
        );

        screen.getByLabelText('save').click();

        await waitFor(() => {
            expect(transformOverride).toHaveBeenCalledWith({ test: 'test' });
        });
        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('posts', {
                data: { test: 'test transformed' },
            });
        });
        expect(transform).not.toHaveBeenCalled();
    });
});
