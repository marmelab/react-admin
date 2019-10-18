import React, {
    Children,
    cloneElement,
    ReactNode,
    isValidElement,
} from 'react';
import {
    withStyles,
    WithStyles,
    createStyles,
    Theme,
} from '@material-ui/core/styles';
import classnames from 'classnames';
import { Record } from 'ra-core';

interface Props {
    children: ReactNode;
    className?: string;
}
interface InjectedProps {
    basePath: string;
    parentSource: string;
    positionSource?: string;
    record: Record;
    resource?: string;
}
const styles = (theme: Theme) =>
    createStyles({
        root: {
            marginLeft: 'auto',
            paddingRight: theme.spacing.unit * 3,
        },
    });

/**
 * Component used to position node actions correctly.
 *
 * // Usage with as a DropDown menu (recommanded)
 * @example
 * const TagNodeActions = props => (
 *     <TreeNodeActions {...props}>
 *         <TreeNodeActionsMenu {...props}>
 *             <AddChildNodeMenuItem />
 *             <AddNodeBeforeMenuItem />
 *             <AddNodeAfterMenuItem />
 *             <EditMenuItem />
 *             <DeleteMenuItem />
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
 * // Usage with standard react admin buttons
 * @example
 * const TagNodeActions = props => (
 *     <TreeNodeActions {...props}>
 *         <EditButton />
 *         <DeleteButton />
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
const TreeNodeActions = withStyles(styles)(
    ({
        basePath,
        children,
        classes,
        className,
        parentSource,
        positionSource,
        record,
        resource,
    }: Props & InjectedProps & WithStyles<typeof styles>) => (
        <div className={classnames(classes.root, className)}>
            {Children.map(children, child =>
                isValidElement(child)
                    ? cloneElement<any>(child, {
                          basePath,
                          record,
                          parentSource,
                          positionSource,
                          resource,
                          ...child.props,
                      })
                    : null
            )}
        </div>
    )
);

export default TreeNodeActions;
