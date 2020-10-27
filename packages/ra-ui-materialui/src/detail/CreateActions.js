import * as React from 'react';
import PropTypes from 'prop-types';

import TopToolbar from '../layout/TopToolbar';
import { ListButton } from '../button';
import { useCreateContext } from 'ra-core';

const sanitizeRestProps = ({
    basePath,
    className,
    hasList,
    resource,
    ...rest
}) => rest;

/**
 * Action Toolbar for the Create view
 *
 * Internal component. If you want to add or remove actions for a Create view,
 * write your own CreateActions Component. Then, in the <Create> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@material-ui/core/Button';
 *     import { TopToolbar, Create, ListButton } from 'react-admin';
 *
 *     const PostCreateActions = ({ basePath }) => (
 *         <TopToolbar>
 *             <ListButton basePath={basePath} />
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
const CreateActions = ({ className, ...rest }) => {
    const { basePath, hasList } = useCreateContext(rest);
    return (
        <TopToolbar className={className} {...sanitizeRestProps(rest)}>
            {hasList && <ListButton basePath={basePath} />}
        </TopToolbar>
    );
};

CreateActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    hasList: PropTypes.bool,
};

export default CreateActions;
