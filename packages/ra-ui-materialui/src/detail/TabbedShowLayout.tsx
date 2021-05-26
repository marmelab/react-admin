import * as React from 'react';
import {
    ChangeEvent,
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch } from 'react-router-dom';
import { escapePath, Record } from 'ra-core';

import { TabbedShowLayoutTabs, getTabFullPath } from './TabbedShowLayoutTabs';
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
export const TabbedShowLayout = (props: TabbedShowLayoutProps) => {
    const {
        basePath,
        children,
        classes: classesOverride,
        className,
        record,
        resource,
        syncWithLocation = true,
        tabs,
        value,
        version,
        ...rest
    } = props;
    const match = useRouteMatch();
    const classes = useStyles(props);
    const nonNullChildren = Children.toArray(children).filter(
        child => child !== null
    );
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: ChangeEvent<{}>, value: any): void => {
        if (!syncWithLocation) {
            setTabValue(value);
        }
    };

    return (
        <div className={className} key={version} {...sanitizeRestProps(rest)}>
            {cloneElement(
                tabs,
                {
                    syncWithLocation,
                    onChange: handleTabChange,
                    value: tabValue,
                },
                nonNullChildren
            )}

            <Divider />
            <div className={classes.content}>
                {Children.map(nonNullChildren, (tab, index) =>
                    tab && isValidElement(tab) ? (
                        syncWithLocation ? (
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
                        ) : tabValue === index ? (
                            cloneElement(tab, {
                                context: 'content',
                                resource,
                                record,
                                basePath,
                            })
                        ) : null
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
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    value?: any;
    version?: number;
}

TabbedShowLayout.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    location: PropTypes.object,
    match: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    syncWithLocation: PropTypes.bool,
    tabs: PropTypes.element,
    value: PropTypes.number,
    version: PropTypes.number,
};

TabbedShowLayout.defaultProps = {
    tabs: <TabbedShowLayoutTabs />,
};
