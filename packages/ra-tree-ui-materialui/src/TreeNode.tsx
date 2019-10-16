import React, {
    Component,
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ComponentType,
} from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import classnames from 'classnames';
import ListItem from '@material-ui/core/ListItem';
import {
    withStyles,
    WithStyles,
    Theme,
    StyleRules,
} from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';
import {
    crudGetTreeChildrenNodes as crudGetTreeChildrenNodesAction,
    crudMoveNode as crudMoveNodeAction,
    getIsExpanded,
    getIsLoading,
    getChildrenNodes,
    toggleNode as toggleNodeAction,
} from 'ra-tree-core';
import {
    withTranslate,
    Record,
    Identifier,
    Translate,
    startUndoable as startUndoableAction,
} from 'ra-core';

import {
    DragSource,
    DropTarget,
    ConnectDragSource,
    ConnectDropTarget,
    DropTargetMonitor,
    DragSourceMonitor,
    DragSourceConnector,
    DropTargetConnector,
} from 'react-dnd';

import TreeNodeList from './TreeNodeList';
import TreeNodeIcon from './TreeNodeIcon';
import getMousePosition, { MousePosition } from './getMousePosition';

interface Props {
    actions?: ReactElement<any>;
    className?: string;
    canDrag?: (record: Record) => boolean;
    canDrop?: (data: { dropTarget: Record; dragSource: Record }) => boolean;
    undoable?: boolean;
}

interface InjectedProps {
    basePath: string;
    crudGetTreeChildrenNodes: typeof crudGetTreeChildrenNodesAction;
    crudMoveNode: typeof crudMoveNodeAction;
    expanded: boolean;
    hasCreate: boolean;
    hasEdit: boolean;
    hasList: boolean;
    hasShow: boolean;
    loading: boolean;
    nodeChildren: ReactElement<any>;
    nodes: Identifier[];
    parentSource: string;
    positionSource: string;
    record: Record;
    resource: string;
    startUndoable: typeof startUndoableAction;
    toggleNode: typeof toggleNodeAction;
    translate: Translate;
}

interface InjectedByDndProps {
    canDrag: boolean;
    canDrop: boolean;
    connectDragSource: ConnectDragSource;
    connectDropTarget: ConnectDropTarget;
    isDragging: boolean;
    isOver: boolean;
    isOverCurrent: boolean;
}

class TreeNodeView extends Component<
    Props & InjectedProps & InjectedByDndProps & WithStyles<typeof styles>
> {
    componentDidMount() {
        this.fetchChildren();
    }

    componentDidUpdate(prevProps) {
        // Automatically expand the node when dragging another node over it
        if (
            !this.props.expanded &&
            (this.props.isOverCurrent ||
                (this.props.isOver && !!this.props.positionSource)) &&
            !this.props.isDragging
        ) {
            this.handleClick();
        }

        if (!isEqual(this.props.record, prevProps.record)) {
            this.fetchChildren();
        }
    }

    handleClick = () => {
        this.props.toggleNode({
            resource: this.props.resource,
            nodeId: this.props.record.id,
        });

        // If the node wasn't expanded, the previous line is actually requesting
        // it to expand, so we reload its children to be sure they are up to date
        if (!this.props.expanded) {
            this.fetchChildren();
        }
    };

    fetchChildren = () => {
        const {
            crudGetTreeChildrenNodes,
            parentSource,
            positionSource,
            record,
            resource,
        } = this.props;

        // eslint-disable-next-line eqeqeq
        if (record && record.id != undefined) {
            crudGetTreeChildrenNodes({
                resource,
                parentSource,
                positionSource,
                nodeId: record.id,
            });
        }
    };

    render() {
        const {
            actions,
            basePath,
            canDrag,
            canDrop,
            children,
            className,
            classes,
            connectDragSource,
            connectDropTarget,
            crudGetTreeChildrenNodes,
            crudMoveNode,
            expanded,
            hasCreate,
            hasEdit,
            hasList,
            hasShow,
            isDragging,
            isOver,
            isOverCurrent,
            loading,
            nodeChildren,
            nodes,
            parentSource,
            positionSource,
            record,
            resource,
            startUndoable,
            toggleNode,
            translate,
            undoable,
            ...props
        } = this.props;

        if (!record) {
            return null;
        }

        // The children value for this node may be false (indicating we fetched them but found none)
        // We don't want to show the loading indicator all the time, only on the first fetch
        const showLoading =
            loading && (Array.isArray(nodes) && nodes.length === 0);

        return connectDropTarget(
            connectDragSource(
                <li
                    className={classnames({
                        [classes.draggedOver]:
                            canDrop &&
                            (isOverCurrent || (isOver && !!positionSource)),
                        // This is a hack to cancel styles added dynamically on hover by our react-dnd target,
                        // which are not correctly removed once the dragged item leaves this node
                        [classes.resetDraggedOver]: !isOverCurrent,
                    })}
                    data-position={record[positionSource]}
                    {...props}
                >
                    <ListItem
                        className={classnames(classes.root, className)}
                        divider={!expanded}
                        component="div"
                    >
                        <div className={classes.container}>
                            <TreeNodeIcon
                                expanded={expanded}
                                loading={showLoading}
                                hasChildren={nodes && nodes.length > 0}
                                onClick={this.handleClick}
                            />
                            <div className={classes.content}>
                                {Children.map(children, child =>
                                    isValidElement(child)
                                        ? cloneElement<any>(child, {
                                              basePath,
                                              record,
                                          })
                                        : null
                                )}
                                {actions && isValidElement<any>(actions)
                                    ? cloneElement<any>(actions, {
                                          basePath,
                                          parentSource,
                                          positionSource,
                                          record,
                                          resource,
                                          ...actions.props,
                                      })
                                    : null}
                            </div>
                        </div>
                        {expanded ? (
                            <TreeNodeList
                                basePath={basePath}
                                hasCreate={hasCreate}
                                hasEdit={hasEdit}
                                hasList={hasList}
                                hasShow={hasShow}
                                nodes={nodes}
                                parentSource={parentSource}
                                positionSource={positionSource}
                                resource={resource}
                            >
                                {nodeChildren}
                            </TreeNodeList>
                        ) : null}
                    </ListItem>
                </li>
            )
        );
    }
}

const styles = (theme: Theme): StyleRules => ({
    root: {
        display: 'inline-block',
        verticalAlign: 'middle',
        paddingRight: 0,
    },
    draggedOver: {
        backgroundColor: theme.palette.action.hover,
    },
    resetDraggedOver: {
        '&.draggedAbove': {
            borderTopStyle: 'none',
        },
        '&.draggedBelow': {
            borderBottomStyle: 'none',
        },
    },
    draggedAbove: {
        borderTopWidth: 2,
        borderTopStyle: 'solid',
        borderTopColor: theme.palette.action.active,
    },
    draggedBelow: {
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.action.active,
    },
    container: {
        alignItems: 'center',
        display: 'flex',
        verticalAlign: 'middle',
    },
    content: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
    },
});

const mapStateToProps = (state, { record, resource }) => {
    const hasRecord = record && record.id != undefined; // eslint-disable-line eqeqeq

    return {
        expanded: hasRecord ? getIsExpanded(state, resource, record.id) : false,
        loading: hasRecord ? getIsLoading(state, resource, record.id) : false,
        nodes: hasRecord ? getChildrenNodes(state, resource, record.id) : [],
    };
};

// This object contains the react-dnd drop target specification
// See https://react-dnd.github.io/react-dnd/docs/api/drop-target
const nodeTarget = {
    canDrop(props: Props & InjectedProps, monitor: DropTargetMonitor) {
        const { record: draggedRecord } = monitor.getItem();
        const isJustOverThisOne = monitor.isOver({ shallow: true });
        const canDrop = props.canDrop
            ? props.canDrop({
                  dropTarget: props.record,
                  dragSource: draggedRecord,
              })
            : true;
        const isNotDroppingOverItself = props.record.id !== draggedRecord.id;

        return isJustOverThisOne && canDrop && isNotDroppingOverItself;
    },

    // This function is call when a node is dragged over another one
    // It is called for every mouse moves and we use it when nodes are ordered
    // to show lines above or under depending on the mouse position
    hover(
        props: Props & InjectedProps & WithStyles<typeof styles>,
        monitor: DropTargetMonitor,
        component
    ) {
        // If nodes are not ordered we have nothing to do
        if (!props.positionSource) {
            return;
        }

        const domNode = findDOMNode(component) as HTMLElement;

        const item = monitor.getItem();
        const canDrop = monitor.canDrop();
        const isOverCurrent = monitor.isOver({ shallow: true });

        let droppedPosition: MousePosition = 'none';

        // If the draggged node is over a child of this node, we have nothing to do
        if (!isOverCurrent) {
            return;
        }

        if (item && canDrop) {
            // Determine rectangle on screen
            const hoverBoundingRect = domNode.getBoundingClientRect();
            // Determine mouse position
            const mousePosition = monitor.getClientOffset();

            droppedPosition = getMousePosition(
                hoverBoundingRect,
                mousePosition
            );
        }

        switch (droppedPosition) {
            case 'above': {
                domNode.classList.remove(props.classes.draggedBelow);
                domNode.classList.add(props.classes.draggedAbove);
                break;
            }
            case 'below': {
                domNode.classList.remove(props.classes.draggedAbove);
                domNode.classList.add(props.classes.draggedBelow);
                break;
            }
            default:
                domNode.classList.remove(props.classes.draggedAbove);
                domNode.classList.remove(props.classes.draggedBelow);
                break;
        }
    },

    // This function is called when a node is dropped over the current one
    drop(props: Props & InjectedProps, monitor: DropTargetMonitor, component) {
        if (monitor.didDrop()) {
            return;
        }

        const { record: draggedRecord } = monitor.getItem();

        const domNode = findDOMNode(component) as HTMLElement;
        // Determine rectangle on screen
        const hoverBoundingRect = domNode.getBoundingClientRect();
        // Determine mouse position
        const mousePosition = monitor.getClientOffset();
        const droppedPosition = getMousePosition(
            hoverBoundingRect,
            mousePosition
        );

        // If the item was dropped over the component, its record will be the new parent of the item,
        // otherwise the parent will be the record's parent
        const nodeParent =
            droppedPosition === 'over'
                ? props.record.id
                : props.record[props.parentSource];

        const nodePosition = !props.positionSource
            ? undefined
            : droppedPosition === 'above'
            ? props.record[props.positionSource]
            : droppedPosition === 'below'
            ? props.record[props.positionSource]
            : props.nodes.length - 1;

        const actionPayload = {
            resource: props.resource,
            data: {
                ...draggedRecord,
                [props.parentSource]: nodeParent,
                [props.positionSource]: nodePosition,
            },
            parentSource: props.parentSource,
            positionSource: props.positionSource,
            previousData: draggedRecord,
            basePath: props.basePath,
            refresh: false,
            redirectTo: undefined,
        };

        if (props.undoable) {
            props.startUndoable(crudMoveNodeAction(actionPayload));
        } else {
            props.crudMoveNode(actionPayload);
        }
    },
};

const collectDropTarget = (
    connect: DropTargetConnector,
    monitor: DropTargetMonitor
) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
});

// This object contains the react-dnd drag source specification
// See https://react-dnd.github.io/react-dnd/docs/api/drag-source
const nodeSource = {
    canDrag(props) {
        return props.canDrag ? props.canDrag(props.record) : true;
    },

    isDragging(props: Props & InjectedProps, monitor: DragSourceMonitor) {
        return monitor.getItem().record.id === props.record.id;
    },

    beginDrag(props: Props & InjectedProps, monitor, component) {
        // Returns the node record as the item being dragged
        // It will be returned for every call to monitor.getItem()
        return { record: props.record, component };
    },
};

const collectDragSource = (
    connect: DragSourceConnector,
    monitor: DragSourceMonitor
) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});

const TreeNode = compose(
    connect(
        mapStateToProps,
        {
            crudGetTreeChildrenNodes: crudGetTreeChildrenNodesAction,
            crudMoveNode: crudMoveNodeAction,
            startUndoable: startUndoableAction,
            toggleNode: toggleNodeAction,
        }
    ),
    withStyles(styles),
    DropTarget('TREE_NODE', nodeTarget, collectDropTarget),
    DragSource('TREE_NODE', nodeSource, collectDragSource),
    withTranslate
)(TreeNodeView) as ComponentType<Props>;

TreeNode.defaultProps = {
    undoable: true,
};

export default TreeNode;
