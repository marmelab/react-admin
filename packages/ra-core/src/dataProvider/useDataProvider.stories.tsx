import * as React from 'react';
import { useState, useEffect } from 'react';

import { useDataProvider } from './useDataProvider';
import { CoreAdminContext } from '../core';
import { ReferenceFieldBase } from '../controller/field/ReferenceFieldBase';
import { RecordContextProvider, WithRecord } from '../controller/record';

export default {
    title: 'ra-core/dataProvider/useDataProvider',
};

const PostWithAuthor = () => {
    const dataProvider = useDataProvider();
    const [post, setPost] = useState<any>();
    useEffect(() => {
        async function fetch() {
            const { data } = await dataProvider.getOne('posts', {
                id: 1,
            });
            setPost(data);
        }
        fetch();
    }, [dataProvider]);
    if (!post) return null;
    return (
        <RecordContextProvider value={post}>
            <div>{post.title}</div>
            <ReferenceFieldBase reference="authors" source="author_id">
                <WithRecord render={author => author.name} />
            </ReferenceFieldBase>
        </RecordContextProvider>
    );
};

export const Prefetching = ({
    dataProvider = {
        getOne: async () => {
            console.log('getList called');
            return {
                data: { id: 1, title: 'My post title', author_id: 1 },
                meta: {
                    prefetched: {
                        authors: [{ id: 1, name: 'John Doe' }],
                    },
                },
            };
        },
        getMany: async () => {
            console.log('getMany called');
            return { data: [{ id: 1, name: 'John Doe' }] };
        },
    } as any,
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <PostWithAuthor />
    </CoreAdminContext>
);
