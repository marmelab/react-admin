import { arrayToTree } from 'performant-array-to-tree';

/**
 * Recursivly create nodes.
 */
const createNode = ({ children, ...node }) => ({
    id: node.data.id,
    record: node.data,
    children: children ? children.map(child => createNode(child)) : [],
});

/**
 * Recursivly add a parent property to every nodes so that they can a reference to their parent
 */
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
        .map(node => createNode(node, 1))
        .map(node => applyParent(node, null));
};
