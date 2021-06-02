import * as React from 'react';
import { cloneElement, Children, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {
    ShowControllerProps,
    useResourceDefinition,
    useShowContext,
} from 'ra-core';

import { ShowActions as DefaultActions } from './ShowActions';
import TitleForRecord from '../layout/TitleForRecord';
import { ShowProps } from '../types';

export const ShowView = (props: ShowViewProps) => {
    const {
        actions,
        aside,
        children,
        classes: classesOverride,
        className,
        component: Content,
        title,
        ...rest
    } = props;

    const classes = useStyles(props);

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
        <div
            className={classnames('show-page', classes.root, className)}
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
                className={classnames(classes.main, {
                    [classes.noActions]: !finalActions,
                })}
            >
                <Content className={classes.card}>
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
        </div>
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
    classes: PropTypes.object,
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

ShowView.defaultProps = {
    classes: {},
    component: Card,
};

const useStyles = makeStyles(
    {
        root: {},
        main: {
            display: 'flex',
        },
        noActions: {
            marginTop: '1em',
        },
        card: {
            flex: '1 1 auto',
        },
    },
    { name: 'RaShow' }
);

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
