import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, cloneElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import classnames from 'classnames';
import {
    ComponentPropType,
    ListControllerProps,
    useListContext,
    Record,
} from 'ra-core';

import { Title, TitlePropType } from '../layout/Title';
import { ListToolbar } from './ListToolbar';
import { Pagination as DefaultPagination } from './pagination';
import { BulkDeleteButton } from '../button';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { ListActions as DefaultActions } from './ListActions';
import { Empty } from './Empty';
import { ListProps } from '../types';

const defaultActions = <DefaultActions />;
const defaultBulkActionButtons = <BulkDeleteButton />;
const defaultPagination = <DefaultPagination />;
const defaultEmpty = <Empty />;
const DefaultComponent = Card;

export const ListView = <RecordType extends Record = Record>(
    props: ListViewProps<RecordType>
) => {
    const {
        actions = defaultActions,
        aside,
        filters,
        bulkActionButtons = defaultBulkActionButtons,
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
        total,
        isLoading,
        filterValues,
        selectedIds,
    } = useListContext<RecordType>(props);

    if (!children || (!data && isLoading && emptyWhileLoading)) {
        return null;
    }

    const renderList = () => (
        <>
            <div className={ListClasses.main}>
                {(filters || actions) && (
                    <ListToolbar filters={filters} actions={actions} />
                )}
                <Content
                    className={classnames(ListClasses.content, {
                        [ListClasses.bulkActionsDisplayed]:
                            selectedIds.length > 0,
                    })}
                >
                    {bulkActionButtons !== false && bulkActionButtons && (
                        <BulkActionsToolbar>
                            {bulkActionButtons}
                        </BulkActionsToolbar>
                    )}
                    {children &&
                        // @ts-ignore-line
                        cloneElement(Children.only(children), {
                            hasBulkActions: bulkActionButtons !== false,
                        })}
                </Content>
                {pagination !== false && pagination}
            </div>
        </>
    );

    const renderEmpty = () => empty !== false && cloneElement(empty);

    const shouldRenderEmptyPage =
        !isLoading &&
        total === 0 &&
        !Object.keys(filterValues).length &&
        empty !== false;

    return (
        <Root
            className={classnames('list-page', ListClasses.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <Title title={title} defaultTitle={defaultTitle} />
            {shouldRenderEmptyPage ? renderEmpty() : renderList()}
            {aside}
        </Root>
    );
};

ListView.propTypes = {
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    basePath: PropTypes.string,
    // @ts-ignore-line
    bulkActionButtons: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    children: PropTypes.element,
    className: PropTypes.string,
    component: ComponentPropType,
    // @ts-ignore-line
    currentSort: PropTypes.shape({
        field: PropTypes.string.isRequired,
        order: PropTypes.string.isRequired,
    }),
    data: PropTypes.any,
    defaultTitle: PropTypes.string,
    displayedFilters: PropTypes.object,
    emptyWhileLoading: PropTypes.bool,
    // @ts-ignore-line
    exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    filterDefaultValues: PropTypes.object,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    hideFilter: PropTypes.func,
    ids: PropTypes.array,
    loading: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggleItem: PropTypes.func,
    onUnselectItems: PropTypes.func,
    page: PropTypes.number,
    // @ts-ignore-line
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    perPage: PropTypes.number,
    refresh: PropTypes.func,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
    setFilters: PropTypes.func,
    setPage: PropTypes.func,
    setPerPage: PropTypes.func,
    setSort: PropTypes.func,
    showFilter: PropTypes.func,
    title: TitlePropType,
    total: PropTypes.number,
    version: PropTypes.number,
};

export interface ListViewProps<
    RecordType extends Record = Record
> extends ListProps<RecordType>,
        // Partial because we now get those props via context
        Partial<ListControllerProps<RecordType>> {
    children: ReactElement;
}

const sanitizeRestProps: (
    props: Omit<
        ListViewProps,
        | 'actions'
        | 'aside'
        | 'filter'
        | 'filters'
        | 'bulkActionButtons'
        | 'pagination'
        | 'children'
        | 'className'
        | 'classes'
        | 'component'
        | 'exporter'
        | 'title'
        | 'empty'
    >
) => any = ({
    basePath = null,
    currentSort = null,
    data = null,
    defaultTitle = null,
    disableSyncWithLocation = null,
    displayedFilters = null,
    exporter = null,
    filterDefaultValues = null,
    filterValues = null,
    hasCreate = null,
    hideFilter = null,
    ids = null,
    isFetching = null,
    isLoading = null,
    onSelect = null,
    onToggleItem = null,
    onUnselectItems = null,
    page = null,
    perPage = null,
    refetch = null,
    resource = null,
    selectedIds = null,
    setFilters = null,
    setPage = null,
    setPerPage = null,
    setSort = null,
    showFilter = null,
    sort = null,
    total = null,
    ...rest
}) => rest;

const PREFIX = 'RaList';

export const ListClasses = {
    root: `${PREFIX}-root`,
    main: `${PREFIX}-main`,
    content: `${PREFIX}-content`,
    bulkActionsDisplayed: `${PREFIX}-bulkActionsDisplayed`,
    actions: `${PREFIX}-actions`,
    noResults: `${PREFIX}-noResults`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${ListClasses.root}`]: {
        display: 'flex',
    },

    [`& .${ListClasses.main}`]: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    },

    [`& .${ListClasses.content}`]: {
        marginTop: 0,
        transition: theme.transitions.create('margin-top'),
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            boxShadow: 'none',
        },
        overflow: 'inherit',
    },

    [`& .${ListClasses.bulkActionsDisplayed}`]: {
        marginTop: theme.spacing(-8),
        transition: theme.transitions.create('margin-top'),
    },

    [`& .${ListClasses.actions}`]: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },

    [`& .${ListClasses.noResults}`]: { padding: 20 },
}));
