import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import {
    getIsNodeExpanded,
    toggleNode as toggleNodeAction,
} from 'ra-tree-core';

import TreeNode from './TreeNode';
import TreeNodeContent from './TreeNodeContent';

class TreeNodeWithChildrenView extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        expanded: PropTypes.bool,
        node: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
        toggleNode: PropTypes.func.isRequired,
    };

    handleChange = () => {
        const { toggleNode, node } = this.props;

        toggleNode(node.id);
    };

    render() {
        const {
            basePath,
            children,
            classes,
            expanded,
            node,
            resource,
        } = this.props;

        return (
            <ExpansionPanel
                classes={{
                    root: classes.panel,
                }}
                elevation={0}
                expanded={expanded}
                onChange={this.handleChange}
            >
                <ExpansionPanelSummary
                    classes={{
                        content: classes.panelSummaryContent,
                        expandIcon: classes.expandIcon,
                        root: classes.panelSummary,
                        expanded: classes.panelSummaryExpanded,
                    }}
                    expandIcon={<KeyboardArrowDown />}
                >
                    <TreeNodeContent
                        basePath={basePath}
                        node={node}
                        resource={resource}
                    >
                        {children}
                    </TreeNodeContent>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    classes={{
                        root: classes.panelDetails,
                    }}
                >
                    <List dense>
                        {node.__children.map(child => (
                            <TreeNode
                                key={child.id}
                                basePath={basePath}
                                classes={classes}
                                node={child}
                                resource={resource}
                            >
                                {children}
                            </TreeNode>
                        ))}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

const mapStateToProps = (state, { node }) => ({
    expanded: getIsNodeExpanded(state, node),
});

const TreeNodeWithChildren = connect(
    mapStateToProps,
    { toggleNode: toggleNodeAction }
)(TreeNodeWithChildrenView);

export default TreeNodeWithChildren;
