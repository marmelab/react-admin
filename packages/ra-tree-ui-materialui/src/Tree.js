import React, { Children, Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TreeController } from 'ra-tree-core';

export const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    draggable: {
        overflow: 'auto',
    },
};

const sanitizeRestProps = ({
    currentSort,
    defaultTitle,
    displayedFilters,
    filterValues,
    getTreeState,
    hasBulkActions,
    hasCreate,
    hideFilter,
    isLoading,
    loadedOnce,
    perPage,
    selectedIds,
    setFilters,
    setPage,
    setPerPage,
    setSelectedIds,
    setSort,
    showFilter,
    toggleNode,
    expandNode,
    closeNode,
    onUnselectItems,
    onToggleItem,
    ...rest
}) => rest;

const warnAboutChildren = () =>
    console.warn(
        // eslint-disable-line
        `You passed multiple children to the Tree component. You must pass a single child such as the NodeView:

    <Tree>
        <NodeView>
            <TextField source="name" />
        </NodeView>
    </Tree>

If you need actions on each node, use the actions prop on the NodeView component:

    const MyNodeActions = props => (
        <NodeActions {...props}>
            <EditButton />
            <ShowButton />
            <DeleteButton />
        </NodeActions>
    );

    <Tree>
        <NodeView actions={<MyNodeActions />}>
            <TextField source="name" />
        </NodeView>
    </Tree>
`
    );

export class Tree extends Component {
    componentDidMount() {
        const childrenCount = Children.count(this.props.children);

        if (childrenCount > 1 && process.env.NODE_ENV !== 'production') {
            warnAboutChildren();
        }
    }

    render() {
        const { children, classes, ...props } = this.props;

        return (
            <div>
                <TreeController {...props}>
                    {({ itemProps, controllerProps }) => (
                        <div
                            ref={itemProps.provided.innerRef}
                            {...itemProps.provided.draggableProps}
                        >
                            {cloneElement(children, {
                                ...itemProps,
                                ...sanitizeRestProps(controllerProps),
                            })}
                        </div>
                    )}
                </TreeController>
            </div>
        );
    }
}

Tree.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.node,
    classes: PropTypes.object,
    enableDragAndDrop: PropTypes.bool,
    getTreeFromArray: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
    dragPreviewComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    treeNodeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    treeNodeContentComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
    treeNodeWithChildrenComponent: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func,
    ]),
};

Tree.defaultProps = {
    classes: {},
    parentSource: 'parent_id',
};

export default withStyles(styles)(Tree);
