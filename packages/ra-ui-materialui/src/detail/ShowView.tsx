import * as React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';
import { useShowContext, useResourceDefinition } from 'ra-core';

import { ShowProps } from '../types';
import { ShowActions } from './ShowActions';
import { TitleForRecord } from '../layout';

const defaultActions = <ShowActions />;

export const ShowView = (props: ShowViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = Card,
        emptyWhileLoading = false,
        title,
        ...rest
    } = props;

    const { defaultTitle, record } = useShowContext(props);
    const { hasEdit } = useResourceDefinition(props);

    const finalActions =
        typeof actions === 'undefined' && hasEdit ? defaultActions : actions;

    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }
    return (
        <Root
            className={classnames('show-page', ShowClasses.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <TitleForRecord
                title={title}
                record={record}
                defaultTitle={defaultTitle}
            />
            {finalActions !== false && finalActions}
            <div
                className={classnames(ShowClasses.main, {
                    [ShowClasses.noActions]: !finalActions,
                })}
            >
                <Content className={ShowClasses.card}>{children}</Content>
                {aside}
            </div>
        </Root>
    );
};

export type ShowViewProps = ShowProps;

ShowView.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.node,
    className: PropTypes.string,
    emptyWhileLoading: PropTypes.bool,
    title: PropTypes.any,
};

const sanitizeRestProps = ({
    basePath = null,
    defaultTitle = null,
    hasCreate = null,
    hasEdit = null,
    hasList = null,
    hasShow = null,
    history = null,
    id = null,
    isLoading = null,
    isFetching = null,
    location = null,
    match = null,
    options = null,
    refetch = null,
    permissions = null,
    ...rest
}) => rest;

const PREFIX = 'RaShow';

export const ShowClasses = {
    root: `${PREFIX}-root`,
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${ShowClasses.root}`]: {
        paddingTop: theme.spacing(1),
    },
    [`& .${ShowClasses.main}`]: {
        display: 'flex',
    },
    [`& .${ShowClasses.noActions}`]: {
        marginTop: '1em',
    },
    [`& .${ShowClasses.card}`]: {
        flex: '1 1 auto',
    },
}));
