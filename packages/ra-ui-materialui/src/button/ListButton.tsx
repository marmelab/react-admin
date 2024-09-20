import * as React from 'react';
import { ReactElement } from 'react';
import ActionList from '@mui/icons-material/List';
import { Link } from 'react-router-dom';
import { useResourceContext, useCreatePath, useCanAccess } from 'ra-core';

import { Button, ButtonProps } from './Button';

/**
 * Opens the List view of a given resource
 *
 * @example // basic usage
 * import { ListButton } from 'react-admin';
 *
 * const CommentListButton = () => (
 *     <ListButton label="Comments" />
 * );
 *
 * @example // linking back to the list from the Edit view
 * import { TopToolbar, ListButton, ShowButton, Edit } from 'react-admin';
 *
 * const PostEditActions = () => (
 *     <TopToolbar>
 *         <ListButton />
 *         <ShowButton />
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
        resource: resourceProp,
        scrollToTop = true,
        ...rest
    } = props;
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            '<ListButton> components should be used inside a <Resource> component or provided the resource prop.'
        );
    }
    const { canAccess, isPending } = useCanAccess({
        action: 'list',
        resource,
    });
    const createPath = useCreatePath();

    if (!canAccess || isPending) {
        return null;
    }

    return (
        <Button
            component={Link}
            to={createPath({ type: 'list', resource })}
            state={scrollStates[String(scrollToTop)]}
            label={label}
            {...(rest as any)}
        >
            {icon}
        </Button>
    );
};

// avoids using useMemo to get a constant value for the link state
const scrollStates = {
    true: { _scrollToTop: true },
    false: {},
};

const defaultIcon = <ActionList />;

interface Props {
    icon?: ReactElement;
    label?: string;
    resource?: string;
    scrollToTop?: boolean;
}

export type ListButtonProps = Props & ButtonProps;
