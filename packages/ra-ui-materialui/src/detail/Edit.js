import * as React from 'react';
import { Children, cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {
    useEditController,
    ComponentPropType,
    SideEffectContext,
} from 'ra-core';

import DefaultActions from './EditActions';
import TitleForRecord from '../layout/TitleForRecord';

/**
 * Page component for the Edit view
 *
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The <Edit> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - successMessage
 * - title
 * - undoable
 *
 * @example
 *
 * // in src/posts.js
 * import * as React from "react";
 * import { Edit, SimpleForm, TextInput } from 'react-admin';
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostEdit } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" edit={PostEdit} />
 *     </Admin>
 * );
 * export default App;
 */
const Edit = props => <EditView {...props} {...useEditController(props)} />;

Edit.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    id: PropTypes.any.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.node,
    successMessage: PropTypes.string,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    transform: PropTypes.func,
    undoable: PropTypes.bool,
};

export const EditView = props => {
    const {
        actions,
        aside,
        basePath,
        children,
        classes: classesOverride,
        className,
        component: Content,
        defaultTitle,
        hasList,
        hasShow,
        record,
        redirect,
        resource,
        save,
        setOnSuccess,
        setOnFailure,
        setTransform,
        saving,
        title,
        undoable,
        version,
        ...rest
    } = props;
    const classes = useStyles(props);
    const finalActions =
        typeof actions === 'undefined' && hasShow ? (
            <DefaultActions />
        ) : (
            actions
        );
    const sideEffectContextValue = useMemo(
        () => ({ setOnSuccess, setOnFailure, setTransform }),
        [setOnFailure, setOnSuccess, setTransform]
    );
    if (!children) {
        return null;
    }
    return (
        <SideEffectContext.Provider value={sideEffectContextValue}>
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
                                    typeof children.props.redirect ===
                                    'undefined'
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
        </SideEffectContext.Provider>
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
    data,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    id,
    loading,
    loaded,
    saving,
    resource,
    title,
    version,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    undoable,
    successMessage,
    onSuccess,
    setOnSuccess,
    onFailure,
    setOnFailure,
    transform,
    setTransform,
    translate,
    ...rest
}) => rest;

export default Edit;
