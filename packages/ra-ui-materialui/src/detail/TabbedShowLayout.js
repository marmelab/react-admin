import * as React from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useRouteMatch } from 'react-router-dom';
import { escapePath } from 'ra-core';

import TabbedShowLayoutTabs, { getTabFullPath } from './TabbedShowLayoutTabs';

const sanitizeRestProps = ({
    children,
    className,
    record,
    resource,
    basePath,
    scrollable,
    version,
    initialValues,
    staticContext,
    translate,
    tabs,
    ...rest
}) => rest;

const useStyles = makeStyles(
    theme => ({
        content: {
            paddingTop: props =>
                props.scrollable ? 48 + theme.spacing(1) : theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        scrollableDivider: {
            marginTop: 48,
            position: 'absolute',
            width: '100%',
        },
        scrollableTabs: {
            position: 'absolute',
            width: '100%',
        },
        formRelative: {
            position: 'relative',
        },
    }),
    { name: 'RaTabbedShowLayout' }
);

/**
 * Tabbed Layout for a Show view, showing fields grouped in tabs.
 *
 * Receives the current `record` from the parent `<Show>` component,
 * and passes it to its childen. Children should be Tab components.
 * The component passed as `tabs` props replaces the default material-ui's <Tabs> component.
 *
 * @example
 *     // in src/posts.js
 *     import * as React from "react";
 *     import { Show, TabbedShowLayout, Tab, TextField } from 'react-admin';
 *
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <TabbedShowLayout>
 *                 <Tab label="Content">
 *                     <TextField source="title" />
 *                     <TextField source="subtitle" />
 *                </Tab>
 *                 <Tab label="Metadata">
 *                     <TextField source="category" />
 *                </Tab>
 *             </TabbedShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import * as React from "react";
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
const TabbedShowLayout = props => {
    const {
        basePath,
        children,
        classes: classesOverride,
        className,
        record,
        resource,
        scrollable,
        version,
        value,
        tabs,
        ...rest
    } = props;
    const match = useRouteMatch();

    const classes = useStyles(props);

    const scrollableProps = scrollable
        ? { scrollable: true, scrollButtons: 'on', variant: 'scrollable' }
        : {};

    return (
        <div
            className={classnames(className, classes.formRelative)}
            key={version}
            {...sanitizeRestProps(rest)}
        >
            {cloneElement(tabs, { classes, ...scrollableProps }, children)}

            <Divider
                className={classnames({
                    [classes.scrollableDivider]: scrollable,
                })}
            />
            <div className={classes.content}>
                {Children.map(children, (tab, index) =>
                    tab && isValidElement(tab) ? (
                        <Route
                            exact
                            path={escapePath(
                                getTabFullPath(tab, index, match.url)
                            )}
                            render={() =>
                                cloneElement(tab, {
                                    context: 'content',
                                    resource,
                                    record,
                                    basePath,
                                })
                            }
                        />
                    ) : null
                )}
            </div>
        </div>
    );
};

TabbedShowLayout.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    location: PropTypes.object,
    match: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    scrollable: PropTypes.bool,
    value: PropTypes.number,
    version: PropTypes.number,
    tabs: PropTypes.element,
};

TabbedShowLayout.defaultProps = {
    tabs: <TabbedShowLayoutTabs />,
    scrollable: true,
};

export default TabbedShowLayout;
