import type { SxProps } from '@mui/material';
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemProps,
    ListItemSecondaryAction,
    ListItemText,
    ListProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Identifier,
    RaRecord,
    RecordContextProvider,
    sanitizeListRestProps,
    useGetRecordRepresentation,
    useListContextWithProps,
    useResourceContext,
    useTranslate,
} from 'ra-core';
import * as React from 'react';
import { isValidElement, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ListNoResults } from '../ListNoResults';
import { SimpleListLoading } from './SimpleListLoading';

import { useGetPathForRecordCallback } from 'ra-core';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { RowClickFunction } from 'react-admin';

/**
 * The <SimpleList> component renders a list of records as a Material UI <List>.
 * It is usually used as a child of react-admin's <List> and <ReferenceManyField> components.
 *
 * Also widely used on Mobile.
 *
 * Props:
 * - primaryText: function returning a React element (or some text) based on the record
 * - secondaryText: same
 * - tertiaryText: same
 * - leftAvatar: function returning a React element based on the record
 * - leftIcon: same
 * - rightAvatar: same
 * - rightIcon: same
 * - linkType: deprecated 'edit' or 'show', or a function returning 'edit' or 'show' based on the record
 * - rowClick: The action to trigger when the user clicks on a row. @see https://marmelab.com/react-admin/Datagrid.html#rowclick
 * - rowStyle: function returning a style object based on (record, index)
 * - rowSx: function returning a sx object based on (record, index)
 *
 * @example // Display all posts as a List
 * const postRowSx = (record, index) => ({
 *     backgroundColor: record.views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = () => (
 *     <List>
 *         <SimpleList
 *             primaryText={record => record.title}
 *             secondaryText={record => `${record.views} views`}
 *             tertiaryText={record =>
 *                 new Date(record.published_at).toLocaleDateString()
 *             }
 *             rowSx={postRowSx}
 *          />
 *     </List>
 * );
 */
export const SimpleListJarvi = <RecordType extends RaRecord = any>(
    props: SimpleListProps<RecordType>
) => {
    const {
        className,
        empty = DefaultEmpty,
        hasBulkActions,
        leftAvatar,
        leftIcon,
        linkType,
        rowClick = 'edit',
        primaryText,
        rightAvatar,
        rightIcon,
        secondaryText,
        tertiaryText,
        rowSx,
        rowStyle,
        ...rest
    } = props;
    const { data, isPending, total } = useListContextWithProps<RecordType>(
        props
    );
    const resource = useResourceContext(props);
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const translate = useTranslate();

    if (isPending === true) {
        return (
            <SimpleListLoading
                className={className}
                hasLeftAvatarOrIcon={!!leftIcon || !!leftAvatar}
                hasRightAvatarOrIcon={!!rightIcon || !!rightAvatar}
                hasSecondaryText={!!secondaryText}
                hasTertiaryText={!!tertiaryText}
            />
        );
    }

    const renderAvatar = (
        record: RecordType,
        avatarCallback: FunctionToElement<RecordType>
    ) => {
        const avatarValue = avatarCallback(record, record.id);
        if (
            typeof avatarValue === 'string' &&
            (avatarValue.startsWith('http') || avatarValue.startsWith('data:'))
        ) {
            return <Avatar src={avatarValue} />;
        } else {
            return <Avatar>{avatarValue}</Avatar>;
        }
    };

    if (data == null || data.length === 0 || total === 0) {
        if (empty) {
            return empty;
        }

        return null;
    }

    return (
        <Root className={className} {...sanitizeListRestProps(rest)}>
            {data.map((record, rowIndex) => (
                <RecordContextProvider key={record.id} value={record}>
                    <ListItem disablePadding>
                        <LinkOrNot
                            //@deprecated: use rowClick instead
                            linkType={linkType}
                            rowClick={rowClick}
                            resource={resource}
                            id={record.id}
                            record={record}
                            style={
                                rowStyle
                                    ? rowStyle(record, rowIndex)
                                    : undefined
                            }
                            sx={rowSx?.(record, rowIndex)}
                        >
                            {leftIcon && (
                                <ListItemIcon>
                                    {leftIcon(record, record.id)}
                                </ListItemIcon>
                            )}
                            {leftAvatar && (
                                <ListItemAvatar>
                                    {renderAvatar(record, leftAvatar)}
                                </ListItemAvatar>
                            )}
                            <ListItemText
                                primary={
                                    <div>
                                        {primaryText
                                            ? typeof primaryText === 'string'
                                                ? translate(primaryText, {
                                                      ...record,
                                                      _: primaryText,
                                                  })
                                                : isValidElement(primaryText)
                                                ? primaryText
                                                : // @ts-ignore
                                                  primaryText(record, record.id)
                                            : getRecordRepresentation(record)}

                                        {!!tertiaryText &&
                                            (isValidElement(tertiaryText) ? (
                                                tertiaryText
                                            ) : (
                                                <span
                                                    className={
                                                        SimpleListClasses.tertiary
                                                    }
                                                >
                                                    {typeof tertiaryText ===
                                                    'string'
                                                        ? translate(
                                                              tertiaryText,
                                                              {
                                                                  ...record,
                                                                  _: tertiaryText,
                                                              }
                                                          )
                                                        : isValidElement(
                                                              tertiaryText
                                                          )
                                                        ? tertiaryText
                                                        : // @ts-ignore
                                                          tertiaryText(
                                                              record,
                                                              record.id
                                                          )}
                                                </span>
                                            ))}
                                    </div>
                                }
                                secondary={
                                    !!secondaryText &&
                                    (typeof secondaryText === 'string'
                                        ? translate(secondaryText, {
                                              ...record,
                                              _: secondaryText,
                                          })
                                        : isValidElement(secondaryText)
                                        ? secondaryText
                                        : // @ts-ignore
                                          secondaryText(record, record.id))
                                }
                            />
                            {(rightAvatar || rightIcon) && (
                                <ListItemSecondaryAction>
                                    {rightAvatar && (
                                        <Avatar>
                                            {renderAvatar(record, rightAvatar)}
                                        </Avatar>
                                    )}
                                    {rightIcon && (
                                        <ListItemIcon>
                                            {rightIcon(record, record.id)}
                                        </ListItemIcon>
                                    )}
                                </ListItemSecondaryAction>
                            )}
                        </LinkOrNot>
                    </ListItem>
                </RecordContextProvider>
            ))}
        </Root>
    );
};

export type FunctionToElement<RecordType extends RaRecord = any> = (
    record: RecordType,
    id: Identifier
) => ReactNode;

export interface SimpleListProps<RecordType extends RaRecord = any>
    extends Omit<ListProps, 'classes'> {
    className?: string;
    empty?: ReactElement;
    hasBulkActions?: boolean;
    leftAvatar?: FunctionToElement<RecordType>;
    leftIcon?: FunctionToElement<RecordType>;
    primaryText?: FunctionToElement<RecordType> | ReactElement | string;
    /**
     * @deprecated use rowClick instead
     */
    linkType?: string | FunctionLinkType | false;

    /**
     * The action to trigger when the user clicks on a row.
     *
     * @see https://marmelab.com/react-admin/Datagrid.html#rowclick
     * @example
     * import { List, Datagrid } from 'react-admin';
     *
     * export const PostList = () => (
     *     <List>
     *         <Datagrid rowClick="edit">
     *             ...
     *         </Datagrid>
     *     </List>
     * );
     */
    rowClick?: string | RowClickFunction | false;
    rightAvatar?: FunctionToElement<RecordType>;
    rightIcon?: FunctionToElement<RecordType>;
    secondaryText?: FunctionToElement<RecordType> | ReactElement | string;
    tertiaryText?: FunctionToElement<RecordType> | ReactElement | string;
    rowSx?: (record: RecordType, index: number) => SxProps;
    rowStyle?: (record: RecordType, index: number) => any;
    // can be injected when using the component without context
    resource?: string;
    data?: RecordType[];
    isLoading?: boolean;
    isPending?: boolean;
    isLoaded?: boolean;
    total?: number;
}

const LinkOrNot = (
    props: LinkOrNotProps & Omit<ListItemProps, 'button' | 'component' | 'id'>
) => {
    const {
        classes: classesOverride,
        //@deprecated: use rowClick instead
        linkType,
        rowClick,
        resource,
        id,
        children,
        record,
        ...rest
    } = props;

    const navigate = useNavigate();
    const getPathForRecord = useGetPathForRecordCallback();
    const handleClick = useCallback(
        async event => {
            event.persist();
            const link =
                // v this is to maintain compatibility with deprecated linkType
                typeof linkType === 'function'
                    ? linkType(record, id)
                    : typeof linkType !== 'undefined'
                    ? linkType
                    : // v this is the new way to handle links
                    typeof rowClick === 'function'
                    ? (record, resource) =>
                          rowClick(record.id, resource, record)
                    : typeof rowClick !== 'undefined'
                    ? rowClick
                    : 'edit';
            const path = await getPathForRecord({
                record,
                resource,
                link,
            });
            console.debug('LinkOrNot handleClick', {
                event,
                path,
                record,
                resource,
                link,
                rowClick,
                linkType,
            });
            if (path === false || path == null) {
                return;
            }
            navigate(path, {
                state: { _scrollToTop: true },
            });
        },
        [record, resource, rowClick, navigate, getPathForRecord]
    );

    return (
        // @ts-ignore
        <ListItemButton component={Link} onClick={handleClick} {...rest}>
            {children}
        </ListItemButton>
    );
};

export type FunctionLinkType = (record: RaRecord, id: Identifier) => string;

export interface LinkOrNotProps {
    // @deprecated: use rowClick instead
    linkType?: string | FunctionLinkType | false;
    rowClick?: string | RowClickFunction | false;
    resource?: string;
    id: Identifier;
    record: RaRecord;
    children: ReactNode;
}

const PREFIX = 'RaSimpleList';

export const SimpleListClasses = {
    tertiary: `${PREFIX}-tertiary`,
};

const Root = styled(List, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${SimpleListClasses.tertiary}`]: { float: 'right', opacity: 0.541176 },
});

const DefaultEmpty = <ListNoResults />;
