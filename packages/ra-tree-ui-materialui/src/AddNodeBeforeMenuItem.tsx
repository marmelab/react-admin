import React, { SFC, ComponentType, ReactElement } from 'react';
import { Record, withTranslate, Translate } from 'ra-core';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

interface Props {
    label?: string;
    icon: ReactElement<any>;
}

interface InjectedProps {
    basePath: string;
    record: Record;
    parentSource: string;
    positionSource?: string;
    translate: Translate;
}

/**
 * Menu item meant to be used inside a <TreeNodeActionsMenu>. It provides a custom create button
 * which will initialize the create form with values to insert a new node before the current one
 *
 * @example
 * const TagNodeActions = props => (
 *     <TreeNodeActions {...props}>
 *         <TreeNodeActionsMenu {...props}>
 *             <AddNodeBeforeMenuItem />
 *             <AddNodeAfterMenuItem />
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
const AddNodeBeforeMenuItemView: SFC<Props & InjectedProps & MenuItemProps> = ({
    basePath,
    label = 'ra.tree.add_node_before',
    parentSource,
    positionSource,
    record: siblingRecord,
    translate,
    ...props
}) => {
    // This record will be used to initialize the form values for the new node
    const record = {
        // The new node will have the same parent as the node after which it will be inserted
        [parentSource]: siblingRecord[parentSource],
        // The new node will be inserted before its sibling so it has to take its position
        [positionSource]: siblingRecord[positionSource],
    };

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

const AddNodeBeforeMenuItem = withTranslate(
    // @ts-ignore
    AddNodeBeforeMenuItemView
) as ComponentType<Props & MenuItemProps>;

export default AddNodeBeforeMenuItem;
