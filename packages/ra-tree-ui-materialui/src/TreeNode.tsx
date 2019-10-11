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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    XYCoord,
} from 'react-dnd';

import TreeNodeList from './TreeNodeList';

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
        if (this.props.record && this.props.record.id) {
            this.props.crudGetTreeChildrenNodes({
                resource: this.props.resource,
                parentSource: this.props.parentSource,
                positionSource: this.props.positionSource,
                nodeId: this.props.record.id,
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
                    // This is a hack to cancel styles added dynamically on hover which
                    // are not correctly removed once the dragged item leaves this node
                    className={classnames({
                        [classes.draggedOver]:
                            canDrop &&
                            (isOverCurrent || (isOver && !!positionSource)),
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
                            <ListItemIcon>
                                {showLoading ? (
                                    <div className={classes.icon}>
                                        <CircularProgress size="1em" />
                                    </div>
                                ) : nodes || nodes.length === 0 ? (
                                    <IconButton
                                        className={classes.button}
                                        aria-label={translate(
                                            expanded
                                                ? 'ra.tree.close'
                                                : 'ra.tree.expand'
                                        )}
                                        title={translate(
                                            expanded
                                                ? 'ra.tree.close'
                                                : 'ra.tree.expand'
                                        )}
                                        onClick={this.handleClick}
                                    >
                                        {expanded ? (
                                            <KeyboardArrowDown />
                                        ) : (
                                            <KeyboardArrowRight />
                                        )}
                                    </IconButton>
                                ) : (
                                    <KeyboardArrowRight
                                        className={classes.invisible}
                                    />
                                )}
                            </ListItemIcon>
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
    button: {
        height: theme.spacing.unit * 3,
        width: theme.spacing.unit * 3,
    },
    icon: {
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        fontSize: '1.5rem',
        height: theme.spacing.unit * 3,
        justifyContent: 'baseline',
        position: 'relative',
        verticalAlign: 'middle',
        width: theme.spacing.unit * 3,
    },
    invisible: {
        opacity: 0,
    },
});

const mapStateToProps = (state, { record, resource }) => ({
    expanded:
        record && record.id ? getIsExpanded(state, resource, record.id) : false,
    loading:
        record && record.id ? getIsLoading(state, resource, record.id) : false,
    nodes:
        record && record.id ? getChildrenNodes(state, resource, record.id) : [],
});

type DroppedPosition = 'above' | 'below' | 'over' | 'none';

const getDroppedPosition = (
    boundingRect: ClientRect,
    mousePosition: XYCoord
): DroppedPosition => {
    // Get vertical middle
    const hoverMiddleY = (boundingRect.bottom - boundingRect.top) / 2;

    // Get pixels to the top
    const hoverClientY = mousePosition.y - boundingRect.top;
    const percentage = (hoverMiddleY - hoverClientY) / boundingRect.height;

    const isAbove = percentage > 0.25;
    const isBelow = percentage < -0.25;

    return isAbove ? 'above' : isBelow ? 'below' : 'over';
};

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

    hover(
        props: Props & InjectedProps & WithStyles<typeof styles>,
        monitor: DropTargetMonitor,
        component
    ) {
        const domNode = findDOMNode(component) as HTMLElement;

        const item = monitor.getItem();
        const canDrop = monitor.canDrop();
        const isOverCurrent = monitor.isOver({ shallow: true });

        let droppedPosition: DroppedPosition = 'none';

        if (item && isOverCurrent && !!props.positionSource && canDrop) {
            // Determine rectangle on screen
            const hoverBoundingRect = domNode.getBoundingClientRect();
            // Determine mouse position
            const mousePosition = monitor.getClientOffset();

            droppedPosition = getDroppedPosition(
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
        const droppedPosition = getDroppedPosition(
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
