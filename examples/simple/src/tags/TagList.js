import React from 'react';
import {
    DeleteButton,
    EditButton,
    List,
    ShowButton,
    TextField,
} from 'react-admin';
import {
    DragPreview,
    IgnoreFormProps,
    NodeView,
    Tree,
    NodeActions,
} from 'ra-tree-ui-materialui';

const TagDragPreview = props => (
    <DragPreview {...props}>{({ node }) => node.record.name}</DragPreview>
);

const CustomNodeActions = props => (
    <NodeActions {...props}>
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
            <NodeView actions={<CustomNodeActions />}>
                <TextField source="name" />
            </NodeView>
        </Tree>
    </List>
);

export default TagList;
