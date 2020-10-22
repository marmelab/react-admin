import * as React from 'react';
import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {
    EditControllerProps,
    ComponentPropType,
    useEditContext,
} from 'ra-core';

import DefaultActions from './EditActions';
import TitleForRecord from '../layout/TitleForRecord';
import { EditProps } from '../types';

interface EditViewProps
    extends EditProps,
        Omit<EditControllerProps, 'resource'> {}

export const EditView = (props: EditViewProps) => {
    const {
        actions,
        aside,
        children,
        classes: classesOverride,
        className,
        component: Content,
        title,
        undoable,
        ...rest
    } = props;

    const classes = useStyles(props);

    const {
        basePath,
        defaultTitle,
        hasList,
        hasShow,
        record,
        redirect,
        resource,
        save,
        saving,
        version,
    } = useEditContext(props);

    const finalActions =
        typeof actions === 'undefined' && hasShow ? (
            <DefaultActions />
        ) : (
            actions
        );
    if (!children) {
        return null;
    }
    return (
        <div
            className={classnames('edit-page', classes.root, className)}
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
                    hasShow,
                    hasList,
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
                    {record ? (
                        cloneElement(Children.only(children), {
                            basePath,
                            record,
                            redirect:
                                typeof children.props.redirect === 'undefined'
                                    ? redirect
                                    : children.props.redirect,
                            resource,
                            save,
                            saving,
                            undoable,
                            version,
                        })
                    ) : (
                        <CardContent>&nbsp;</CardContent>
                    )}
                </Content>
                {aside &&
                    React.cloneElement(aside, {
                        basePath,
                        record,
                        resource,
                        version,
                        save,
                        saving,
                    })}
            </div>
        </div>
    );
};

EditView.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    component: ComponentPropType,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: PropTypes.node,
    version: PropTypes.number,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    setOnSuccess: PropTypes.func,
    setOnFailure: PropTypes.func,
    setTransform: PropTypes.func,
};

EditView.defaultProps = {
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
    { name: 'RaEdit' }
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
    onFailure = null,
    onSuccess = null,
    options = null,
    permissions = null,
    successMessage = null,
    transform = null,
    ...rest
}) => rest;
