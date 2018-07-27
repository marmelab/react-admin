import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import { getIsNodeExpanded } from './reducers';
import { toggleNode as toggleNodeAction } from './actions';
import getRecordFromNode from './getRecordFromNode';
import TreeNode from './TreeNode';
import TreeNodeContent from './TreeNodeContent';

class TreeNodeWithChildrenView extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        classes: PropTypes.object,
        expanded: PropTypes.bool,
        node: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        resource: PropTypes.string.isRequired,
        toggleNode: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
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
            onChange,
            resource,
            theme,
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
                        form={`treeview-node-${node.id}`}
                        initialValues={getRecordFromNode(node)}
                        node={node}
                        onSubmit={onChange}
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
                                onChange={onChange}
                                resource={resource}
                                theme={theme}
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
