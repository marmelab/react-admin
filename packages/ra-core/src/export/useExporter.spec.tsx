import * as React from 'react';
import expect from 'expect';
import { waitFor, render } from '@testing-library/react';
import { CoreAdminContext } from '../core/CoreAdminContext';

import useExporter, { getAllKeys } from './useExporter';
import { Exporter } from '../types';

const UseExporter = ({
    customExporter,
    records,
    resource,
}: {
    customExporter: Exporter;
    records: Record<string, unknown>[];
    resource: string;
}) => {
    const exporter = useExporter({ exporter: customExporter });
    React.useEffect(() => {
        exporter(records, null, null, resource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

describe('useExporter', () => {
    it('should call given customExporter with keys deemed accesible by authProvider.canAccess', async () => {
        const customExporter = jest.fn();
        const canAccess = jest.fn().mockImplementation(
            async ({ resource }) => resource !== 'posts.id' // omitting id
        );
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
            canAccess,
        };
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseExporter
                    customExporter={customExporter}
                    records={[
                        {
                            id: 1,
                            title: 'How to implement access control',
                        },
                        {
                            id: 2,
                            title: 'How to test access control',
                            author: 'John Doe',
                        },
                    ]}
                    resource="posts"
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(1);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    title: 'How to implement access control',
                },
                {
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );

        expect(canAccess).toBeCalledTimes(3);
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.id',
        });
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.title',
        });
        expect(canAccess).toBeCalledWith({
            action: 'read',
            resource: 'posts.author',
        });
    });

    it('should call given customExporter with all keys when no authProvider', async () => {
        const customExporter = jest.fn();
        render(
            <CoreAdminContext>
                <UseExporter
                    customExporter={customExporter}
                    records={[
                        {
                            id: 1,
                            title: 'How to implement access control',
                        },
                        {
                            id: 2,
                            title: 'How to test access control',
                            author: 'John Doe',
                        },
                    ]}
                    resource="posts"
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(1);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );
    });
    it('should call given customExporter with all keys when no authProvider.canAccess', async () => {
        const customExporter = jest.fn();
        const authProvider = {
            login: () => Promise.reject('bad method'),
            logout: () => Promise.reject('bad method'),
            checkAuth: () => Promise.reject('bad method'),
            checkError: () => Promise.reject('bad method'),
            getPermissions: () => Promise.reject('bad method'),
        };
        render(
            <CoreAdminContext authProvider={authProvider}>
                <UseExporter
                    customExporter={customExporter}
                    records={[
                        {
                            id: 1,
                            title: 'How to implement access control',
                        },
                        {
                            id: 2,
                            title: 'How to test access control',
                            author: 'John Doe',
                        },
                    ]}
                    resource="posts"
                />
            </CoreAdminContext>
        );

        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(1);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );
    });

    describe('getAllKeys', () => {
        it('should return the list of all keys inside the array', () => {
            const keys = getAllKeys([
                { id: 1, title: 'Title' },
                { author: 'John Doe' },
                { comments: {} },
            ]);

            expect(keys).toEqual(['id', 'title', 'author', 'comments']);
        });
        it('should return an empty array when the array is empty', () => {
            const keys = getAllKeys([]);

            expect(keys).toEqual([]);
        });
        it('should return an empty array when no array given', () => {
            const keys = getAllKeys(undefined);

            expect(keys).toEqual([]);
        });
    });
});
