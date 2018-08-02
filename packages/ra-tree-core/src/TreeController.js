import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TreeContext from './TreeContext';
import defaultGetTreeFromArray from './getTreeFromArray';
import { getIsNodeExpanded, getIsNodeExpandedFromHover } from './selectors';
import { toggleNode as toggleNodeAction } from './actions';

const defaultGetTreeState = state => state.tree;

export const TreeControllerView = ({
    children,
    ids,
    data: { fetchedAt, ...data },
    getTreeFromArray,
    getTreeState,
    parentSource,
    toggleNode,
    treeState,
    ...props
}) => {
    const availableData = ids.reduce((acc, id) => [...acc, data[id]], []);
    const tree = getTreeFromArray(Object.values(availableData), parentSource);

    return (
        <TreeContext.Provider
            value={{
                getIsNodeExpanded: nodeId =>
                    getIsNodeExpanded(treeState, nodeId),
                getIsNodeExpandedFromHover: nodeId =>
                    getIsNodeExpandedFromHover(treeState, nodeId),
                toggleNode,
                parentSource,
            }}
        >
            {children({
                tree,
                parentSource,
                ...props,
            })}
        </TreeContext.Provider>
    );
};

TreeControllerView.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    ids: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    getTreeFromArray: PropTypes.func,
    getTreeState: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
    toggleNode: PropTypes.func.isRequired,
    treeState: PropTypes.object,
};

const mapStateToProps = (state, { getTreeState }) => ({
    treeState: getTreeState(state),
});

const TreeController = connect(
    mapStateToProps,
    { toggleNode: toggleNodeAction }
)(TreeControllerView);

TreeController.defaultProps = {
    getTreeFromArray: defaultGetTreeFromArray,
    getTreeState: defaultGetTreeState,
    parentSource: 'parent_id',
};

export default TreeController;
