import * as React from 'react';
import PropTypes from 'prop-types';
import { RaRecord, useResourceDefinition, useRecordContext } from 'ra-core';

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
    const record = useRecordContext(props);
    const { hasEdit } = useResourceDefinition();
    if (!hasEdit) {
        return null;
    }
    return (
        <TopToolbar className={props.className}>
            <EditButton record={record} />
        </TopToolbar>
    );
};

export interface ShowActionsProps {
    className?: string;
    record?: RaRecord;
}

ShowActions.propTypes = {
    className: PropTypes.string,
    record: PropTypes.any,
};
