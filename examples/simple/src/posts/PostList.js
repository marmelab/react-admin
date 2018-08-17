import BookIcon from '@material-ui/icons/Book';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import React, { Children, Fragment, cloneElement } from 'react';
import {
    BooleanField,
    BulkDeleteButton,
    ChipField,
    Datagrid,
    DateField,
    EditButton,
    Filter,
    List,
    NumberField,
    ReferenceArrayField,
    Responsive,
    SearchInput,
    ShowButton,
    SimpleList,
    SingleFieldList,
    TextField,
    TextInput,
    translate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import ResetViewsButton from './ResetViewsButton';
export const PostIcon = BookIcon;

const QuickFilter = translate(({ label, translate }) => (
    <Chip style={{ marginBottom: 8 }} label={translate(label)} />
));

const PostFilter = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <TextInput source="title2" />
        <TextInput source="title3" />
        <TextInput source="title4" />
        <TextInput source="title5" />
        <TextInput source="title6" />
        <TextInput
            source="title"
            defaultValue="Qui tempore rerum et voluptates"
        />
        <QuickFilter
            label="resources.posts.fields.commentable"
            source="commentable"
            defaultValue
        />
    </Filter>
);

const styles = theme => ({
    title: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    hiddenOnSmallScreens: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    publishedAt: { fontStyle: 'italic' },
});

const PostListBulkActions = props => (
    <Fragment>
        <ResetViewsButton {...props} />
        <BulkDeleteButton {...props} />
    </Fragment>
);

const PostListActionToolbar = withStyles({
    toolbar: {
        alignItems: 'center',
        display: 'flex',
    },
})(({ classes, children, ...props }) => (
    <div className={classes.toolbar}>
        {Children.map(children, button => cloneElement(button, props))}
    </div>
));

const PostList = withStyles(styles)(({ classes, ...props }) => (
    <List
        {...props}
        bulkActionButtons={<PostListBulkActions />}
        filters={<PostFilter />}
        sort={{ field: 'published_at', order: 'DESC' }}
    >
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record =>
                        new Date(record.published_at).toLocaleDateString()
                    }
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="title" cellClassName={classes.title} />
                    <DateField
                        source="published_at"
                        cellClassName={classes.publishedAt}
                    />

                    <BooleanField
                        source="commentable"
                        label="resources.posts.fields.commentable_short"
                        sortable={false}
                    />
                    <NumberField source="views" />
                    <ReferenceArrayField
                        label="Tags"
                        reference="tags"
                        source="tags"
                        cellClassName={classes.hiddenOnSmallScreens}
                        headerClassName={classes.hiddenOnSmallScreens}
                    >
                        <SingleFieldList>
                            <ChipField source="name" />
                        </SingleFieldList>
                    </ReferenceArrayField>
                    <PostListActionToolbar>
                        <EditButton />
                        <ShowButton />
                    </PostListActionToolbar>
                </Datagrid>
            }
        />
    </List>
));

export default PostList;
