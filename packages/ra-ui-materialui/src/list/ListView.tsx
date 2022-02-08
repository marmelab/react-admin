import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, cloneElement, ReactElement, ElementType } from 'react';
import PropTypes from 'prop-types';
import { SxProps } from '@mui/system';
import Card from '@mui/material/Card';
import classnames from 'classnames';
import { ComponentPropType, useListContext, RaRecord } from 'ra-core';

import { Title, TitlePropType } from '../layout/Title';
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
        bulkActionButtons,
        emptyWhileLoading,
        hasCreate,
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
    } = useListContext<RecordType>(props);

    if (!children || (!data && isLoading && emptyWhileLoading)) {
        return null;
    }

    const renderList = () => (
        <div className={ListClasses.main}>
            {(filters || actions) && (
                <ListToolbar
                    filters={filters}
                    actions={actions}
                    hasCreate={hasCreate}
                />
            )}
            <Content className={ListClasses.content}>
                {bulkActionButtons && children
                    ? cloneElement(Children.only(children), {
                          bulkActionButtons,
                      })
                    : children}
            </Content>
            {pagination !== false && pagination}
        </div>
    );

    const renderEmpty = () =>
        empty !== false && cloneElement(empty, { hasCreate });

    const shouldRenderEmptyPage =
        !isLoading &&
        total === 0 &&
        !Object.keys(filterValues).length &&
        empty !== false;

    return (
        <Root className={classnames('list-page', className)} {...rest}>
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
    children: PropTypes.element,
    className: PropTypes.string,
    component: ComponentPropType,
    // @ts-ignore-line
    sort: PropTypes.shape({
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
};

export interface ListViewProps {
    actions?: ReactElement | false;
    aside?: ReactElement;
    /**
     * @deprecated pass the bulkActionButtons prop to the List child (Datagrid or SimpleList) instead
     */
    bulkActionButtons?: ReactElement | false;
    className?: string;
    children: ReactElement;
    component?: ElementType;
    empty?: ReactElement | false;
    emptyWhileLoading?: boolean;
    filters?: ReactElement | ReactElement[];
    hasCreate?: boolean;
    pagination?: ReactElement | false;
    title?: string | ReactElement;
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

    [`& .${ListClasses.actions}`]: {
        zIndex: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },

    [`& .${ListClasses.noResults}`]: { padding: 20 },
}));
