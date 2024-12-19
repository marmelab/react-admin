import * as React from 'react';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/material';
import { isValidElement, ReactNode, ReactElement } from 'react';
import {
    Avatar,
    List,
    ListProps,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemProps,
    ListItemSecondaryAction,
    ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Identifier,
    RaRecord,
    RecordContextProvider,
    sanitizeListRestProps,
    useListContextWithProps,
    useResourceContext,
    useGetRecordRepresentation,
    useCreatePath,
    useTranslate,
} from 'ra-core';

import { SimpleListLoading } from './SimpleListLoading';
import { ListNoResults } from '../ListNoResults';

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
 * - linkType: 'edit' or 'show', or a function returning 'edit' or 'show' based on the record
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
export const SimpleList = <RecordType extends RaRecord = any>(
    props: SimpleListProps<RecordType>
) => {
    const {
        className,
        empty = DefaultEmpty,
        hasBulkActions,
        leftAvatar,
        leftIcon,
        linkType = 'edit',
        primaryText,
        rightAvatar,
        rightIcon,
        secondaryText,
        tertiaryText,
        rowSx,
        rowStyle,
        ...rest
    } = props;
    const { data, isPending, total } =
        useListContextWithProps<RecordType>(props);
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
                    <ListItem
                        disablePadding
                        sx={{
                            '.MuiListItem-container': {
                                width: '100%',
                            },
                        }}
                    >
                        <LinkOrNot
                            linkType={linkType}
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
                                                    primaryText(
                                                        record,
                                                        record.id
                                                    )
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
    linkType?: string | FunctionLinkType | false;
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
        linkType,
        resource,
        id,
        children,
        record,
        ...rest
    } = props;
    const createPath = useCreatePath();
    const type =
        typeof linkType === 'function' ? linkType(record, id) : linkType;

    if (type === false) {
        return <ListItem {...rest}>{children}</ListItem>;
    }
    return (
        // @ts-ignore
        <ListItemButton
            component={Link}
            to={createPath({ resource, id, type })}
            {...rest}
        >
            {children}
        </ListItemButton>
    );
};

export type FunctionLinkType = (record: RaRecord, id: Identifier) => string;

export interface LinkOrNotProps {
    linkType: string | FunctionLinkType | false;
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
