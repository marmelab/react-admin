import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    TextInput,
} from 'react-admin';
import {
    DragPreview,
    EditableTree,
    TreeNodeActions,
} from 'ra-tree-ui-materialui';

const TagDragPreview = props => (
    <DragPreview {...props}>{({ node }) => node.record.name}</DragPreview>
);

const TagList = props => (
    <List {...props} perPage={1000}>
        <EditableTree
            parentSource="parent_id"
            dragPreviewComponent={TagDragPreview}
        >
            <TextInput source="name" />
            <TreeNodeActions>
                <EditButton />
                <ShowButton />
                <DeleteButton />
            </TreeNodeActions>
        </EditableTree>
    </List>
);

export default TagList;
