import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';
import { useShowContext } from 'ra-core';

import { ShowProps } from '../types';
import { ShowActions } from './ShowActions';
import { TitleForRecord } from '../layout';

const defaultActions = <ShowActions />;

export const ShowView = (props: ShowViewProps) => {
    const {
        actions = defaultActions,
        children,
        className,
        component: Content = 'div',
        emptyWhileLoading = false,
        title,
        ...rest
    } = props;

    const { defaultTitle, record, version } = useShowContext(props);

    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }
    return (
        <Root
            className={classnames('show-page', ShowClasses.root, className)}
            key={version}
            {...sanitizeRestProps(rest)}
        >
            <TitleForRecord
                title={title}
                record={record}
                defaultTitle={defaultTitle}
            />
            {actions !== false && actions}
            <Content className={ShowClasses.main}>{children}</Content>
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
    loaded = null,
    loading = null,
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
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${ShowClasses.root}`]: {
        paddingTop: theme.spacing(2),
    },
    [`& .${ShowClasses.main}`]: {
        display: 'flex',
    },
}));
