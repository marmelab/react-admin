import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import { createResource } from './createResource';

type Post = {
    id: string;
    title: string;
    author_id: string;
    views: number;
    is_published: boolean;
    tags_ids: string[];
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

// in post/postResource.ts
const postResource = createResource<Post>();

// in post/postList.tsx
// import { postResource } from './postResource';
const PostList = postResource.createList<PostFilters>(
    ({
        List,
        Filters,
        DataGrid,
        SimpleList,
        TextField,
        BooleanField,
        NumberField,
        Reference,
        ReferenceArray,
    }) => {
        const isSmall = useMediaQuery('(max-width:600px)');
        const AuthorReference = Reference<Author, 'authors', 'author_id'>();
        const TagsReference = ReferenceArray<Tag, 'tags', 'tags_ids'>();

        return (
            <List filters={[<Filters.TextInput source="title@like" />]}>
                {isSmall ? (
                    /* Those functions receive a Post */
                    <SimpleList
                        primaryText={post => post.title}
                        secondaryText={post => post.views}
                    />
                ) : (
                    <DataGrid
                        /* Those functions receive a Post */
                        isRowExpandable={post => post.title === 'plop'}
                        isRowSelectable={post => post.title === 'plop'}
                        rowStyle={post => ({
                            backgroundColor:
                                post.title === 'plop' ? 'red' : 'white',
                        })}
                    >
                        {/* Only allow sources for string properties of Post */}
                        <TextField source="title" />
                        {/* Only allow source for boolean properties of Post */}
                        <BooleanField source="is_published" />
                        {/* Only allow source for number properties of Post */}
                        <NumberField source="views" />
                        <AuthorReference.ReferenceField
                            reference="authors"
                            source="author_id"
                        >
                            {/* Only allow sources for string properties of Author */}
                            <AuthorReference.TextField source="name" />
                        </AuthorReference.ReferenceField>
                        <TagsReference.ReferenceArrayField
                            reference="tags"
                            source="tags_ids"
                        >
                            <TagsReference.DataGrid
                                /* Those functions receive a Tag */
                                isRowExpandable={tag => tag.name === 'plop'}
                                isRowSelectable={tag => tag.name === 'plop'}
                                rowStyle={tag => ({
                                    backgroundColor:
                                        tag.name === 'plop' ? 'red' : 'white',
                                })}
                            >
                                {/* Only allow sources for string properties of Tag */}
                                <TagsReference.TextField source="name" />
                            </TagsReference.DataGrid>
                        </TagsReference.ReferenceArrayField>
                    </DataGrid>
                )}
            </List>
        );
    }
);
