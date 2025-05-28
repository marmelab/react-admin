import * as React from 'react';
import ActionList from '@mui/icons-material/List';
import { Link } from 'react-router-dom';
import {
    useResourceContext,
    useCreatePath,
    useCanAccess,
    useTranslate,
    useGetResourceLabel,
} from 'ra-core';

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
        label: labelProp,
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
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    if (!canAccess || isPending) {
        return null;
    }

    const label =
        labelProp ??
        translate(`resources.${resource}.action.list`, {
            _: translate(`ra.action.list`, {
                name: getResourceLabel(resource, 1),
            }),
        });

    return (
        <Button
            component={Link}
            to={createPath({ type: 'list', resource })}
            state={scrollStates[String(scrollToTop)]}
            // avoid double translation
            label={<>{label}</>}
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={typeof label === 'string' ? label : undefined}
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
    icon?: React.ReactNode;
    label?: string;
    resource?: string;
    scrollToTop?: boolean;
}

export type ListButtonProps = Props & ButtonProps;
