import * as React from 'react';
import { styled } from '@mui/material/styles';
import { cloneElement, ReactElement, ReactNode, ElementType } from 'react';
import PropTypes from 'prop-types';
import { SxProps } from '@mui/system';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { ComponentPropType, useListContext, RaRecord } from 'ra-core';

import { Title, TitlePropType } from '../layout/Title';
import { ListToolbar } from './ListToolbar';
import { Pagination as DefaultPagination } from './pagination';
import { ListActions as DefaultActions } from './ListActions';
import { Empty } from './Empty';
import { Error } from '../layout';

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
        error,
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
                    className={ListClasses.actions}
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

    const renderEmpty = () =>
        empty !== false &&
        cloneElement(empty, { className: ListClasses.noResults, hasCreate });

    const shouldRenderEmptyPage =
        !isLoading &&
        data?.length === 0 &&
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
    actions: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
    aside: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    component: ComponentPropType,
    emptyWhileLoading: PropTypes.bool,
    filters: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    hasCreate: PropTypes.bool,
    pagination: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    title: TitlePropType,
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

    [`& .${ListClasses.actions}`]: {},

    [`& .${ListClasses.noResults}`]: {},
}));
