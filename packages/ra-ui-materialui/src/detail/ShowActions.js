import React from 'react';
import PropTypes from 'prop-types';

import { EditButton } from '../button';
import TopToolbar from '../layout/TopToolbar';

const sanitizeRestProps = ({
    basePath,
    className,
    record,
    hasEdit,
    hasList,
    resource,
    ...rest
}) => rest;

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
const ShowActions = ({ basePath, className, data, hasEdit, ...rest }) => (
    <TopToolbar className={className} {...sanitizeRestProps(rest)}>
        {hasEdit && <EditButton basePath={basePath} record={data} />}
    </TopToolbar>
);

ShowActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    resource: PropTypes.string,
};

export default ShowActions;
