import React from 'react';
import expect from 'expect';
import { render, fireEvent } from 'react-testing-library';
import { CoreAdmin, Resource } from 'ra-core';
import { TextField } from 'ra-ui-materialui';
import {
    GET_TREE_ROOT_NODES,
    GET_TREE_CHILDREN_NODES,
    reducer as treeReducer,
} from 'ra-tree-core';

import Tree from './Tree';
import TreeList from './TreeList';
import TreeNode from './TreeNode';

describe('<Tree>', () => {
    test('Displays a tree', async () => {
        const TagsList = props => (
            <Tree {...props} parentSource="parent_id">
                <TreeList>
                    <TreeNode>
                        <TextField source="name" />
                    </TreeNode>
                </TreeList>
            </Tree>
        );
        const dataProvider = (type, resource, params) => {
            if (type === GET_TREE_ROOT_NODES) {
                return Promise.resolve({
                    data: [{ id: 0, name: 'music' }, { id: 1, name: 'cinema' }],
                });
            }

            if (type === GET_TREE_CHILDREN_NODES) {
                if (params.id === 0) {
                    return Promise.resolve({
                        data: [
                            { id: 3, name: 'rock', parent_id: 0 },
                            { id: 4, name: 'rap', parent_id: 0 },
                        ],
                    });
                }

                if (params.id === 1) {
                    return Promise.resolve({
                        data: [
                            { id: 5, name: 'drama', parent_id: 1 },
                            {
                                id: 6,
                                name: 'adventure',
                                parent_id: 1,
                            },
                        ],
                    });
                }

                return Promise.resolve({
                    data: [],
                });
            }
        };

        const { queryByText, queryAllByLabelText } = render(
            <CoreAdmin
                dataProvider={dataProvider}
                customReducers={{ tree: treeReducer }}
            >
                <Resource name="tags" list={TagsList} />
            </CoreAdmin>
        );
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(queryByText('music')).not.toBeNull();
        expect(queryByText('cinema')).not.toBeNull();

        const expandButtons = queryAllByLabelText('ra.tree.expand');
        expect(expandButtons.length).toEqual(2);

        fireEvent.click(expandButtons[0]);
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(queryByText('rock')).not.toBeNull();
        expect(queryByText('rap')).not.toBeNull();

        fireEvent.click(expandButtons[1]);
        await new Promise(resolve => setTimeout(resolve, 50));
        expect(queryByText('drama')).not.toBeNull();
        expect(queryByText('adventure')).not.toBeNull();
    });
});
