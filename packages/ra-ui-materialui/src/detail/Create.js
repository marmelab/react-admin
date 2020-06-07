import * as React from 'react';
import { Children, cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import {
    useCheckMinimumRequiredProps,
    useCreateController,
    SideEffectContext,
} from 'ra-core';

import TitleForRecord from '../layout/TitleForRecord';

/**
 * Page component for the Create view
 *
 * The `<Create>` component renders the page title and actions.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The <Create> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - successMessage
 * - title
 *
 * @example
 *
 * // in src/posts.js
 * import * as React from "react";
 * import { Create, SimpleForm, TextInput } from 'react-admin';
 *
 * export const PostCreate = (props) => (
 *     <Create {...props}>
 *         <SimpleForm>
 *             <TextInput source="title" />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostCreate } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" create={PostCreate} />
 *     </Admin>
 * );
 * export default App;
 */
const Create = props => (
    <CreateView {...props} {...useCreateController(props)} />
);

Create.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    resource: PropTypes.string.isRequired,
    title: PropTypes.node,
    record: PropTypes.object,
    hasList: PropTypes.bool,
    successMessage: PropTypes.string,
    onSuccess: PropTypes.func,
    onFailure: PropTypes.func,
    transform: PropTypes.func,
};

export const CreateView = props => {
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
        record = {},
        redirect,
        resource,
        save,
        setOnSuccess,
        setOnFailure,
        setTransform,
        saving,
        title,
        version,
        ...rest
    } = props;
    useCheckMinimumRequiredProps('Create', ['children'], props);
    const classes = useStyles(props);
    const sideEffectContextValue = useMemo(
        () => ({ setOnSuccess, setOnFailure, setTransform }),
        [setOnFailure, setOnSuccess, setTransform]
    );
    return (
        <SideEffectContext.Provider value={sideEffectContextValue}>
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
                            save,
                            saving,
                            version,
                        })}
                    </Content>
                    {aside &&
                        cloneElement(aside, {
                            basePath,
                            record,
                            resource,
                            save,
                            saving,
                            version,
                        })}
                </div>
            </div>
        </SideEffectContext.Provider>
    );
};

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
    actions,
    children,
    className,
    crudCreate,
    loading,
    loaded,
    saving,
    resource,
    title,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    match,
    location,
    history,
    options,
    locale,
    permissions,
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

export default Create;
