import React from 'react';
import PropTypes from 'prop-types';

import { ShowButton, DeleteButton, RefreshButton } from '../button';
import CardActions from '../layout/CardActions';

const sanitizeRestProps = ({
    basePath,
    className,
    record,
    hasShow,
    hasList,
    ...rest
}) => rest;

/**
 * Action Toolbar for the Edit view
 *
 * Internal component. If you want to add or remove actions for a Edit view,
 * write your own EditActions Component. Then, in the <Edit> component,
 * use it in the `actions` prop to pas a custom element.
 *
 * @example
 *     import Button from '@material-ui/core/Button';
 *     import { CardActions, ShowButton, DeleteButton, RefreshButton, Edit } from 'react-admin';
 *
 *     const PostEditActions = ({ basePath, record, rseource }) => (
 *         <CardActions>
 *             <ShowButton basePath={basePath} record={record} />
 *             <DeleteButton basePath={basePath} record={record} resource={resource} />
 *             <RefreshButton />
 *             // Add your custom actions here //
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </CardActions>
 *     );
 *
 *     export const PostEdit = (props) => (
 *         <Edit actions={<PostEditActions />} {...props}>
 *             ...
 *         </Edit>
 *     );
 */
const EditActions = ({
    basePath,
    className,
    data,
    hasShow,
    resource,
    ...rest
}) => (
    <CardActions className={className} {...sanitizeRestProps(rest)}>
        {hasShow && <ShowButton basePath={basePath} record={data} />}
        <DeleteButton basePath={basePath} record={data} resource={resource} />
        <RefreshButton />
    </CardActions>
);

EditActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasShow: PropTypes.bool,
    resource: PropTypes.string,
};

export default EditActions;
