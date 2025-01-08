import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    RaRecord,
    RecordContextProvider,
    sanitizeListRestProps,
    useGetRecordRepresentation,
    useListContextWithProps,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'ra-core';
import * as React from 'react';
import { isValidElement, ReactElement } from 'react';

import { ListNoResults } from '../ListNoResults';
import { SimpleListLoading } from './SimpleListLoading';
import {
    FunctionToElement,
    SimpleListBaseProps,
    SimpleListItem,
    SimpleListItemProps,
} from './SimpleListItem';

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
 * - linkType: deprecated - 'edit' or 'show', or a function returning 'edit' or 'show' based on the record
 * - rowClick: The action to trigger when the user clicks on a row.
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
        linkType,
        rowClick,
        primaryText,
        rightAvatar,
        rightIcon,
        secondaryText,
        tertiaryText,
        ref,
        rowSx,
        rowStyle,
        resource,
        ...rest
    } = props;
    const { data, isPending, total } =
        useListContextWithProps<RecordType>(props);

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
                    <SimpleListItem
                        key={record.id}
                        rowIndex={rowIndex}
                        linkType={linkType}
                        rowClick={rowClick}
                        rowSx={rowSx}
                        rowStyle={rowStyle}
                        resource={resource}
                    >
                        <SimpleListItemContent
                            leftAvatar={leftAvatar}
                            leftIcon={leftIcon}
                            primaryText={primaryText}
                            rightAvatar={rightAvatar}
                            rightIcon={rightIcon}
                            secondaryText={secondaryText}
                            tertiaryText={tertiaryText}
                            rowIndex={rowIndex}
                        />
                    </SimpleListItem>
                </RecordContextProvider>
            ))}
        </Root>
    );
};

export interface SimpleListProps<RecordType extends RaRecord = any>
    extends SimpleListBaseProps<RecordType>,
        Omit<ListProps, 'classes'> {
    className?: string;
    empty?: ReactElement;
    hasBulkActions?: boolean;
    // can be injected when using the component without context
    resource?: string;
    data?: RecordType[];
    isLoading?: boolean;
    isPending?: boolean;
    isLoaded?: boolean;
    total?: number;
}

const SimpleListItemContent = <RecordType extends RaRecord = any>(
    props: SimpleListItemProps<RecordType>
) => {
    const {
        leftAvatar,
        leftIcon,
        primaryText,
        rightAvatar,
        rightIcon,
        secondaryText,
        tertiaryText,
    } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext<RecordType>(props);
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const translate = useTranslate();

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

    if (!record) return null;

    return (
        <>
            {leftIcon && (
                <ListItemIcon>{leftIcon(record, record.id)}</ListItemIcon>
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
                                <span className={SimpleListClasses.tertiary}>
                                    {typeof tertiaryText === 'string'
                                        ? translate(tertiaryText, {
                                              ...record,
                                              _: tertiaryText,
                                          })
                                        : isValidElement(tertiaryText)
                                          ? tertiaryText
                                          : // @ts-ignore
                                            tertiaryText(record, record.id)}
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
                        <Avatar>{renderAvatar(record, rightAvatar)}</Avatar>
                    )}
                    {rightIcon && (
                        <ListItemIcon>
                            {rightIcon(record, record.id)}
                        </ListItemIcon>
                    )}
                </ListItemSecondaryAction>
            )}
        </>
    );
};

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
