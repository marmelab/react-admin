import React, { Component, Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import { withRouter, Route } from 'react-router-dom';
import compose from 'recompose/compose';
import { translate } from 'ra-core';

import CardContentInner from '../layout/CardContentInner';
import TabbedShowLayoutTabs from './TabbedShowLayoutTabs';

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
}) => rest;

const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${tab.props.path ? `/${tab.props.path}` : index > 0 ? `/${index}` : ''}`;

/**
 * Tabbed Layout for a Show view, showing fields grouped in tabs.
 *
 * Receives the current `record` from the parent `<Show>` component,
 * and passes it to its childen. Children should be Tab components.
 * The component passed as `tabs` props replaces the default material-ui's <Tabs> component.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
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
 *     import React from 'react';
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
export class TabbedShowLayout extends Component {
    render() {
        const {
            basePath,
            children,
            className,
            location,
            match,
            record,
            resource,
            translate,
            version,
            value,
            tabs,
            ...rest
        } = this.props;

        return (
            <div className={className} key={version} {...sanitizeRestProps(rest)}>
                {cloneElement(
                    tabs,
                    {
                        // The location pathname will contain the page path including the current tab path
                        // so we can use it as a way to determine the current tab
                        value: location.pathname,
                        match,
                    },
                    children
                )}
                <Divider />
                <CardContentInner>
                    {Children.map(children, (tab, index) =>
                        tab && isValidElement(tab) ? (
                            <Route
                                exact
                                path={getTabFullPath(tab, index, match.url)}
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
                </CardContentInner>
            </div>
        );
    }
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
    translate: PropTypes.func,
    tabs: PropTypes.element.isRequired,
};

TabbedShowLayout.defaultProps = {
    tabs: <TabbedShowLayoutTabs />,
};

const enhance = compose(
    withRouter,
    translate
);

export default enhance(TabbedShowLayout);
