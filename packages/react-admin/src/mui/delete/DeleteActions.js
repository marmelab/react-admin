import React from 'react';
import PropTypes from 'prop-types';

import CardActions from '../layout/CardActions';
import { ListButton, ShowButton, EditButton } from '../button';

/**
 * Action Toolbar for the Delete view
 * 
 * Internal component. If you want to add or remove actions for a Delete view,
 * write your own DeleteActions Component. Then, in the <Delete> component,
 * use it in the `actions` prop to pas a custom element.
 * 
 * @example
 *     import Button from 'material-ui/Button';
 *     import { CardActions, ListButton, ShowButton, EditButton, Delete } from 'react-admin';
 *     
 *     const PostDeleteActions = ({ basePath, data }) => (
 *         <CardActions>
 *             <ListButton basePath={basePath} />
 *             <EditButton basePath={basePath} record={data} />
 *             <ShowButton basePath={basePath} record={data} />
 *             // Add your custom actions here //
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </CardActions>
 *     );
 *     
 *     export const PostDelete = (props) => (
 *         <Delete actions={<PostDeleteActions />} {...props}>
 *             ...
 *         </Delete>
 *     );
 */
const DeleteActions = ({
    basePath,
    className,
    data,
    hasEdit,
    hasList,
    hasShow,
}) => (
    <CardActions className={className}>
        {hasList && <ListButton basePath={basePath} />}
        {hasEdit && <EditButton basePath={basePath} record={data} />}
        {hasShow && <ShowButton basePath={basePath} record={data} />}
    </CardActions>
);

DeleteActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
};

export default DeleteActions;
