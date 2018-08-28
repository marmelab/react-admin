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
    NodeView,
    NodeForm,
    Tree,
    NodeActions,
} from 'ra-tree-ui-materialui';

const TagDragPreview = props => (
    <DragPreview {...props}>{({ node }) => node.record.name}</DragPreview>
);

const CustomNodeActions = props => (
    <NodeActions {...props}>
        <SaveButton variant="flat" />
        <IgnoreFormProps>
            <EditButton />
            <ShowButton />
            <DeleteButton />
        </IgnoreFormProps>
    </NodeActions>
);

const TagList = props => (
    <List {...props} perPage={1000}>
        <Tree
            allowDropOnRoot
            enableDragAndDrop
            parentSource="parent_id"
            dragPreviewComponent={TagDragPreview}
        >
            <NodeForm actions={<CustomNodeActions />}>
                <TextInput source="name" />
            </NodeForm>
        </Tree>
    </List>
);

export default TagList;
