import * as React from 'react';
import BookIcon from '@mui/icons-material/Book';
import { Box, Chip, useMediaQuery } from '@mui/material';
import { Theme, styled } from '@mui/material/styles';
import lodashGet from 'lodash/get';
import jsonExport from 'jsonexport/dist';
import {
    BooleanField,
    BulkDeleteButton,
    BulkExportButton,
    ChipField,
    SelectColumnsButton,
    CreateButton,
    DatagridConfigurable,
    DateField,
    downloadCSV,
    EditButton,
    ExportButton,
    FilterButton,
    List,
    InfiniteList,
    NumberField,
    ReferenceArrayField,
    ReferenceManyCount,
    SearchInput,
    ShowButton,
    SimpleList,
    SingleFieldList,
    TextField,
    TextInput,
    TopToolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import ResetViewsButton from './ResetViewsButton';
export const PostIcon = BookIcon;

const QuickFilter = ({
    label,
}: {
    label?: string;
    source?: string;
    defaultValue?: any;
}) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const postFilter = [
    <SearchInput source="q" alwaysOn />,
    <TextInput source="title" defaultValue="Qui tempore rerum et voluptates" />,
    <QuickFilter
        label="resources.posts.fields.commentable"
        source="commentable"
        defaultValue
    />,
];

const exporter = posts => {
    const data = posts.map(post => ({
        ...post,
        backlinks: lodashGet(post, 'backlinks', []).map(
            backlink => backlink.url
        ),
    }));
    return jsonExport(data, (err, csv) => downloadCSV(csv, 'posts'));
};

const postListMobileActions = (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const PostListMobile = () => (
    <InfiniteList
        filters={postFilter}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={postListMobileActions}
    >
        <SimpleList
            primaryText={record => record.title}
            secondaryText={record => `${record.views} views`}
            tertiaryText={record =>
                new Date(record.published_at).toLocaleDateString()
            }
        />
    </InfiniteList>
);

const StyledDatagrid = styled(DatagridConfigurable)(({ theme }) => ({
    '& .title': {
        maxWidth: '16em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    '& .hiddenOnSmallScreens': {
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        },
    },
    '& .column-tags': {
        minWidth: '9em',
    },
    '& .publishedAt': { fontStyle: 'italic' },
}));

const postListBulkActions = (
    <>
        <ResetViewsButton />
        <BulkDeleteButton />
        <BulkExportButton />
    </>
);

const postListActions = (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const PostListActionToolbar = ({ children }) => (
    <Box sx={{ alignItems: 'center', display: 'flex' }}>{children}</Box>
);

const rowClick = (_id, _resource, record) => {
    if (record.commentable) {
        return 'edit';
    }

    return 'show';
};

const PostPanel = () => {
    const record = useRecordContext();
    return <div dangerouslySetInnerHTML={{ __html: record?.body }} />;
};

const tagSort = { field: 'name.en', order: 'ASC' } as const;

const PostListDesktop = () => (
    <List
        filters={postFilter}
        sort={{ field: 'published_at', order: 'DESC' }}
        exporter={exporter}
        actions={postListActions}
    >
        <StyledDatagrid
            bulkActionButtons={postListBulkActions}
            rowClick={rowClick}
            expand={PostPanel}
            omit={['average_note']}
        >
            <TextField source="id" />
            <TextField source="title" cellClassName="title" />
            <DateField
                source="published_at"
                sortByOrder="DESC"
                cellClassName="publishedAt"
            />
            <ReferenceManyCount
                label="resources.posts.fields.nb_comments"
                reference="comments"
                target="post_id"
                link
            />
            <BooleanField
                source="commentable"
                label="resources.posts.fields.commentable_short"
                sortable={false}
            />
            <NumberField source="views" sortByOrder="DESC" />
            <ReferenceArrayField
                label="Tags"
                reference="tags"
                source="tags"
                sortBy="tags.name"
                sort={tagSort}
                cellClassName="hiddenOnSmallScreens"
                headerClassName="hiddenOnSmallScreens"
            >
                <SingleFieldList>
                    <ChipField clickable source="name.en" size="small" />
                </SingleFieldList>
            </ReferenceArrayField>
            <NumberField source="average_note" />
            <PostListActionToolbar>
                <EditButton />
                <ShowButton />
            </PostListActionToolbar>
        </StyledDatagrid>
    </List>
);

const PostList = () => {
    const isSmall = useMediaQuery<Theme>(
        theme => theme.breakpoints.down('md'),
        { noSsr: true }
    );
    return isSmall ? <PostListMobile /> : <PostListDesktop />;
};

export default PostList;
