import React, { Children, cloneElement, isValidElement, SFC } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import { TreeController } from 'ra-tree-core';

export const styles = createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    draggable: {
        overflow: 'auto',
    },
});

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

export const Tree: SFC<WithStyles<typeof styles>> = ({
    children,
    classes,
    ...props
}) => {
    const childrenCount = Children.count(children);

    if (childrenCount > 1 && process.env.NODE_ENV !== 'production') {
        warnAboutChildren();
    }

    if (!isValidElement(children)) {
        return null;
    }

    return (
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
    );
};

Tree.defaultProps = {
    classes: {
        draggable: '',
        root: '',
    },
};

// @ts-ignore
const EnhancedTree = withStyles(styles)(Tree);

// @ts-ignore
EnhancedTree.propTypes = {
    children: PropTypes.element,
    parentSource: PropTypes.string,
};

EnhancedTree.defaultProps = {
    parentSource: 'parent_id',
};

export default EnhancedTree;
