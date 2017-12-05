import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Tabs from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

import getDefaultValues from '../form/getDefaultValues';

const styles = {
    tab: { padding: '0 1em 1em 1em' },
};

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
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { children, classes, record, resource, basePath } = this.props;
        return (
            <div>
                <Tabs value={this.state.value} onChange={this.handleChange}>
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab &&
                            cloneElement(tab, {
                                context: 'header',
                                value: index,
                            })
                    )}
                </Tabs>
                <Divider />
                <div className={classes.tab}>
                    {Children.map(
                        children,
                        (tab, index) =>
                            tab &&
                            this.state.value === index &&
                            cloneElement(tab, {
                                context: 'content',
                                resource,
                                record,
                                basePath,
                            })
                    )}
                </div>
            </div>
        );
    }
}

TabbedShowLayout.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    contentContainerStyle: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
};

TabbedShowLayout.defaultProps = {
    contentContainerStyle: { borderTop: 'solid 1px #e0e0e0' },
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    withStyles(styles)
);

export default enhance(TabbedShowLayout);
