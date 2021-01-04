import * as React from 'react';
import {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch } from 'react-router-dom';
import { escapePath, Record } from 'ra-core';

import TabbedShowLayoutTabs, { getTabFullPath } from './TabbedShowLayoutTabs';
import { ClassesOverride } from '../types';

const sanitizeRestProps = ({
    children,
    className,
    record,
    resource,
    basePath,
    version,
    initialValues,
    staticContext,
    translate,
    tabs,
    ...rest
}: any) => rest;

const useStyles = makeStyles(
    theme => ({
        content: {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
    { name: 'RaTabbedShowLayout' }
);

/**
 * Tabbed Layout for a Show view, showing fields grouped in tabs.
 *
 * Receives the current `record` from the parent `<Show>` component,
 * and passes it to its children. Children should be Tab components.
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
const TabbedShowLayout = (props: TabbedShowLayoutProps) => {
    const {
        basePath,
        children,
        classes: classesOverride,
        className,
        record,
        resource,
        version,
        value,
        tabs,
        ...rest
    } = props;
    const match = useRouteMatch();
    const classes = useStyles(props);
    const nonNullChildren = Children.toArray(children).filter(
        child => child !== null
    );

    return (
        <div className={className} key={version} {...sanitizeRestProps(rest)}>
            {cloneElement(tabs, {}, nonNullChildren)}

            <Divider />
            <div className={classes.content}>
                {Children.map(nonNullChildren, (tab, index) =>
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

export interface TabbedShowLayoutProps {
    basePath?: string;
    className?: string;
    classes?: ClassesOverride<typeof useStyles>;
    children: ReactNode;
    record?: Record;
    resource?: string;
    tabs: ReactElement;
    value?: any;
    version?: number;
}

TabbedShowLayout.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    location: PropTypes.object,
    match: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    value: PropTypes.number,
    version: PropTypes.number,
    tabs: PropTypes.element,
};

TabbedShowLayout.defaultProps = {
    tabs: <TabbedShowLayoutTabs />,
};

export default TabbedShowLayout;
