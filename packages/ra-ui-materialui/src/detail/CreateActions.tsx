import * as React from 'react';
import PropTypes from 'prop-types';

import TopToolbar from '../layout/TopToolbar';
import { ListButton } from '../button';
import { useCreateContext, useResourceDefinition } from 'ra-core';
import { ReactNode } from 'react';

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
export const CreateActions = ({
    children,
    className,
    ...rest
}: CreateActionsProps) => {
    const { basePath } = useCreateContext(rest);
    const { hasList } = useResourceDefinition(rest);
    return (
        <TopToolbar className={className} {...sanitizeRestProps(rest)}>
            {hasList && <ListButton basePath={basePath} />}
            {children}
        </TopToolbar>
    );
};

const sanitizeRestProps = ({
    basePath = null,
    className = null,
    hasList = null,
    resource = null,
    ...rest
}) => rest;

export interface CreateActionsProps {
    children?: ReactNode;
    basePath?: string;
    className?: string;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasList?: boolean;
    hasShow?: boolean;
    resource?: string;
}

CreateActions.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    resource: PropTypes.string,
};
