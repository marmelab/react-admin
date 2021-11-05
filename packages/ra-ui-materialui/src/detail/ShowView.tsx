import * as React from 'react';
import { cloneElement, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';
import {
    ShowControllerProps,
    useResourceDefinition,
    useShowContext,
} from 'ra-core';

import { ShowActions as DefaultActions } from './ShowActions';
import { TitleForRecord } from '../layout';
import { ShowProps } from '../types';

export const ShowView = (props: ShowViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content = 'div',
        title,
        ...rest
    } = props;

    const { defaultTitle, hasList, record, resource, version } = useShowContext(
        props
    );
    const { hasEdit } = useResourceDefinition(props);

    const finalActions =
        typeof actions === 'undefined' && hasEdit ? (
            <DefaultActions />
        ) : (
            actions
        );

    if (!children) {
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
            {finalActions &&
                cloneElement(finalActions, {
                    data: record,
                    hasList,
                    hasEdit,
                    resource,
                    //  Ensure we don't override any user provided props
                    ...finalActions.props,
                })}
            <Content
                className={classnames(ShowClasses.main, {
                    [ShowClasses.noActions]: !finalActions,
                })}
            >
                {record && children}
            </Content>
        </Root>
    );
};

interface ShowViewProps
    extends ShowProps,
        Partial<Omit<ShowControllerProps, 'resource'>> {
    children: ReactNode;
}

ShowView.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    children: PropTypes.node,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    title: PropTypes.any,
    version: PropTypes.node,
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
    noActions: `${PREFIX}-noActions`,
};

const Root = styled('div', { name: PREFIX })({
    [`&.${ShowClasses.root}`]: {},
    [`& .${ShowClasses.main}`]: {
        display: 'flex',
    },
    [`& .${ShowClasses.noActions}`]: {
        marginTop: '1em',
    },
});
