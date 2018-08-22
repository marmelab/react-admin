import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { TreeContext } from 'ra-tree-core';

export class TreeNodeWithChildrenView extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        cancelDropOnChildren: PropTypes.bool,
        children: PropTypes.node,
        classes: PropTypes.object,
        isExpanded: PropTypes.bool,
        node: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
        toggleNode: PropTypes.func,
        treeNodeComponent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
        ]),
        treeNodeContentComponent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
        ]).isRequired,
        treeNodeWithChildrenComponent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.func,
        ]),
    };

    handleChange = () => {
        const { toggleNode, node } = this.props;

        toggleNode(node.id);
    };

    render() {
        const {
            basePath,
            cancelDropOnChildren,
            children,
            classes,
            isExpanded,
            node,
            resource,
            toggleNode,
            treeNodeComponent: TreeNode,
            treeNodeWithChildrenComponent,
            treeNodeContentComponent: TreeNodeContent,
            ...props
        } = this.props;

        return (
            <ExpansionPanel
                classes={{
                    root: classes.panel,
                }}
                elevation={0}
                expanded={isExpanded}
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
                        key={`TreeNodeContent${node.id}`}
                        basePath={basePath}
                        node={node}
                        resource={resource}
                        cancelDropOnChildren={cancelDropOnChildren}
                        {...props}
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
                        {node.children.map(child => (
                            <TreeNode
                                key={`TreeNode_${child.id}`}
                                basePath={basePath}
                                classes={classes}
                                node={child}
                                resource={resource}
                                treeNodeComponent={TreeNode}
                                treeNodeWithChildrenComponent={
                                    treeNodeWithChildrenComponent
                                }
                                treeNodeContentComponent={TreeNodeContent}
                                {...props}
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

const TreeNodeWithChildren = ({ isExpanded, ...props }) => (
    <TreeContext.Consumer>
        {({ getIsNodeExpanded, toggleNode }) => (
            <TreeNodeWithChildrenView
                {...props}
                toggleNode={toggleNode}
                isExpanded={isExpanded || getIsNodeExpanded(props.node.id)}
            />
        )}
    </TreeContext.Consumer>
);

TreeNodeWithChildren.propTypes = TreeNodeWithChildrenView.propTypes;

export default TreeNodeWithChildren;
