import * as React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useShowContext, useResourceDefinition } from 'ra-core';

import { ShowProps } from '../types';
import { ShowActions } from './ShowActions';
import { Title } from '../layout';

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

    const { resource, defaultTitle, record } = useShowContext(props);
    const { hasEdit } = useResourceDefinition(props);

    const finalActions =
        typeof actions === 'undefined' && hasEdit ? defaultActions : actions;

    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }
    return (
        <Root
            className={clsx('show-page', className)}
            {...sanitizeRestProps(rest)}
        >
            <Title
                title={title}
                defaultTitle={defaultTitle}
                preferenceKey={`${resource}.show.title`}
            />
            {finalActions !== false && finalActions}
            <div
                className={clsx(ShowClasses.main, {
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

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
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
/* eslint-enable @typescript-eslint/no-unused-vars */

const PREFIX = 'RaShow';

export const ShowClasses = {
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${ShowClasses.main}`]: {
        display: 'flex',
    },
    [`& .${ShowClasses.noActions}`]: {
        marginTop: '1em',
    },
    [`& .${ShowClasses.card}`]: {
        flex: '1 1 auto',
    },
});
