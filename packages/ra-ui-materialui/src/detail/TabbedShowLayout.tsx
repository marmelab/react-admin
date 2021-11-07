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
import { styled } from '@mui/material/styles';
import { Card, Divider } from '@mui/material';
import { Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import {
    escapePath,
    Record,
    useRecordContext,
    useResourceContext,
} from 'ra-core';

import {
    TabbedShowLayoutTabs,
    getShowLayoutTabFullPath,
} from './TabbedShowLayoutTabs';

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
        className,
        syncWithLocation = true,
        tabs = DefaultTabs,
        value,
        version,
        ...rest
    } = props;
    const match = useRouteMatch();
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const nonNullChildren = Children.toArray(children).filter(
        child => child !== null
    );
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: ChangeEvent<{}>, value: any): void => {
        if (!syncWithLocation) {
            setTabValue(value);
        }
    };

    if (!record) {
        return null;
    }
    return (
        <Root className={className} key={version} {...sanitizeRestProps(rest)}>
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
            <div className={TabbedShowLayoutClasses.content}>
                {Children.map(nonNullChildren, (tab, index) =>
                    tab && isValidElement(tab) ? (
                        syncWithLocation ? (
                            <Route
                                exact
                                path={escapePath(
                                    getShowLayoutTabFullPath(
                                        tab,
                                        index,
                                        match.url
                                    )
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
        </Root>
    );
};

export interface TabbedShowLayoutProps {
    basePath?: string;
    className?: string;

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

const DefaultTabs = <TabbedShowLayoutTabs />;

const PREFIX = 'RaTabbedShowLayout';

export const TabbedShowLayoutClasses = {
    content: `${PREFIX}-content`,
};

const Root = styled(Card, { name: PREFIX })(({ theme }) => ({
    flex: 1,
    [`& .${TabbedShowLayoutClasses.content}`]: {
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
}));

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
