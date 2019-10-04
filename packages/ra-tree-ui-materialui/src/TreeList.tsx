import React from 'react';

import TreeNodeList from './TreeNodeList';
import TreeListLoading from './TreeListLoading';

const TreeList = ({ children, loading, ...props }) =>
    loading && props.nodes.length === 0 ? (
        <TreeListLoading />
    ) : (
        <TreeNodeList {...props}>{children}</TreeNodeList>
    );

export default TreeList;
