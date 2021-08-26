import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionList from '@material-ui/icons/List';
import { Link } from 'react-router-dom';
import { useResourceContext } from 'ra-core';

import Button, { ButtonProps } from './Button';

/**
 * Opens the List view of a given resource
 *
 * @example // basic usage
 * import { ListButton } from 'react-admin';
 *
 * const CommentListButton = () => (
 *     <ListButton basePath="/comments" label="Comments" />
 * );
 *
 * @example // linking back to the list from the Edit view
 * import { TopToolbar, ListButton, ShowButton, Edit } from 'react-admin';
 *
 * const PostEditActions = ({ basePath, record, resource }) => (
 *     <TopToolbar>
 *         <ListButton basePath={basePath} />
 *         <ShowButton basePath={basePath} record={record} />
 *     </TopToolbar>
 * );
 *
 * export const PostEdit = (props) => (
 *     <Edit actions={<PostEditActions />} {...props}>
 *         ...
 *     </Edit>
 * );
 */
const ListButton = (props: ListButtonProps) => {
    const {
        basePath = '',
        icon = defaultIcon,
        label = 'ra.action.list',
        ...rest
    } = props;
    const resource = useResourceContext();
    return (
        <Button
            component={Link}
            to={basePath || `/${resource}`}
            label={label}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ActionList />;

interface Props {
    basePath?: string;
    icon?: ReactElement;
    label?: string;
}

export type ListButtonProps = Props & ButtonProps;

ListButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
};

export default ListButton;
