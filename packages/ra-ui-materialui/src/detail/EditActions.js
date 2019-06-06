import React from 'react';
import PropTypes from 'prop-types';

import { ShowButton } from '../button';
import TopToolbar from '../layout/TopToolbar';

const sanitizeRestProps = ({
    basePath,
    className,
    record,
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
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@material-ui/core/Button';
 *     import { TopToolbar, ShowButton, Edit } from 'react-admin';
 *
 *     const PostEditActions = ({ basePath, record, resource }) => (
 *         <TopToolbar>
 *             <ShowButton basePath={basePath} record={record} />
 *             // Add your custom actions here
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostEdit = (props) => (
 *         <Edit actions={<PostEditActions />} {...props}>
 *             ...
 *         </Edit>
 *     );
 */
const EditActions = ({ basePath, className, data, hasShow, ...rest }) => (
    <TopToolbar className={className} {...sanitizeRestProps(rest)}>
        {hasShow && <ShowButton basePath={basePath} record={data} />}
    </TopToolbar>
);

EditActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasShow: PropTypes.bool,
    resource: PropTypes.string,
};

export default EditActions;
