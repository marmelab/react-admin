import * as React from 'react';
import { useResourceDefinition } from 'ra-core';
import { ToolbarProps } from '@mui/material';

import { EditButton } from '../button';
import TopToolbar from '../layout/TopToolbar';

/**
 * Action Toolbar for the Show view
 *
 * Internal component. If you want to add or remove actions for a Show view,
 * write your own ShowActions Component. Then, in the <Show> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, ShowButton, Show } from 'react-admin';
 *
 *     const PostShowActions = () => (
 *         <TopToolbar>
 *             <ShowButton />
 *             // Add your custom actions here //
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostShow = (props) => (
 *         <Show actions={<PostShowActions />} {...props}>
 *             ...
 *         </Show>
 *     );
 */
export const ShowActions = (props: ShowActionsProps) => {
    const { hasEdit } = useResourceDefinition(props);
    return (
        <TopToolbar {...sanitizeRestProps(props)}>
            {hasEdit && <EditButton />}
        </TopToolbar>
    );
};

const sanitizeRestProps = ({
    hasCreate,
    hasEdit,
    hasShow,
    hasList,
    resource,
    ...rest
}: ShowActionsProps) => rest;

export interface ShowActionsProps extends ToolbarProps {
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    resource?: string;
}
