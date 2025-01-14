import * as React from 'react';
import { useState } from 'react';
import { QueryClient, useIsMutating } from '@tanstack/react-query';
import fakeRestDataProvider from 'ra-data-fakerest';

import { CoreAdminContext } from '../core';
import { ListController } from '../controller/list';
import { useDelete } from './useDelete';
import { useGetList } from './useGetList';

export default { title: 'ra-core/dataProvider/useDelete/pessimistic' };

export const SuccessCase = () => {
    const posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
    ];
    const dataProvider = {
        getList: (resource, params) => {
            console.log('getList', resource, params);
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        delete: (resource, params) => {
            console.log('delete', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    const index = posts.findIndex(p => p.id === params.id);
                    posts.splice(index, 1);
                    resolve({ data: params.previousData });
                }, 500);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <SuccessCore />
        </CoreAdminContext>
    );
};

const SuccessCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetList('posts');
    const [deleteOne, { isPending }] = useDelete();
    const handleClick = () => {
        deleteOne(
            'posts',
            {
                id: 1,
                previousData: { id: 1, title: 'Hello' },
            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => setSuccess('success'),
            }
        );
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete first post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};

const DeleteButton = ({ id, resource }) => {
    const [deleteOne, { isPending }] = useDelete();
    const handleClick = () => {
        deleteOne(
            resource,
            {
                id,
                previousData: { id, title: 'Hello' },
            },
            {
                mutationMode: 'pessimistic',
            }
        );
    };
    return (
        <button onClick={handleClick} disabled={isPending}>
            Delete
        </button>
    );
};

export const InList = () => {
    const data = {
        books: [
            { id: 1, title: 'War and Peace' },
            { id: 2, title: 'The Little Prince' },
            { id: 3, title: "Swann's Way" },
            { id: 4, title: 'A Tale of Two Cities' },
            { id: 5, title: 'The Lord of the Rings' },
            { id: 6, title: 'And Then There Were None' },
            { id: 7, title: 'Dream of the Red Chamber' },
            { id: 8, title: 'The Hobbit' },
            { id: 9, title: 'She: A History of Adventure' },
            { id: 10, title: 'The Lion, the Witch and the Wardrobe' },
            { id: 11, title: 'The Chronicles of Narnia' },
            { id: 12, title: 'Pride and Prejudice' },
            { id: 13, title: 'Ulysses' },
            { id: 14, title: 'The Catcher in the Rye' },
            { id: 15, title: 'The Little Mermaid' },
            { id: 16, title: 'The Secret Garden' },
            { id: 17, title: 'The Wind in the Willows' },
            { id: 18, title: 'The Wizard of Oz' },
            { id: 19, title: 'Madam Bovary' },
            { id: 20, title: 'The Little House' },
            { id: 21, title: 'The Phantom of the Opera' },
            { id: 22, title: 'The Adventures of Tom Sawyer' },
            { id: 23, title: 'The Adventures of Huckleberry Finn' },
            { id: 24, title: 'The Time Machine' },
            { id: 25, title: 'The War of the Worlds' },
        ],
    };
    const dataProvider = fakeRestDataProvider(
        data,
        process.env.NODE_ENV === 'development',
        process.env.NODE_ENV === 'development' ? 500 : 0
    );
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <ListController resource="books">
                {({ data, total }) =>
                    data && (
                        <table>
                            <tbody>
                                {data.map((record: any) => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>
                                        <td>{record.title}</td>
                                        <td>
                                            <DeleteButton
                                                id={record.id}
                                                resource="books"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan={3}
                                        style={{ textAlign: 'center' }}
                                    >
                                        Books 1-{data.length} on {total}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )
                }
            </ListController>
        </CoreAdminContext>
    );
};

export const ErrorCase = () => {
    const posts = [
        { id: 1, title: 'Hello' },
        { id: 2, title: 'World' },
    ];
    const dataProvider = {
        getList: (resource, params) => {
            console.log('getList', resource, params);
            return Promise.resolve({
                data: posts,
                total: posts.length,
            });
        },
        delete: (resource, params) => {
            console.log('delete', resource, params);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, 500);
            });
        },
    } as any;
    return (
        <CoreAdminContext
            queryClient={new QueryClient()}
            dataProvider={dataProvider}
        >
            <ErrorCore />
        </CoreAdminContext>
    );
};

const ErrorCore = () => {
    const isMutating = useIsMutating();
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();
    const { data, refetch } = useGetList('posts');
    const [deleteOne, { isPending }] = useDelete();
    const handleClick = () => {
        setError(undefined);
        deleteOne(
            'posts',
            {
                id: 1,
                previousData: { id: 1, title: 'Hello World' },
            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => setSuccess('success'),
                onError: e => setError(e),
            }
        );
    };
    return (
        <>
            <ul>{data?.map(post => <li key={post.id}>{post.title}</li>)}</ul>
            <div>
                <button onClick={handleClick} disabled={isPending}>
                    Delete first post
                </button>
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {error && <div>{error.message}</div>}
            {success && <div>{success}</div>}
            {isMutating !== 0 && <div>mutating</div>}
        </>
    );
};
