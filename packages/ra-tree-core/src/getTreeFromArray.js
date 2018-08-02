import { arrayToTree } from 'performant-array-to-tree';

const applyDepth = ({ children, ...node }, depth) => ({
    id: node.data.id,
    record: node.data,
    depth,
    children: children
        ? children.map(child => applyDepth(child, depth + 1))
        : [],
});

const applyParent = (node, parent) => ({
    ...node,
    children: node.children.map(child => applyParent(child, node)),
    parent,
});

export default (data, parentSource) => {
    // arrayToTree requires top level nodes to have their parent id set to null
    const sanitizedData = data.map(item => ({
        ...item,
        [parentSource]: item[parentSource] || null,
    }));

    return arrayToTree(sanitizedData, {
        id: 'id',
        parentId: parentSource,
    })
        .map(node => applyDepth(node, 1))
        .map(node => applyParent(node, null));
};
