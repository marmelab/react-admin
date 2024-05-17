import * as React from 'react';
import { ToolbarProps } from '@mui/material';
import { useResourceDefinition } from 'ra-core';

import TopToolbar from '../layout/TopToolbar';
import { ListButton } from '../button';

/**
 * Action Toolbar for the Create view
 *
 * Internal component. If you want to add or remove actions for a Create view,
 * write your own CreateActions Component. Then, in the <Create> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, Create, ListButton } from 'react-admin';
 *
 *     const PostCreateActions = () => (
 *         <TopToolbar>
 *             <ListButton />
 *             // Add your custom actions here //
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostCreate = (props) => (
 *         <Create actions={<PostCreateActions />} {...props}>
 *             ...
 *         </Create>
 *     );
 */
export const CreateActions = (props: CreateActionsProps) => {
    const { hasList } = useResourceDefinition(props);
    return (
        <TopToolbar {...sanitizeRestProps(props)}>
            {hasList && <ListButton />}
        </TopToolbar>
    );
};

const sanitizeRestProps = ({
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    resource,
    ...rest
}: CreateActionsProps) => rest;

export interface CreateActionsProps extends ToolbarProps {
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    resource?: string;
}
