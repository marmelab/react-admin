import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import { createResource } from './createResource';
import fakerestDataProvider from 'ra-data-fakerest';
import Admin from '../Admin';
import { Resource } from 'ra-core';

export default {
    title: 'react-admin/Typed Admin',
};

const dataProvider = fakerestDataProvider(
    {
        posts: [
            {
                id: 0,
                title: 'Hello, world!',
                views: 1256,
                is_published: true,
                tags_ids: [0, 1],
                author_id: 0,
            },
            {
                id: 1,
                title: 'FooBar',
                views: 526,
                is_published: true,
                tags_ids: [0],
                author_id: 1,
            },
            {
                id: 2,
                title: 'Baz',
                views: 987,
                is_published: false,
                tags_ids: [1],
                author_id: 1,
            },
        ],
        comments: [
            { id: 0, post_id: 0, message: 'Good post!', date: '2018-07-12' },
            {
                id: 1,
                post_id: 0,
                message: 'Very good post!',
                date: '2018-08-01',
            },
            {
                id: 2,
                post_id: 0,
                message: 'I agree with everything you said.',
                date: '2018-08-15',
            },
            { id: 3, post_id: 1, message: 'Nice!', date: '2018-08-01' },
            {
                id: 4,
                post_id: 2,
                message: "I don't agree with you.",
                date: '2018-08-15',
            },
        ],
        authors: [
            { id: 0, name: 'John Doe' },
            { id: 1, name: 'Jane Doe' },
        ],
        tags: [
            { id: 0, name: 'react' },
            { id: 1, name: 'material-ui' },
            { id: 2, name: 'ra-data-fakerest' },
        ],
    },
    process.env.NODE_ENV !== 'test'
);

export const Basic = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

type Post = {
    id: string;
    title: string;
    author_id: string;
    views: number;
    is_published: boolean;
    tags_ids: string[];
};

type Comment = {
    id: string;
    message: string;
    post_id: string;
    date: Date;
};

type Author = {
    id: string;
    name: string;
};

type Tag = {
    id: string;
    name: string;
};

type PostFilters = {
    'title@like': string;
    'author_id@eq': string;
    'views@lt': number;
    'views@gt': number;
    'is_published@eq': boolean;
    'tags_ids@in': string[];
};

// in posts/PostResource.ts or resources.ts
const PostResource = createResource<Post>();
// in comments/CommentResource.ts or resources.ts
const CommentResource = createResource<Comment>();
// in authors/AuthorResource.ts or resources.ts
const AuthorResource = createResource<Author>();
// in tags/TagResource.ts or resources.ts
const TagResource = createResource<Tag>();

// in posts/postList.tsx
// import { PostResource } from './PostResource';
// import { AuthorResource } from '../authors/AuthorResource';
// import { TagResource } from '../tags/TagResource';
// import { CommentResource } from '../comments/CommentResource';
// or
// import { AuthorResource, CommentResource, PostResource, TagResource } from '../resource';
const PostList = PostResource.createList<PostFilters>(({ List, Filters }) => {
    const isSmall = useMediaQuery('(max-width:600px)');

    return (
        <List filters={[<Filters.TextInput source="title@like" />]}>
            {isSmall ? (
                /* Those functions receive a Post */
                <PostResource.SimpleList
                    primaryText={post => post.title}
                    secondaryText={post => post.views}
                />
            ) : (
                <PostResource.DataGrid
                    /* Those functions receive a Post */
                    isRowExpandable={post => post.title === 'plop'}
                    isRowSelectable={post => post.title === 'plop'}
                    rowStyle={post => ({
                        backgroundColor:
                            post.title === 'plop' ? 'red' : 'white',
                    })}
                >
                    {/* Only allow sources for string properties of Post */}
                    <PostResource.TextField source="title" />
                    {/* Only allow source for boolean properties of Post */}
                    <PostResource.BooleanField source="is_published" />
                    {/* Only allow source for number properties of Post */}
                    <PostResource.NumberField source="views" />
                    <PostResource.ReferenceField
                        reference="authors"
                        source="author_id"
                    >
                        {/* Only allow sources for string properties of Author */}
                        <AuthorResource.TextField source="name" />
                    </PostResource.ReferenceField>
                    <PostResource.ReferenceArrayField
                        reference="tags"
                        source="tags_ids"
                    >
                        <TagResource.DataGrid
                            /* Those functions receive a Tag */
                            isRowExpandable={tag => tag.name === 'plop'}
                            isRowSelectable={tag => tag.name === 'plop'}
                            rowStyle={tag => ({
                                backgroundColor:
                                    tag.name === 'plop' ? 'red' : 'white',
                            })}
                        >
                            {/* Only allow sources for string properties of Tag */}
                            <TagResource.TextField source="name" />
                        </TagResource.DataGrid>
                    </PostResource.ReferenceArrayField>
                    <CommentResource.ReferenceManyField
                        label="Comments"
                        reference="comments"
                        target="post_id"
                    >
                        <CommentResource.SingleFieldList>
                            <CommentResource.ChipField source="message" />
                        </CommentResource.SingleFieldList>
                    </CommentResource.ReferenceManyField>
                </PostResource.DataGrid>
            )}
        </List>
    );
});
