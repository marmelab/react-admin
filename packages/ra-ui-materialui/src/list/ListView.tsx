import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    cloneElement,
    ReactElement,
    ReactNode,
    ElementType,
    isValidElement,
} from 'react';
import PropTypes from 'prop-types';
import { SxProps } from '@mui/system';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { ComponentPropType, useListContext, RaRecord } from 'ra-core';

import { Title, TitlePropType } from '../layout/Title';
import { ListToolbar } from './ListToolbar';
import { Pagination as DefaultPagination } from './pagination';
import { ListActions as DefaultActions } from './ListActions';
import { Error } from '../layout';
import { EmptyProps } from './Empty';

const defaultActions = <DefaultActions />;
const defaultPagination = <DefaultPagination />;
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
        empty = null,
        ...rest
    } = props;
    const {
        defaultTitle,
        data,
        error,
        total,
        isLoading,
        filterValues,
        resource,
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
                {bulkActionButtons &&
                children &&
                React.isValidElement<any>(children)
                    ? // FIXME remove in 5.0
                      cloneElement(children, {
                          bulkActionButtons,
                      })
                    : children}
            </Content>
            {error ? (
                <Error error={error} resetErrorBoundary={null} />
            ) : (
                pagination !== false && pagination
            )}
        </div>
    );

    const renderEmpty = () => {
        if (empty != null) {
            if (process.env.NODE_ENV === 'development') {
                console.warn(
                    'The empty prop is deprecated, use the empty prop of the child component you passed to the <List> instead.'
                );
            }
            if (empty !== false && isValidElement(empty)) {
                return cloneElement<EmptyProps>(empty, { hasCreate });
            }
        }
        // We still render the list as it is now the responsibility of the children
        // to render the empty state
        return renderList();
    };

    const shouldRenderEmptyPage =
        !isLoading &&
        total === 0 &&
        !Object.keys(filterValues).length &&
        empty !== false;

    return (
        <Root className={clsx('list-page', className)} {...rest}>
            <Title
                title={title}
                defaultTitle={defaultTitle}
                preferenceKey={`${resource}.list.title`}
            />
            {shouldRenderEmptyPage ? renderEmpty() : renderList()}
            {aside}
        </Root>
    );
};

ListView.propTypes = {
    // @ts-ignore-line
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    children: PropTypes.node,
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
    children: ReactNode;
    component?: ElementType;
    /**
     * @deprecated pass the empty prop to the List child (Datagrid or SimpleList) instead
     */
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
