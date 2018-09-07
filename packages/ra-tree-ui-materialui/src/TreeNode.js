import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    expandIcon: {
        margin: 0,
        left: -theme.spacing.unit * 6,
    },
    root: {
        alignItems: 'baseline',
        display: 'flex',
        padding: 0,
        flexGrow: 1,
    },
    node: {
        alignItems: 'baseline',
        display: 'flex',
        padding: 0,
        flexGrow: 1,
        paddingLeft: theme.spacing.unit * 6,
    },
    leaf: {
        display: 'flex',
        flexGrow: 1,
        margin: 0,
        padding: 0,
        paddingLeft: theme.spacing.unit * 6,
        paddingRight: theme.spacing.unit * 4,
        position: 'relative',
    },

    panel: {
        background: 'transparent',
        display: 'block',
        flexGrow: 1,
        margin: 0,
    },
    panelDetails: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
    },
    panelSummary: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 0,
        padding: 0,
    },
    panelSummaryExpanded: {
        margin: 0,
    },
    panelSummaryContent: {
        alignItems: 'center',
        margin: 0,

        // JSS notation to reference another class (here panelSummaryExpanded)
        '&$panelSummaryExpanded': {
            margin: 0,
        },
    },
    handle: {
        cursor: 'drag',
        alignItems: 'center',
        display: 'flex',
        marginRight: theme.spacing.unit * 2,
    },
    draggingOver: {
        background: theme.palette.action.hover,
    },
});

class TreeNode extends Component {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        canDrop: PropTypes.bool,
        children: PropTypes.node,
        classes: PropTypes.object,
        closeNode: PropTypes.func,
        connectDropTarget: PropTypes.func,
        expandNode: PropTypes.func,
        getIsNodeExpanded: PropTypes.func,
        isOver: PropTypes.bool,
        isOverCurrent: PropTypes.bool,
        itemType: PropTypes.string,
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

    static defaultProps = {
        connectDropTarget: target => target,
    };

    handleDrop = event => {
        if (this.props.isOver && this.props.canDrop) {
            event.persit();
            event.preventDefault();
        }
    };

    render() {
        const {
            basePath,
            canDrop,
            children,
            classes,
            closeNode,
            connectDropTarget,
            expandNode,
            getIsNodeExpanded,
            isOver,
            isOverCurrent,
            itemType,
            node,
            resource,
            treeNodeComponent,
            treeNodeWithChildrenComponent: TreeNodeWithChildren,
            treeNodeContentComponent: TreeNodeContent,
            toggleNode,
            ...props
        } = this.props;
        return connectDropTarget(
            <div className={classes.root}>
                <ListItem
                    button
                    classes={{
                        root: classNames({
                            [classes.node]: node.children.length > 0,
                            [classes.leaf]: node.children.length === 0,
                            [classes.draggingOver]: isOverCurrent,
                        }),
                    }}
                    dense
                    disableGutters
                >
                    {node.children.length > 0 ? (
                        <TreeNodeWithChildren
                            key={`TreeNodeWithChildren${node.id}`}
                            basePath={basePath}
                            cancelDropOnChildren={!!itemType}
                            classes={classes}
                            closeNode={closeNode}
                            expandNode={expandNode}
                            getIsNodeExpanded={getIsNodeExpanded}
                            /*
                            Override the isExpanded prop managed through redux on hover.
                            Set it to undefined when not hovering to fall back to redux state
                            so that it stay expanded if it was before
                        */
                            isExpanded={isOver && canDrop ? true : undefined}
                            node={node}
                            resource={resource}
                            treeNodeComponent={treeNodeComponent}
                            treeNodeWithChildrenComponent={TreeNodeWithChildren}
                            treeNodeContentComponent={TreeNodeContent}
                            toggleNode={toggleNode}
                            {...props}
                        >
                            {children}
                        </TreeNodeWithChildren>
                    ) : (
                        <Fragment>
                            <TreeNodeContent
                                key={`TreeNodeContent_${node.id}`}
                                basePath={basePath}
                                node={node}
                                resource={resource}
                                isLeaf={true}
                                cancelDropOnChildren={!!itemType}
                                onDrop={this.handleDrop}
                                classes={{
                                    handle: classes.handle,
                                }}
                                {...props}
                            >
                                {children}
                            </TreeNodeContent>
                        </Fragment>
                    )}
                </ListItem>
            </div>
        );
    }
}

export default withStyles(styles)(TreeNode);
