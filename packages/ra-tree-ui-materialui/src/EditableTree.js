import Tree from './Tree';
import EditableTreeNodeContent from './EditableTreeNodeContent';

export const EditableTree = Tree;

EditableTree.propTypes = Tree.propTypes;

EditableTree.defaultProps = {
    ...Tree.defaultProps,
    treeNodeContentComponent: EditableTreeNodeContent,
};

export default EditableTree;
