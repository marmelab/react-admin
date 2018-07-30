import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tree from './Tree';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DragLayer from './DragLayer';
import DefaultDragPreview from './DragPreview';
import EditableTreeNode from './EditableTreeNode';
import EditableTreeNodeContent from './EditableTreeNodeContent';

const EditableTree = ({ dragPreviewComponent, ...props }) => (
    <Fragment>
        <DragLayer dragPreviewComponent={dragPreviewComponent} />
        <Tree {...props} />
    </Fragment>
);

EditableTree.propTypes = {
    ...Tree.propTypes,
    submitOnEnter: PropTypes.bool,
};

EditableTree.defaultProps = {
    ...Tree.defaultProps,
    submitOnEnter: true,
    dragPreviewComponent: DefaultDragPreview,
    treeNodeComponent: EditableTreeNode,
    treeNodeContentComponent: EditableTreeNodeContent,
};

export default DragDropContext(HTML5Backend)(EditableTree);
