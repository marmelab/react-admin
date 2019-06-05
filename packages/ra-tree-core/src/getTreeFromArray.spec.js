import getTreeFromArray from './getTreeFromArray';

const getNode = ({ id, record, children }) => ({
    id,
    record,
    childCount: children.length,
});
const getNodeFromData = (record, childCount) => ({
    id: record.id,
    record: { ...record, parent_id: record.parent_id || null },
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
        expect(tree.map(getNode)).toEqual([getNodeFromData(data.find(d => d.id === 1), 2)]);
        expect(tree[0].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 2), 1),
            getNodeFromData(data.find(d => d.id === 6), 3),
        ]);
        expect(tree[0].children[0].children.map(getNode)).toEqual([getNodeFromData(data.find(d => d.id === 3), 2)]);
        expect(tree[0].children[0].children[0].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 4), 0),
            getNodeFromData(data.find(d => d.id === 5), 0),
        ]);
        expect(tree[0].children[1].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 11), 0),
            getNodeFromData(data.find(d => d.id === 10), 0),
            getNodeFromData(data.find(d => d.id === 7), 2),
        ]);
        expect(tree[0].children[1].children[2].children.map(getNode)).toEqual([
            getNodeFromData(data.find(d => d.id === 8), 0),
            getNodeFromData(data.find(d => d.id === 9), 0),
        ]);
    });
});
