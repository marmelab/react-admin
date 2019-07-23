import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Identifier, Record, Dispatch } from 'ra-core';

import TreeUI from '@atlaskit/tree';

import defaultGetTreeFromArray from './getTreeFromArray';
import { getIsNodeExpanded, getTree } from './selectors';
import {
    closeNode as closeNodeAction,
    expandNode as expandNodeAction,
    toggleNode as toggleNodeAction,
    crudGetRootNodes as crudGetRootNodesAction,
    crudGetLeafNodes as crudGetLeafNodesAction,
} from './actions';
import { Tree } from './types';

interface TreeControllerChildrenProps {
    itemProps: any;
    controllerProps: any;
}

type TreeControllerChildren = (props: TreeControllerChildrenProps) => ReactNode;

interface Props {
    basePath: string;
    className: string;
    defaultTitle: string;
    enableDragAndDrop: boolean;
    hasCreate: boolean;
    expandedNodeIds: Identifier[];
    isLoading: boolean;
    loadedOnce: boolean;
    resource: string;
    treeState: any;
    closeNode: (resource: string, id: Identifier) => void;
    expandNode: (resource: string, id: Identifier) => void;
    toggleNode: (resource: string, id: Identifier) => void;
    getTreeFromArray: (
        data: any[],
        parentSource: string,
        expandedNodeIds: any[]
    ) => any;
    getTreeState: (state: any) => any;
    parentSource: string;
    positionSource?: string;
    children: TreeControllerChildren;
    onDragEnd: (record: Record, originalData: Record) => void;
}

interface EnhancedProps {
    crudGetRootNodes: Dispatch<typeof crudGetRootNodesAction>;
    crudGetLeafNodes: Dispatch<typeof crudGetLeafNodesAction>;
    isLoading: boolean;
    loadedOnce?: boolean;
    tree: Tree;
    version?: number;
}

export class TreeControllerView extends Component<Props & EnhancedProps> {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
        closeNode: PropTypes.func.isRequired,
        expandNode: PropTypes.func.isRequired,
        getTreeFromArray: PropTypes.func,
        getTreeState: PropTypes.func,
        parentSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
        toggleNode: PropTypes.func.isRequired,
        treeState: PropTypes.object,
        tree: PropTypes.object,
    };

    componentDidMount() {
        this.updateData();
    }

    componentWillReceiveProps(nextProps: Props & EnhancedProps) {
        if (
            nextProps.resource !== this.props.resource ||
            nextProps.version !== this.props.version
        ) {
            this.updateData();
        }
    }

    updateData() {
        this.props.crudGetRootNodes(this.props.resource);
    }

    handleGetIsNodeExpanded = nodeId =>
        getIsNodeExpanded(this.props.treeState, this.props.resource, nodeId);

    handleCollapseNode = nodeId =>
        this.props.closeNode(this.props.resource, nodeId);

    handleExpandNode = nodeId => {
        this.props.expandNode(this.props.resource, nodeId);
        this.props.crudGetLeafNodes(this.props.resource, nodeId);
    };

    handleToggleNode = nodeId =>
        this.props.toggleNode(this.props.resource, nodeId);

    onDragEnd = (source, destination) => {
        // if (!destination) {
        //     return;
        // }
        // const { ids, data, parentSource } = this.props;
        // const availableData = ids.reduce((acc, id) => acc.concat(data[id]), []);
        // const parentId =
        //     source.parentId === DEFAULT_TREE_ROOT_ID
        //         ? undefined
        //         : source.parentId;
        // const draggedItem = availableData.filter(
        //     item => item[parentSource] == parentId
        // )[source.index];
    };

    renderItem = itemProps => {
        const {
            children,
            expandedNodeIds,
            getTreeFromArray,
            parentSource,
            enableDragAndDrop,
            crudGetLeafNodes,
            crudGetRootNodes,
            ...props
        } = this.props;
        return children({ itemProps, controllerProps: props });
    };

    render() {
        const {
            children,
            closeNode,
            crudGetRootNodes,
            expandNode,
            enableDragAndDrop,
            expandedNodeIds,
            getTreeFromArray,
            getTreeState,
            parentSource,
            resource,
            toggleNode,
            treeState,
            tree,
            ...props
        } = this.props;

        if (!tree) {
            return null;
        }

        return (
            <TreeUI
                tree={tree}
                renderItem={this.renderItem}
                onExpand={this.handleExpandNode}
                onCollapse={this.handleCollapseNode}
                onDragEnd={this.onDragEnd}
                isDragEnabled={enableDragAndDrop}
                isNestingEnabled={enableDragAndDrop}
                {...props}
            />
        );
    }
}

const mapStateToProps = (
    state,
    { getTreeFromArray, parentSource, resource }
) => {
    return {
        tree: getTree(state, resource, parentSource, getTreeFromArray),
        isLoading: state.admin.loading > 0,
        version: state.admin.ui.viewVersion,
    };
};

const TreeController = connect(
    mapStateToProps,
    {
        crudGetRootNodes: crudGetRootNodesAction,
        crudGetLeafNodes: crudGetLeafNodesAction,
        closeNode: closeNodeAction,
        expandNode: expandNodeAction,
        toggleNode: toggleNodeAction,
    }
)(TreeControllerView);

TreeController.defaultProps = {
    getTreeFromArray: defaultGetTreeFromArray,
    parentSource: 'parent_id',
    positionSource: 'position',
};

export default TreeController;
