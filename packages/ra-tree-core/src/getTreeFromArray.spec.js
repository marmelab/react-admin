import getTreeFromArray from './getTreeFromArray';

const getNode = ({ id, record, depth, children }) => ({
    id,
    record,
    depth,
    childCount: children.length,
});
const getNodeFromData = (record, depth, childCount) => ({
    id: record.id,
    record: { ...record, parent_id: record.parent_id || null },
    depth,
    childCount,
});

describe('getTreeFromArray', () => {
    it('return a tree from flat data', () => {
        const data = [
            { id: 2, name: 'Men', parent_id: 1 },
            { id: 1, name: 'Clothing' },
            { id: 11, name: 'Blouses', parent_id: 6 },
            { id: 8, name: 'Evening Gowns', parent_id: 7 },
            { id: 4, name: 'Slacks', parent_id: 3 },
            { id: 5, name: 'Jackets', parent_id: 3 },
            { id: 3, name: 'Suits', parent_id: 2 },
            { id: 10, name: 'Skirts', parent_id: 6 },
            { id: 6, name: 'Women', parent_id: 1 },
            { id: 7, name: 'Dresses', parent_id: 6 },
            { id: 9, name: 'Sun Dresses', parent_id: 7 },
        ];

        const tree = getTreeFromArray(data, 'parent_id');
        expect(tree.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 1), 1, 2),
        ]);
        expect(tree[0].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 2), 2, 1),
            getNodeFromData(data.find(d => d.id === 6), 2, 3),
        ]);
        expect(tree[0].children[0].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 3), 3, 2),
        ]);
        expect(tree[0].children[0].children[0].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 4), 4, 0),
            getNodeFromData(data.find(d => d.id === 5), 4, 0),
        ]);
        expect(tree[0].children[1].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 11), 3, 0),
            getNodeFromData(data.find(d => d.id === 10), 3, 0),
            getNodeFromData(data.find(d => d.id === 7), 3, 2),
        ]);
        expect(tree[0].children[1].children[2].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 8), 4, 0),
            getNodeFromData(data.find(d => d.id === 9), 4, 0),
        ]);
    });
});
