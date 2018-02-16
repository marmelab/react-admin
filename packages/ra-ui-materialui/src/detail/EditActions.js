import React from 'react';
import PropTypes from 'prop-types';

import { ListButton, ShowButton, DeleteButton, RefreshButton } from '../button';
import CardActions from '../layout/CardActions';

const sanitizeRestProps = ({
    basePath,
    className,
    record,
    hasDelete,
    hasShow,
    hasList,
    resource,
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
 *     import Button from 'material-ui/Button';
 *     import { CardActions, ListButton, ShowButton, DeleteButton, RefreshButton, Edit } from 'react-admin';
 *     
 *     const PostEditActions = ({ basePath, record }) => (
 *         <CardActions>
 *             <ShowButton basePath={basePath} record={record} />
 *             <ListButton basePath={basePath} />
 *             <DeleteButton basePath={basePath} record={record} />
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
    hasDelete,
    hasShow,
    hasList,
    ...rest
}) => (
    <CardActions className={className} {...sanitizeRestProps(rest)}>
        {hasShow && <ShowButton basePath={basePath} record={data} />}
        {hasList && <ListButton basePath={basePath} />}
        {hasDelete && <DeleteButton basePath={basePath} record={data} />}
        <RefreshButton />
    </CardActions>
);

EditActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasDelete: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
};

export default EditActions;
