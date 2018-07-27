import getHierarchizedData from './getHierarchizedData';

describe('getHierarchizedData', () => {
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

        expect(getHierarchizedData(data, 'parent_id')).toEqual([
            {
                __children: [
                    {
                        __children: [
                            {
                                __children: [
                                    {
                                        __children: [],
                                        __depth: 4,
                                        id: 4,
                                        name: 'Slacks',
                                        parent_id: 3,
                                    },
                                    {
                                        __children: [],
                                        __depth: 4,
                                        id: 5,
                                        name: 'Jackets',
                                        parent_id: 3,
                                    },
                                ],
                                __depth: 3,
                                id: 3,
                                name: 'Suits',
                                parent_id: 2,
                            },
                        ],
                        __depth: 2,
                        id: 2,
                        name: 'Men',
                        parent_id: 1,
                    },
                    {
                        __children: [
                            {
                                __children: [],
                                __depth: 3,
                                id: 11,
                                name: 'Blouses',
                                parent_id: 6,
                            },
                            {
                                __children: [],
                                __depth: 3,
                                id: 10,
                                name: 'Skirts',
                                parent_id: 6,
                            },
                            {
                                __children: [
                                    {
                                        __children: [],
                                        __depth: 4,
                                        id: 8,
                                        name: 'Evening Gowns',
                                        parent_id: 7,
                                    },
                                    {
                                        __children: [],
                                        __depth: 4,
                                        id: 9,
                                        name: 'Sun Dresses',
                                        parent_id: 7,
                                    },
                                ],
                                __depth: 3,
                                id: 7,
                                name: 'Dresses',
                                parent_id: 6,
                            },
                        ],
                        __depth: 2,
                        id: 6,
                        name: 'Women',
                        parent_id: 1,
                    },
                ],
                __depth: 1,
                id: 1,
                name: 'Clothing',
                parent_id: null,
            },
        ]);
    });
});
