import * as React from 'react';
import PropTypes from 'prop-types';

import { Record, useEditContext } from 'ra-core';
import { ShowButton } from '../button';
import TopToolbar from '../layout/TopToolbar';

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
const EditActions = ({ className, ...rest }: EditActionsProps) => {
    const { basePath, hasShow, record: data } = useEditContext(rest);

    return (
        <TopToolbar className={className} {...rest}>
            {hasShow && <ShowButton basePath={basePath} record={data} />}
        </TopToolbar>
    );
};

export interface EditActionsProps {
    basePath?: string;
    className?: string;
    data?: Record;
    hasShow?: boolean;
    hasList?: boolean;
    resource?: string;
}

EditActions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    data: PropTypes.object,
    hasShow: PropTypes.bool,
    resource: PropTypes.string,
};

export default EditActions;
