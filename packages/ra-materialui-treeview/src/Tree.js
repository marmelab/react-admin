import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    crudCreate as crudCreateAction,
    crudUpdate as crudUpdateAction,
} from '../../react-admin/lib';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import defaultGetTreeFromArray from './getTreeFromArray';

import TreeNode from './TreeNode';

const styles = {
    expandIcon: {
        margin: 0,
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    node: {
        display: 'flex',
    },
    panel: {
        background: 'unset',
        display: 'block',
        flexGrow: 1,
    },
    panelDetails: {
        display: 'block',
        padding: 0,
    },
    panelSummary: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
        padding: 0,
    },
    panelSummaryContent: {
        alignItems: 'center',
        margin: 0,
    },
    panelSummaryExpanded: {
        margin: '0 !important',
    },
};

export class Tree extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        crudCreate: PropTypes.func.isRequired,
        crudUpdate: PropTypes.func.isRequired,
        ids: PropTypes.array.isRequired,
        data: PropTypes.object.isRequired,
        getTreeFromArray: PropTypes.func,
        onChange: PropTypes.func,
        parentSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        classes: {},
        getTreeFromArray: defaultGetTreeFromArray,
        parentSource: 'parent_id',
    };

    handleChange = record => {
        const { basePath, crudUpdate, data, resource } = this.props;

        crudUpdate(
            resource,
            record.id,
            record,
            data[record.id],
            basePath,
            false
        );
    };

    render() {
        const {
            basePath,
            children,
            classes,
            ids,
            data: { fetchedAt, ...data },
            getTreeFromArray,
            parentSource,
            resource,
            theme,
        } = this.props;

        const availableData = ids.reduce((acc, id) => [...acc, data[id]], []);
        const tree = getTreeFromArray(
            Object.values(availableData),
            parentSource
        );

        return (
            <List
                classes={{
                    root: classes.root,
                }}
                dense
                disablePadding
            >
                {tree.map(node => (
                    <TreeNode
                        key={node.id}
                        basePath={basePath}
                        classes={{
                            ...classes,
                            root: classes.node,
                        }}
                        node={node}
                        onChange={this.handleChange}
                        resource={resource}
                        theme={theme}
                    >
                        {children}
                    </TreeNode>
                ))}
            </List>
        );
    }
}

const mapDispatchToProps = {
    crudCreate: crudCreateAction,
    crudUpdate: crudUpdateAction,
};

export default connect(
    undefined,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Tree));
