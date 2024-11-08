import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, ReactNode, ElementType } from 'react';
import { SxProps } from '@mui/system';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { useListContext, RaRecord } from 'ra-core';

import { Title } from '../layout/Title';
import { ListToolbar } from './ListToolbar';
import { Pagination as DefaultPagination } from './pagination';
import { ListActions as DefaultActions } from './ListActions';
import { Empty } from './Empty';

const defaultActions = <DefaultActions />;
const defaultPagination = <DefaultPagination />;
const defaultEmpty = <Empty />;
const DefaultComponent = Card;

export const ListView = <RecordType extends RaRecord = any>(
    props: ListViewProps
) => {
    const {
        actions = defaultActions,
        aside,
        filters,
        emptyWhileLoading,
        pagination = defaultPagination,
        children,
        className,
        component: Content = DefaultComponent,
        title,
        empty = defaultEmpty,
        ...rest
    } = props;
    const {
        defaultTitle,
        data,
        error,
        isPending,
        filterValues,
        resource,
        total,
        hasNextPage,
        hasPreviousPage,
    } = useListContext<RecordType>();

    if (!children || (!data && isPending && emptyWhileLoading)) {
        return null;
    }

    const renderList = () => (
        <div className={ListClasses.main}>
            {(filters || actions) && (
                <ListToolbar
                    className={ListClasses.actions}
                    filters={filters}
                    actions={actions}
                />
            )}
            <Content className={ListClasses.content}>{children}</Content>
            {!error && pagination !== false && pagination}
        </div>
    );

    const renderEmpty = () =>
        empty !== false && <div className={ListClasses.noResults}>{empty}</div>;

    const shouldRenderEmptyPage =
        !error &&
        // the list is not loading data for the first time
        !isPending &&
        // the API returned no data (using either normal or partial pagination)
        (total === 0 ||
            (total == null &&
                hasPreviousPage === false &&
                hasNextPage === false &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                data.length === 0)) &&
        // the user didn't set any filters
        !Object.keys(filterValues).length &&
        // there is an empty page component
        empty !== false;

    return (
        <Root className={clsx('list-page', className)} {...rest}>
            {title !== false && (
                <Title
                    title={title}
                    defaultTitle={defaultTitle}
                    preferenceKey={`${resource}.list.title`}
                />
            )}
            {shouldRenderEmptyPage ? renderEmpty() : renderList()}
            {aside}
        </Root>
    );
};

export interface ListViewProps {
    /**
     * The actions to display in the toolbar. defaults to Filter + Create + Export.
     *
     * @see https://marmelab.com/react-admin/List.html#actions
     * @example
     * import {
     *     CreateButton,
     *     DatagridConfigurable,
     *     ExportButton,
     *     FilterButton,
     *     List,
     *     SelectColumnsButton,
     *     TopToolbar,
     * } from 'react-admin';
     * import IconEvent from '@mui/icons-material/Event';
     *
     * const ListActions = () => (
     *     <TopToolbar>
     *         <SelectColumnsButton />
     *         <FilterButton/>
     *         <CreateButton/>
     *         <ExportButton/>
     *     </TopToolbar>
     * );
     *
     * export const PostList = () => (
     *     <List actions={<ListActions/>}>
     *         <DatagridConfigurable>
     *             ...
     *         </DatagridConfigurable>
     *     </List>
     * );
     */
    actions?: ReactElement | false;

    /**
     * The content to render as a sidebar.
     * @see https://marmelab.com/react-admin/List.html#aside
     * @example
     * import { List, useListContext } from 'react-admin';
     * import { Typography } from '@mui/material';
     *
     * const Aside = () => {
     *     const { data, isPending } = useListContext();
     *     if (isPending) return null;
     *     return (
     *         <div style={{ width: 200, margin: '4em 1em' }}>
     *             <Typography variant="h6">Posts stats</Typography>
     *             <Typography variant="body2">
     *                 Total views: {data.reduce((sum, post) => sum + post.views, 0)}
     *             </Typography>
     *         </div>
     *     );
     * };
     *
     * const PostList = () => (
     *     <List aside={<Aside />}>
     *         ...
     *     </List>
     * );
     */
    aside?: ReactElement;

    /**
     * A class name to apply to the root div element
     */
    className?: string;

    /**
     * The components rendering the list of records. Usually a <Datagrid> or <SimpleList>.
     *
     * @see https://marmelab.com/react-admin/List.html#children
     * @example
     * import { List, Datagrid, TextField, DateField, NumberField, BooleanField, ReferenceManyCount } from 'react-admin';
     *
     * export const BookList = () => (
     *     <List>
     *         <Datagrid rowClick="edit">
     *             <TextField source="id" />
     *             <TextField source="title" />
     *             <DateField source="published_at" />
     *             <ReferenceManyCount label="Nb comments" reference="comments" target="post_id" link />
     *             <BooleanField source="commentable" label="Com." />
     *             <NumberField source="nb_views" label="Views" />
     *         </Datagrid>
     *     </List>
     * );
     */
    children: ReactNode;

    /**
     * The component used to display the list. Defaults to <Card>.
     *
     * @see https://marmelab.com/react-admin/List.html#component
     * @example
     * import { List } from 'react-admin';
     *
     * const PostList = () => (
     *     <List component="div">
     *         ...
     *     </List>
     * );
     */
    component?: ElementType;

    /**
     * The component to display when the list is empty.
     *
     * @see https://marmelab.com/react-admin/List.html#empty
     * @example
     * import { CreateButton, List } from 'react-admin';
     * import { Box, Button, Typography } from '@mui/material';
     *
     * const Empty = () => (
     *     <Box textAlign="center" m={1}>
     *         <Typography variant="h4" paragraph>
     *             No products available
     *         </Typography>
     *         <Typography variant="body1">
     *             Create one or import products from a file
     *         </Typography>
     *         <CreateButton />
     *         <Button onClick={...}>Import</Button>
     *     </Box>
     * );
     *
     * const ProductList = () => (
     *     <List empty={<Empty />}>
     *         ...
     *     </List>
     * );
     */
    empty?: ReactElement | false;

    /**
     * Set to true to return null while the list is loading.
     *
     * @see https://marmelab.com/react-admin/List.html#emptywhileloading
     * @example
     * import { List } from 'react-admin';
     * import { SimpleBookList } from './BookList';
     *
     * const BookList = () => (
     *     <List emptyWhileLoading>
     *         <SimpleBookList />
     *     </List>
     * );
     */
    emptyWhileLoading?: boolean;

    /**
     * The filter inputs to display in the toolbar.
     *
     * @see https://marmelab.com/react-admin/List.html#filters
     * @example
     * import { List, TextInput } from 'react-admin';
     *
     * const postFilters = [
     *     <TextInput label="Search" source="q" alwaysOn />,
     *     <TextInput label="Title" source="title" defaultValue="Hello, World!" />,
     * ];
     *
     * export const PostList = () => (
     *     <List filters={postFilters}>
     *         ...
     *     </List>
     * );
     */
    filters?: ReactElement | ReactElement[];

    /**
     * The pagination component to display. defaults to <Pagination />
     *
     * @see https://marmelab.com/react-admin/List.html#pagination
     * @example
     * import { Pagination, List } from 'react-admin';
     *
     * const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;
     *
     * export const PostList = () => (
     *     <List pagination={<PostPagination />}>
     *         ...
     *     </List>
     * );
     */
    pagination?: ReactElement | false;

    /**
     * The page title (main title) to display above the data. Defaults to the humanized resource name.
     *
     * @see https://marmelab.com/react-admin/List.html#title
     * @example
     * import { List } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List title="List of posts">
     *         ...
     *     </List>
     * );
     */
    title?: string | ReactElement | false;

    /**
     * The CSS styles to apply to the component.
     *
     * @see https://marmelab.com/react-admin/List.html#sx-css-api
     * @example
     * const PostList = () => (
     *     <List
     *         sx={{
     *             backgroundColor: 'yellow',
     *             '& .RaList-content': {
     *                 backgroundColor: 'red',
     *             },
     *         }}
     *     >
     *             ...
     *     </List>
     * );
     */
    sx?: SxProps;
}

const PREFIX = 'RaList';

export const ListClasses = {
    main: `${PREFIX}-main`,
    content: `${PREFIX}-content`,
    actions: `${PREFIX}-actions`,
    noResults: `${PREFIX}-noResults`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',

    [`& .${ListClasses.main}`]: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    },

    [`& .${ListClasses.content}`]: {
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            boxShadow: 'none',
        },
        overflow: 'inherit',
    },

    [`& .${ListClasses.actions}`]: {},

    [`& .${ListClasses.noResults}`]: {
        flex: 1,
    },
}));
