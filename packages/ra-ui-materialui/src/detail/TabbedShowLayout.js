import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Route } from 'react-router-dom';
import compose from 'recompose/compose';
import { translate } from 'ra-core';

const styles = {
    tab: { padding: '0 1em 1em 1em' },
};

const sanitizeRestProps = ({
    children,
    className,
    classes,
    record,
    resource,
    basePath,
    version,
    initialValues,
    staticContext,
    translate,
    ...rest
}) => rest;

const getTabFullPath = (tab, index, baseUrl) =>
    `${baseUrl}${tab.props.path
        ? `/${tab.props.path}`
        : index > 0 ? `/${index}` : ''}`;

/**
 * Tabbed Layout for a Show view, showing fields grouped in tabs.
 * 
 * Receives the current `record` from the parent `<Show>` component,
 * and passes it to its childen. Children should be Tab components.
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
            classes,
            location,
            match,
            record,
            resource,
            translate,
            version,
            value,
            ...rest
        } = this.props;

        return (
            <div
                className={className}
                key={version}
                {...sanitizeRestProps(rest)}
            >
                <Tabs
                    scrollable
                    // The location pathname will contain the page path including the current tab path
                    // so we can use it as a way to determine the current tab
                    value={location.pathname}
                    indicatorColor="primary"
                >
                    {Children.map(children, (tab, index) => {
                        if (!tab) return null;

                        // Builds the full tab tab which is the concatenation of the last matched route in the
                        // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                        // and the tab path.
                        // This will be used as the Tab's value
                        const tabPath = getTabFullPath(tab, index, match.url);

                        return cloneElement(tab, {
                            context: 'header',
                            value: tabPath,
                        });
                    })}
                </Tabs>
                <Divider />
                <div className={classes.tab}>
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab && (
                                <Route
                                    exact
                                    path={getTabFullPath(tab, index, match.url)}
                                    render={() =>
                                        cloneElement(tab, {
                                            context: 'content',
                                            resource,
                                            record,
                                            basePath,
                                        })}
                                />
                            )
                    )}
                </div>
            </div>
        );
    }
}

TabbedShowLayout.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    value: PropTypes.number,
    version: PropTypes.number,
    translate: PropTypes.func,
};

const enhance = compose(withRouter, withStyles(styles), translate);

export default enhance(TabbedShowLayout);
