import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useShowController } from 'ra-core';

import DefaultActions from './ShowActions';
import TitleForRecord from '../layout/TitleForRecord';

/**
 * Page component for the Show view
 *
 * The `<Show>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleShowLayout>`),
 * to which it passes pass the `record` as prop.
 *
 * The <Show> component accepts the following props:
 *
 * - actions
 * - aside
 * - component
 * - title
 *
 * @example
 *
 * // in src/posts.js
 * import React from 'react';
 * import { Show, SimpleShowLayout, TextField } from 'react-admin';
 *
 * export const PostShow = (props) => (
 *     <Show {...props}>
 *         <SimpleShowLayout>
 *             <TextField source="title" />
 *         </SimpleShowLayout>
 *     </Show>
 * );
 *
 * // in src/App.js
 * import React from 'react';
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostShow } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" show={PostShow} />
 *     </Admin>
 * );
 * export default App;
 */
const Show = props => <ShowView {...props} {...useShowController(props)} />;

Show.propTypes = {
    actions: PropTypes.element,
    aside: PropTypes.element,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    id: PropTypes.any.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.node,
};

export const ShowView = ({
    actions,
    aside,
    basePath,
    children,
    classes: classesOverride,
    className,
    component: Content,
    defaultTitle,
    hasEdit,
    hasList,
    record,
    resource,
    title,
    version,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    if (typeof actions === 'undefined' && hasEdit) {
        actions = <DefaultActions />;
    }
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
            {actions &&
                cloneElement(actions, {
                    basePath,
                    data: record,
                    hasList,
                    hasEdit,
                    resource,
                    //  Ensure we don't override any user provided props
                    ...actions.props,
                })}
            <div
                className={classnames(classes.main, {
                    [classes.noActions]: !actions,
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
    actions,
    aside,
    title,
    children,
    className,
    id,
    data,
    loading,
    loaded,
    resource,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    version,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    translate,
    ...rest
}) => rest;

export default Show;
