import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
} from '@mui/material/styles';
import type { ReactElement, ReactNode, ElementType } from 'react';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { ListControllerResult, useListContext, type RaRecord } from 'ra-core';

import { Title } from '../layout/Title';
import { ListToolbar } from './ListToolbar';
import { Pagination as DefaultPagination } from './pagination';
import { ListActions as DefaultActions } from './ListActions';
import { Empty } from './Empty';
import { ListProps } from './List';
import { Offline } from '../Offline';

const defaultActions = <DefaultActions />;
const defaultPagination = <DefaultPagination />;
const defaultEmpty = <Empty />;
const DefaultComponent = Card;
const defaultOffline = <Offline />;

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
        render,
        offline = defaultOffline,
        error,
        ...rest
    } = props;
    const listContext = useListContext<RecordType>();
    const {
        defaultTitle,
        data,
        error: errorState,
        isPaused,
        isPending,
        isPlaceholderData,
        filterValues,
        resource,
        total,
        hasNextPage,
        hasPreviousPage,
    } = listContext;

    const showOffline =
        isPaused &&
        (isPending || isPlaceholderData) &&
        offline !== false &&
        offline !== undefined;

    const showError = errorState && error !== false && error !== undefined;

    if (
        (!children && !render) ||
        (!data && isPending && !isPaused && emptyWhileLoading)
    ) {
        return null;
    }

    const renderList = () => {
        return (
            <div
                className={clsx(ListClasses.main, {
                    [ListClasses.noActions]:
                        !(filters || actions) || showOffline || showError,
                })}
            >
                {filters || actions ? (
                    <ListToolbar
                        className={ListClasses.actions}
                        filters={filters}
                        actions={actions}
                    />
                ) : null}
                <Content className={ListClasses.content}>
                    {showOffline
                        ? offline
                        : showError
                          ? error
                          : render
                            ? render(listContext)
                            : children}
                </Content>
                {pagination !== false ? pagination : null}
            </div>
        );
    };

    const renderEmpty = () =>
        empty !== false && <div className={ListClasses.noResults}>{empty}</div>;

    const shouldRenderEmptyPage =
        !errorState &&
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

export interface ListViewProps<RecordType extends RaRecord = any> {
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
    aside?: ReactNode;

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
    children?: ReactNode;

    /**
     * The component to display when there is an error while fetching the list.
     *
     * @see https://marmelab.com/react-admin/List.html#error
     * @example
     * import { List } from 'react-admin';
     * import { Box, Typography } from '@mui/material';
     *
     * const ListError = () => (
     *     <Box textAlign="center" m={1}>
     *         <Typography variant="h4" paragraph>
     *             Something went wrong
     *         </Typography>
     *         <Typography variant="body1">
     *             Please try again or contact an administrator.
     *         </Typography>
     *     </Box>
     * );
     *
     * const ProductList = () => (
     *     <List error={<ListError />}>
     *         ...
     *     </List>
     * );
     */
    error?: ReactNode;

    /**
     * A function rendering the list of records. Take the list controller as argument.
     *
     * @see https://marmelab.com/react-admin/List.html#children
     * @example
     * import { List } from 'react-admin';
     *
     * export const BookList = () => (
     *     <List>
     *         {(listContext) =>
     *             listContext.data.map(record => (
     *                 <div key={record.id}>
     *                     <p>{record.id}</p>
     *                     <p>{record.title}</p>
     *                     <p>{record.published_at}</p>
     *                     <p>{record.nb_views}</p>
     *                 </div>
     *             )
     *         }
     *     </List>
     * );
     */
    render?: (props: ListControllerResult<RecordType, Error>) => ReactNode;

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
    empty?: ReactNode;

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
     * The offline component to display. defaults to <Offline />
     *
     * @see https://marmelab.com/react-admin/List.html#offline
     * @example
     * import { List } from 'react-admin';
     * import { Alert } from '@mui/material';
     *
     * const offline = <Alert severity="warning">No internet connection. Could not load data.</Alert>;
     *
     * export const PostList = () => (
     *     <List offline={offline}>
     *         ...
     *     </List>
     * );
     */
    offline?: ReactNode | false;

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
    pagination?: ReactNode | false;

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
    title?: ReactNode;

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
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaList';

export const ListClasses = {
    main: `${PREFIX}-main`,
    content: `${PREFIX}-content`,
    actions: `${PREFIX}-actions`,
    noActions: `${PREFIX}-noActions`,
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

    [`& .${ListClasses.noActions}`]: {
        marginTop: '1em',
    },
    [`& .${ListClasses.actions}`]: {},

    [`& .${ListClasses.noResults}`]: {
        flex: 1,
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaList: 'root' | 'main' | 'content' | 'actions' | 'noResults';
    }

    interface ComponentsPropsList {
        RaList: Partial<ListProps>;
    }

    interface Components {
        RaList?: {
            defaultProps?: ComponentsPropsList['RaList'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaList'];
        };
    }
}
