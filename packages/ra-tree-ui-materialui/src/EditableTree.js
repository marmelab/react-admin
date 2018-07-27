import PropTypes from 'prop-types';
import Tree from './Tree';
import EditableTreeNodeContent from './EditableTreeNodeContent';

export const EditableTree = Tree;

EditableTree.propTypes = {
    ...Tree.propTypes,
    submitOnEnter: PropTypes.bool,
};

EditableTree.defaultProps = {
    ...Tree.defaultProps,
    submitOnEnter: true,
    treeNodeContentComponent: EditableTreeNodeContent,
};

export default EditableTree;
