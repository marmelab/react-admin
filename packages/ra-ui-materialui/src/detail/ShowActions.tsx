import * as React from 'react';
import PropTypes from 'prop-types';
import { Record, useResourceDefinition, useShowContext } from 'ra-core';

import { EditButton } from '../button';
import TopToolbar from '../layout/TopToolbar';

const sanitizeRestProps = ({
    basePath,
    className,
    hasEdit,
    hasList,
    resource,
    ...rest
}: any) => rest;

/**
 * Action Toolbar for the Show view
 *
 * Internal component. If you want to add or remove actions for a Show view,
 * write your own ShowActions Component. Then, in the <Show> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@material-ui/core/Button';
 *     import { TopToolbar, EditButton, Show } from 'react-admin';
 *
 *     const PostShowActions = ({ basePath, record, resource }) => (
 *         <TopToolbar>
 *             <EditButton basePath={basePath} record={record} />
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
export const ShowActions = ({ className, ...rest }: ShowActionsProps) => {
    const { basePath, record } = useShowContext(rest);
    const { hasEdit } = useResourceDefinition(rest);
    return (
        <TopToolbar className={className} {...sanitizeRestProps(rest)}>
            {hasEdit && <EditButton basePath={basePath} record={record} />}
        </TopToolbar>
    );
};

export interface ShowActionsProps {
    basePath?: string;
    className?: string;
    data?: Record;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    resource?: string;
}

ShowActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    resource: PropTypes.string,
};
