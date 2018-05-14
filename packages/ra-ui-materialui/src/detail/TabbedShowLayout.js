import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

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
        const {
            children,
            className,
            classes,
            record,
            resource,
            basePath,
            version,
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
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                >
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
    className: PropTypes.string,
    classes: PropTypes.object,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    version: PropTypes.number,
    translate: PropTypes.func,
};

const enhance = withStyles(styles);

export default enhance(TabbedShowLayout);
