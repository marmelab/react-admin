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
const addParent = (node, parent) => ({
    ...node,
    children: node.children.map(child => addParent(child, node)),
    parent,
});

/**
 * Build a tree representation of the data returned by the List component
 */
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
        .map(node => addParent(node, null));
};
