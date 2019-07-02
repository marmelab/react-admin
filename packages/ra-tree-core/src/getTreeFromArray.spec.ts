import getTreeFromArray, { DEFAULT_TREE_ROOT_ID } from './getTreeFromArray';

describe('getTreeFromArray', () => {
    it('return a tree from flat data with a single root item', () => {
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
        expect(tree).toEqual({
            rootId: 1,
            items: [
                {
                    id: 2,
                    children: [3],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 2, name: 'Men', parent_id: 1 },
                },
                {
                    id: 1,
                    children: [2, 6],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 1, name: 'Clothing' },
                },
                {
                    id: 11,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 11, name: 'Blouses', parent_id: 6 },
                },
                {
                    id: 8,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 8, name: 'Evening Gowns', parent_id: 7 },
                },
                {
                    id: 4,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 4, name: 'Slacks', parent_id: 3 },
                },
                {
                    id: 5,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 5, name: 'Jackets', parent_id: 3 },
                },
                {
                    id: 3,
                    children: [4, 5],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 3, name: 'Suits', parent_id: 2 },
                },
                {
                    id: 10,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 10, name: 'Skirts', parent_id: 6 },
                },
                {
                    id: 6,
                    children: [11, 10, 7],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 6, name: 'Women', parent_id: 1 },
                },
                {
                    id: 7,
                    children: [8, 9],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 7, name: 'Dresses', parent_id: 6 },
                },
                {
                    id: 9,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 9, name: 'Sun Dresses', parent_id: 7 },
                },
            ],
        });
    });
    it('return a tree from flat data with multiple root items', () => {
        const data = [
            { id: 2, name: 'Men' },
            { id: 11, name: 'Blouses', parent_id: 6 },
            { id: 8, name: 'Evening Gowns', parent_id: 7 },
            { id: 4, name: 'Slacks', parent_id: 3 },
            { id: 5, name: 'Jackets', parent_id: 3 },
            { id: 3, name: 'Suits', parent_id: 2 },
            { id: 10, name: 'Skirts', parent_id: 6 },
            { id: 6, name: 'Women' },
            { id: 7, name: 'Dresses', parent_id: 6 },
            { id: 9, name: 'Sun Dresses', parent_id: 7 },
        ];

        const tree = getTreeFromArray(data, 'parent_id');
        expect(tree).toEqual({
            rootId: DEFAULT_TREE_ROOT_ID,
            items: [
                {
                    id: DEFAULT_TREE_ROOT_ID,
                    children: [2, 6],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: {},
                },
                {
                    id: 2,
                    children: [3],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 2, name: 'Men' },
                },
                {
                    id: 11,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 11, name: 'Blouses', parent_id: 6 },
                },
                {
                    id: 8,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 8, name: 'Evening Gowns', parent_id: 7 },
                },
                {
                    id: 4,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 4, name: 'Slacks', parent_id: 3 },
                },
                {
                    id: 5,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 5, name: 'Jackets', parent_id: 3 },
                },
                {
                    id: 3,
                    children: [4, 5],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 3, name: 'Suits', parent_id: 2 },
                },
                {
                    id: 10,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 10, name: 'Skirts', parent_id: 6 },
                },
                {
                    id: 6,
                    children: [11, 10, 7],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 6, name: 'Women' },
                },
                {
                    id: 7,
                    children: [8, 9],
                    hasChildren: true,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 7, name: 'Dresses', parent_id: 6 },
                },
                {
                    id: 9,
                    children: [],
                    hasChildren: false,
                    isExpanded: false,
                    isChildrenLoading: false,
                    data: { id: 9, name: 'Sun Dresses', parent_id: 7 },
                },
            ],
        });
    });
});
