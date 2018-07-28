import React from 'react';
import PropTypes from 'prop-types';
import TreeContext from './TreeContext';
import defaultGetTreeFromArray from './getTreeFromArray';

const defaultGetTreeState = state => state.tree;

export const TreeController = ({
    children,
    ids,
    data: { fetchedAt, ...data },
    getTreeFromArray,
    getTreeState,
    parentSource,
    ...props
}) => {
    const availableData = ids.reduce((acc, id) => [...acc, data[id]], []);
    const tree = getTreeFromArray(Object.values(availableData), parentSource);

    return (
        <TreeContext.Provider value={{ getTreeState }}>
            {children({
                ids,
                data,
                parentSource,
                tree,
                ...props,
            })}
        </TreeContext.Provider>
    );
};

TreeController.propTypes = {
    basePath: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    ids: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    getTreeFromArray: PropTypes.func,
    getTreeState: PropTypes.func,
    parentSource: PropTypes.string,
    resource: PropTypes.string.isRequired,
};

TreeController.defaultProps = {
    getTreeFromArray: defaultGetTreeFromArray,
    getTreeState: defaultGetTreeState,
    parentSource: 'parent_id',
};

export default TreeController;
