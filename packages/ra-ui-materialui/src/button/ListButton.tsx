import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionList from '@mui/icons-material/List';
import { Link } from 'react-router-dom';
import { useResourceContext, useCreateInternalLink } from 'ra-core';

import { Button, ButtonProps } from './Button';

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
export const ListButton = (props: ListButtonProps) => {
    const {
        icon = defaultIcon,
        label = 'ra.action.list',
        scrollToTop = true,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    const createInternalLink = useCreateInternalLink();
    return (
        <Button
            component={Link}
            to={createInternalLink({ type: 'list', resource })}
            state={{ _scrollToTop: scrollToTop }}
            label={label}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ActionList />;

interface Props {
    icon?: ReactElement;
    label?: string;
    scrollToTop?: boolean;
}

export type ListButtonProps = Props & ButtonProps;

ListButton.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
};
