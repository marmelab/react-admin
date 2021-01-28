import * as React from 'react';
import { Children, cloneElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { CreateControllerProps, useCreateContext } from 'ra-core';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { CreateProps } from '../types';
import { TitleForRecord } from '../layout';

export const CreateView = (props: CreateViewProps) => {
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
        redirect,
        resource,
        save,
        saving,
        version,
    } = useCreateContext(props);

    return (
        <div
            className={classnames('create-page', classes.root, className)}
            {...sanitizeRestProps(rest)}
        >
            <TitleForRecord
                title={title}
                record={record}
                defaultTitle={defaultTitle}
            />
            {actions &&
                cloneElement(actions, {
                    basePath,
                    resource,
                    hasList,
                    //  Ensure we don't override any user provided props
                    ...actions.props,
                })}
            <div
                className={classnames(classes.main, {
                    [classes.noActions]: !actions,
                })}
            >
                <Content className={classes.card}>
                    {cloneElement(Children.only(children), {
                        basePath,
                        record,
                        redirect:
                            typeof children.props.redirect === 'undefined'
                                ? redirect
                                : children.props.redirect,
                        resource,
                        save:
                            typeof children.props.save === 'undefined'
                                ? save
                                : children.props.save,
                        saving,
                        version,
                    })}
                </Content>
                {aside &&
                    cloneElement(aside, {
                        basePath,
                        record,
                        resource,
                        save:
                            typeof children.props.save === 'undefined'
                                ? save
                                : children.props.save,
                        saving,
                        version,
                    })}
            </div>
        </div>
    );
};

interface CreateViewProps
    extends CreateProps,
        Omit<CreateControllerProps, 'resource'> {
    children: ReactElement;
}

CreateView.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: PropTypes.node,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    setOnSuccess: PropTypes.func,
    setOnFailure: PropTypes.func,
    setTransform: PropTypes.func,
};

CreateView.defaultProps = {
    classes: {},
    component: Card,
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        main: {
            display: 'flex',
        },
        noActions: {
            [theme.breakpoints.up('sm')]: {
                marginTop: '1em',
            },
        },
        card: {
            flex: '1 1 auto',
        },
    }),
    { name: 'RaCreate' }
);

const sanitizeRestProps = ({
    basePath = null,
    defaultTitle = null,
    hasCreate = null,
    hasEdit = null,
    hasList = null,
    hasShow = null,
    history = null,
    loaded = null,
    loading = null,
    location = null,
    match = null,
    onFailure = null,
    onFailureRef = null,
    onSuccess = null,
    onSuccessRef = null,
    options = null,
    permissions = null,
    save = null,
    saving = null,
    setOnFailure = null,
    setOnSuccess = null,
    setTransform = null,
    transform = null,
    transformRef = null,
    ...rest
}) => rest;
