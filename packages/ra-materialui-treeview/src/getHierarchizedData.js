import { arrayToTree } from 'performant-array-to-tree';

const applyDepth = ({ children, ...node }, __depth) => ({
    ...node.data,
    __depth,
    __children: children
        ? children.map(child => applyDepth(child, __depth + 1))
        : [],
});

export default (data, parentSource) => {
    const sanitizedData = data.map(item => ({
        ...item,
        [parentSource]: item[parentSource] || null,
    }));

    return arrayToTree(sanitizedData, {
        id: 'id',
        parentId: parentSource,
    }).map(node => applyDepth(node, 1));
};
