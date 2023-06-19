import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';

import { EditBase } from './EditBase';
import { CoreAdminContext } from '../../core';
import { testDataProvider } from '../../dataProvider';
import { useSaveContext } from '../saveContext';
import { useRecordContext } from '../';

describe('EditBase', () => {
    const defaultProps = {
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
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save({ test: 'test' });
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase {...defaultProps} mutationMode="pessimistic">
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        screen.getByLabelText('save').click();

        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: defaultProps.id,
                data: { test: 'test' },
                previousData: { id: 12, test: 'previous' },
            });
        });
    });

    it('should allow to override the onSuccess function', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const onSuccess = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save({ test: 'test' });
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onSuccess }}
                >
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        getByLabelText('save').click();

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(
                {
                    id: 12,
                    test: 'test',
                },
                {
                    id: 12,
                    data: { test: 'test' },
                    resource: 'posts',
                },
                { snapshot: [] }
            );
        });
    });

    it('should allow to override the onSuccess function at call time', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const onSuccess = jest.fn();
        const onSuccessOverride = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save(
                    { test: 'test' },
                    { onSuccess: onSuccessOverride }
                );
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onSuccess }}
                >
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        getByLabelText('save').click();

        await waitFor(() => {
            expect(onSuccessOverride).toHaveBeenCalledWith(
                {
                    id: 12,
                    test: 'test',
                },
                {
                    id: 12,
                    data: { test: 'test' },
                    resource: 'posts',
                },
                { snapshot: [] }
            );
        });
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should allow to override the onError function', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            // @ts-ignore
            update: jest.fn(() => Promise.reject({ message: 'test' })),
        });
        const onError = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save({ test: 'test' });
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onError }}
                >
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        getByLabelText('save').click();

        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
                { message: 'test' },
                {
                    id: 12,
                    data: { test: 'test' },
                    resource: 'posts',
                },
                { snapshot: [] }
            );
        });
    });

    it('should allow to override the onError function at call time', async () => {
        const dataProvider = testDataProvider({
            // @ts-ignore
            getOne: () =>
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            // @ts-ignore
            update: jest.fn(() => Promise.reject({ message: 'test' })),
        });
        const onError = jest.fn();
        const onErrorOverride = jest.fn();

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save(
                    { test: 'test' },
                    { onError: onErrorOverride }
                );
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase
                    {...defaultProps}
                    mutationMode="pessimistic"
                    mutationOptions={{ onError }}
                >
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        getByLabelText('save').click();

        await waitFor(() => {
            expect(onErrorOverride).toHaveBeenCalledWith(
                { message: 'test' },
                {
                    id: 12,
                    data: { test: 'test' },
                    resource: 'posts',
                },
                { snapshot: [] }
            );
        });
        expect(onError).not.toHaveBeenCalled();
    });

    it('should allow to override the transform function', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const transform = jest.fn((data, _options) => ({
            ...data,
            test: 'test transformed',
        }));

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save({ test: 'test' });
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase
                    {...defaultProps}
                    mutationMode="pessimistic"
                    transform={transform}
                >
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        getByLabelText('save').click();

        await waitFor(() => {
            expect(transform).toHaveBeenCalledWith(
                { test: 'test' },
                { previousData: { id: 12, test: 'previous' } }
            );
        });
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: defaultProps.id,
                data: { test: 'test transformed' },
                previousData: { id: 12, test: 'previous' },
            });
        });
    });

    it('should allow to override the transform function at call time', async () => {
        const dataProvider = testDataProvider({
            getOne: () =>
                // @ts-ignore
                Promise.resolve({ data: { id: 12, test: 'previous' } }),
            update: jest.fn((_, { id, data, previousData }) =>
                Promise.resolve({ data: { id, ...previousData, ...data } })
            ),
        });
        const transform = jest.fn();
        const transformOverride = jest.fn((data, _options) => ({
            ...data,
            test: 'test transformed',
        }));

        const Child = () => {
            const saveContext = useSaveContext();
            const record = useRecordContext();

            const handleClick = () => {
                saveContext.save(
                    { test: 'test' },
                    { transform: transformOverride }
                );
            };

            return (
                <>
                    <p>{record?.test}</p>
                    <button aria-label="save" onClick={handleClick} />
                </>
            );
        };
        const { getByLabelText } = render(
            <CoreAdminContext dataProvider={dataProvider}>
                <EditBase
                    {...defaultProps}
                    mutationMode="pessimistic"
                    transform={transform}
                >
                    <Child />
                </EditBase>
            </CoreAdminContext>
        );

        await waitFor(() => {
            screen.getByText('previous');
        });
        getByLabelText('save').click();

        await waitFor(() => {
            expect(transformOverride).toHaveBeenCalledWith(
                { test: 'test' },
                { previousData: { id: 12, test: 'previous' } }
            );
        });
        await waitFor(() => {
            expect(dataProvider.update).toHaveBeenCalledWith('posts', {
                id: defaultProps.id,
                data: { test: 'test transformed' },
                previousData: { id: 12, test: 'previous' },
            });
        });
        expect(transform).not.toHaveBeenCalled();
    });
});
