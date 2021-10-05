import * as React from 'react';
import { Children, cloneElement, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CreateControllerProps, useCreateContext } from 'ra-core';
import classnames from 'classnames';
import { CreateProps } from '../types';
import { TitleForRecord } from '../layout';

const PREFIX = 'RaCreate';

const classes = {
    root: `${PREFIX}-root`,
    main: `${PREFIX}-main`,
    noActions: `${PREFIX}-noActions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {},

    [`& .${classes.main}`]: {
        display: 'flex',
    },

    [`& .${classes.noActions}`]: {
        [theme.breakpoints.up('sm')]: {
            marginTop: '1em',
        },
    },

    [`& .${classes.card}`]: {
        flex: '1 1 auto',
    },
}));

export const CreateView = (props: CreateViewProps) => {
    const {
        actions,
        aside,
        children,
        className,
        component: Content,
        title,
        ...rest
    } = props;

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
        <Root
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
        </Root>
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
    component: Card,
};

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
