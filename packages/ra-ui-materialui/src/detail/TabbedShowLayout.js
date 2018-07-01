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
                    value={location.pathname}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                >
                    {Children.map(children, (tab, index) => {
                        if (!tab) return null;
                        const tabPath = `${match.url}${tab.props.path
                            ? `/${tab.props.path}`
                            : index > 0 ? `/${index}` : ''}`;

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
                                    path={`${match.url}/${tab.props.path ||
                                        (index > 0 ? index : '')}`}
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
