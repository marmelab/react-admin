import * as React from 'react';
import PropTypes from 'prop-types';

import { RaRecord, useEditContext, useResourceDefinition } from 'ra-core';
import { ShowButton } from '../button';
import TopToolbar from '../layout/TopToolbar';

/**
 * Action Toolbar for the Edit view
 *
 * Internal component. If you want to add or remove actions for an Edit view,
 * write your own EditActions Component. Then, in the <Edit> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, ShowButton, Edit } from 'react-admin';
 *
 *     const PostEditActions = ({ record, resource }) => (
 *         <TopToolbar>
 *             <ShowButton record={record} />
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
export const EditActions = ({ className, ...rest }: EditActionsProps) => {
    const { record } = useEditContext(rest);
    const { hasShow } = useResourceDefinition(rest);

    return (
        <TopToolbar className={className} {...sanitizeRestProps(rest)}>
            {hasShow && <ShowButton record={record} />}
        </TopToolbar>
    );
};

const sanitizeRestProps = ({
    hasCreate = null,
    hasEdit = null,
    hasShow = null,
    hasList = null,
    ...rest
}) => rest;

export interface EditActionsProps {
    className?: string;
    data?: RaRecord;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    resource?: string;
}

EditActions.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    resource: PropTypes.string,
};
