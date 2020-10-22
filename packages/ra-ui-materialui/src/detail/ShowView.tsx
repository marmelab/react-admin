import * as React from 'react';
import { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { ShowControllerProps, useShowContext } from 'ra-core';

import DefaultActions from './ShowActions';
import TitleForRecord from '../layout/TitleForRecord';
import { ShowProps } from '../types';

interface ShowViewProps
    extends ShowProps,
        Omit<ShowControllerProps, 'resource'> {}

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
        hasEdit,
        hasList,
        record,
        resource,
        version,
    } = useShowContext(props);

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

ShowView.propTypes = {
    actions: PropTypes.element,
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
    hasCreate = null,
    hasEdit = null,
    history = null,
    id = null,
    loaded = null,
    loading = null,
    location = null,
    match = null,
    options = null,
    permissions = null,
    ...rest
}) => rest;
