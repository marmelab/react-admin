import getTreeFromArray from './getTreeFromArray';

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

        expect(getTreeFromArray(data, 'parent_id')).toEqual([
            {
                children: [
                    {
                        children: [
                            {
                                children: [
                                    {
                                        children: [],
                                        depth: 4,
                                        id: 4,
                                        record: {
                                            id: 4,
                                            name: 'Slacks',
                                            parent_id: 3,
                                        },
                                    },
                                    {
                                        children: [],
                                        depth: 4,
                                        id: 5,
                                        record: {
                                            id: 5,
                                            name: 'Jackets',
                                            parent_id: 3,
                                        },
                                    },
                                ],
                                depth: 3,
                                id: 3,
                                record: {
                                    id: 3,
                                    name: 'Suits',
                                    parent_id: 2,
                                },
                            },
                        ],
                        depth: 2,
                        id: 2,
                        record: {
                            id: 2,
                            name: 'Men',
                            parent_id: 1,
                        },
                    },
                    {
                        children: [
                            {
                                children: [],
                                depth: 3,
                                id: 11,
                                record: {
                                    id: 11,
                                    name: 'Blouses',
                                    parent_id: 6,
                                },
                            },
                            {
                                children: [],
                                depth: 3,
                                id: 10,
                                record: {
                                    id: 10,
                                    name: 'Skirts',
                                    parent_id: 6,
                                },
                            },
                            {
                                children: [
                                    {
                                        children: [],
                                        depth: 4,
                                        id: 8,
                                        record: {
                                            id: 8,
                                            name: 'Evening Gowns',
                                            parent_id: 7,
                                        },
                                    },
                                    {
                                        children: [],
                                        depth: 4,
                                        id: 9,
                                        record: {
                                            id: 9,
                                            name: 'Sun Dresses',
                                            parent_id: 7,
                                        },
                                    },
                                ],
                                depth: 3,
                                id: 7,
                                record: {
                                    id: 7,
                                    name: 'Dresses',
                                    parent_id: 6,
                                },
                            },
                        ],
                        depth: 2,
                        id: 6,
                        record: {
                            id: 6,
                            name: 'Women',
                            parent_id: 1,
                        },
                    },
                ],
                depth: 1,
                id: 1,
                record: {
                    id: 1,
                    name: 'Clothing',
                    parent_id: null,
                },
            },
        ]);
    });
});
