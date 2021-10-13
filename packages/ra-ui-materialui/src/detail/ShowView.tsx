import * as React from 'react';
import { cloneElement, Children, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
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
        component: Content = Card,
        title,
        ...rest
    } = props;

    const {
        basePath,
        defaultTitle,
        hasList,
        record,
        resource,
        version,
    } = useShowContext(props);
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
            {...sanitizeRestProps(rest)}
        >
            <TitleForRecord
                title={title}
                record={record}
                defaultTitle={defaultTitle}
            />
            {finalActions &&
                cloneElement(finalActions, {
                    basePath,
                    data: record,
                    hasList,
                    hasEdit,
                    resource,
                    //  Ensure we don't override any user provided props
                    ...finalActions.props,
                })}
            <div
                className={classnames(ShowClasses.main, {
                    [ShowClasses.noActions]: !finalActions,
                })}
            >
                <Content className={ShowClasses.card}>
                    {record &&
                        cloneElement(Children.only(children), {
                            resource,
                            basePath,
                            record,
                            version,
                        })}
                </Content>
                {aside &&
                    cloneElement(aside, {
                        resource,
                        basePath,
                        record,
                        version,
                    })}
            </div>
        </Root>
    );
};

interface ShowViewProps
    extends ShowProps,
        Partial<Omit<ShowControllerProps, 'resource'>> {
    children: ReactElement;
}

ShowView.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
    aside: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.element,
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
    card: `${PREFIX}-card`,
};

const Root = styled('div', { name: PREFIX })({
    [`&.${ShowClasses.root}`]: {},
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
