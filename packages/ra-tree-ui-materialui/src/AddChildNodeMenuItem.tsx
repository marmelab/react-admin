import React, { SFC, ComponentType, ReactElement } from 'react';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Record, withTranslate, Translate, Identifier } from 'ra-core';
import { getChildrenNodes } from 'ra-tree-core';

interface Props {
    label?: string;
    icon: ReactElement<any>;
}

interface InjectedProps {
    basePath: string;
    nodeChildren: Identifier[];
    record: Record;
    parentSource: string;
    positionSource?: string;
    translate: Translate;
}

/**
 * Menu item meant to be used inside a <TreeNodeActionsMenu>. It provides a custom create button
 * which will initialize the create form with values to add a new node to the current one
 *
 * @example
 * const TagNodeActions = props => (
 *     <TreeNodeActions {...props}>
 *         <TreeNodeActionsMenu {...props}>
 *             <AddChildNodeMenuItem />
 *         </TreeNodeActionsMenu>
 *     </TreeNodeActions>
 * );
 * export const TagsList = (props) => (
 *     <Tree {...props}>
 *         <TreeList>
 *             <TreeNode actions={<TagNodeActions />}>
 *                 <TextField source="name" />
 *             </TreeNode>
 *         </TreeList>
 *     </Tree>
 * );
 */
const AddChildNodeMenuItemView: SFC<Props & InjectedProps & MenuItemProps> = ({
    basePath,
    label = 'ra.tree.add_child_node',
    nodeChildren,
    parentSource,
    positionSource,
    record: parentRecord,
    translate,
    ...props
}) => {
    // This record will be used to initialize the form values for the new node
    const record = {
        // The new node will have the current node as its parent
        [parentSource]: parentRecord.id,
    };

    // By default, the new node is appended to the current node children
    if (positionSource) {
        record[positionSource] = nodeChildren.length;
    }

    return (
        <MenuItem
            // @ts-ignore
            component={Link}
            to={{
                pathname: `${basePath}/create`,
                state: { record },
            }}
            label={label}
            {...props}
        >
            {translate(label)}
        </MenuItem>
    );
};

const mapStateToProps = (state, props) => ({
    nodeChildren:
        props.record && props.record.id
            ? getChildrenNodes(state, props.resource, props.record.id)
            : [],
});

const AddChildNodeMenuItem = compose(
    connect(
        mapStateToProps,
        {}
    ),
    withTranslate
)(
    // @ts-ignore
    AddChildNodeMenuItemView
) as ComponentType<Props & MenuItemProps>;

export default AddChildNodeMenuItem;
