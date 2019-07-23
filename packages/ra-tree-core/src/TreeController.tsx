import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Identifier, RecordMap, Record } from 'ra-core';

import Tree from '@atlaskit/tree';

import defaultGetTreeFromArray, {
    DEFAULT_TREE_ROOT_ID,
} from './getTreeFromArray';
import { getIsNodeExpanded, getExpandedNodeIds } from './selectors';
import {
    closeNode as closeNodeAction,
    expandNode as expandNodeAction,
    toggleNode as toggleNodeAction,
} from './actions';

const defaultGetTreeState = state => state.tree;

interface TreeControllerChildrenProps {
    itemProps: any;
    controllerProps: any;
}

type TreeControllerChildren = (props: TreeControllerChildrenProps) => ReactNode;

interface Props {
    basePath: string;
    data: RecordMap;
    defaultTitle: string;
    displayedFilters: any;
    enableDragAndDrop: boolean;
    filterValues: any;
    hasCreate: boolean;
    hideFilter: (filterName: string) => void;
    ids: Identifier[];
    expandedNodeIds: Identifier[];
    isLoading: boolean;
    loadedOnce: boolean;
    page: number;
    perPage: number;
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

export class TreeControllerView extends Component<Props> {
    static propTypes = {
        basePath: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
        closeNode: PropTypes.func.isRequired,
        expandNode: PropTypes.func.isRequired,
        ids: PropTypes.array.isRequired,
        data: PropTypes.object.isRequired,
        getTreeFromArray: PropTypes.func,
        getTreeState: PropTypes.func,
        parentSource: PropTypes.string,
        resource: PropTypes.string.isRequired,
        toggleNode: PropTypes.func.isRequired,
        treeState: PropTypes.object,
    };

    handleGetIsNodeExpanded = nodeId =>
        getIsNodeExpanded(this.props.treeState, this.props.resource, nodeId);

    handleCollapseNode = nodeId =>
        this.props.closeNode(this.props.resource, nodeId);

    handleExpandNode = nodeId =>
        this.props.expandNode(this.props.resource, nodeId);

    handleToggleNode = nodeId =>
        this.props.toggleNode(this.props.resource, nodeId);

    onDragEnd = (source, destination) => {
        if (!destination) {
            return;
        }
        const { ids, data, parentSource } = this.props;
        const availableData = ids.reduce((acc, id) => acc.concat(data[id]), []);
        const parentId =
            source.parentId === DEFAULT_TREE_ROOT_ID
                ? undefined
                : source.parentId;

        const draggedItem = availableData.filter(
            item => item[parentSource] == parentId
        )[source.index];
    };

    renderItem = itemProps => {
        const {
            children,
            expandedNodeIds,
            getTreeFromArray,
            parentSource,
            enableDragAndDrop,
            ...props
        } = this.props;
        return children({ itemProps, controllerProps: props });
    };

    render() {
        const {
            children,
            closeNode,
            expandNode,
            data: { fetchedAt, ...data },
            enableDragAndDrop,
            expandedNodeIds,
            getTreeFromArray,
            getTreeState,
            ids,
            parentSource,
            resource,
            toggleNode,
            treeState,
            ...props
        } = this.props;

        const availableData = ids.reduce((acc, id) => acc.concat(data[id]), []);

        const tree = getTreeFromArray(
            Object.values(availableData),
            parentSource,
            expandedNodeIds
        );

        return (
            <Tree
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

const mapStateToProps = (state, { getTreeState, resource }) => ({
    expandedNodeIds: getExpandedNodeIds(getTreeState(state), resource),
});

const TreeController = connect(
    mapStateToProps,
    {
        closeNode: closeNodeAction,
        expandNode: expandNodeAction,
        toggleNode: toggleNodeAction,
    }
)(TreeControllerView);

TreeController.defaultProps = {
    getTreeFromArray: defaultGetTreeFromArray,
    getTreeState: defaultGetTreeState,
    parentSource: 'parent_id',
    positionSource: 'position',
};

export default TreeController;
