import React from 'react';
import TreeNodeList from './TreeNodeList';

const TreeList = ({ children, ...props }) => (
    <TreeNodeList {...props}>{children}</TreeNodeList>
);

export default TreeList;
