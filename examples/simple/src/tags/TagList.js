import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    SaveButton,
    ShowButton,
    TextField,
    TextInput,
} from 'react-admin';
import {
    DragPreview,
    IgnoreFormProps,
    TreeShowLayout,
    TreeForm,
    Tree,
    TreeNodeActions,
} from 'ra-tree-ui-materialui';

const TagDragPreview = props => (
    <DragPreview {...props}>{({ node }) => node.record.name}</DragPreview>
);

const TreeActions = props => (
    <TreeNodeActions {...props}>
        <SaveButton variant="flat" />
        <IgnoreFormProps>
            <EditButton />
            <ShowButton />
            <DeleteButton />
        </IgnoreFormProps>
    </TreeNodeActions>
);

const TagList = props => (
    <List {...props} perPage={1000}>
        <Tree
            allowDropOnRoot
            enableDragAndDrop
            parentSource="parent_id"
            dragPreviewComponent={TagDragPreview}
        >
            <TreeForm actions={<TreeActions />}>
                <TextInput source="name" />
            </TreeForm>
        </Tree>
    </List>
);

export default TagList;
