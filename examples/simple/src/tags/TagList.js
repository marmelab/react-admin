import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    SaveButton,
    ShowButton,
    TextInput,
} from 'react-admin';
import { Treeview, TreeviewNodeActions } from 'ra-materialui-treeview';

const TagList = props => (
    <List {...props} perPage={1000}>
        <Treeview parentSource="parent_id">
            <TextInput source="name" />
            <TreeviewNodeActions>
                <SaveButton variant="flat" />
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </TreeviewNodeActions>
        </Treeview>
    </List>
);

export default TagList;
