import * as React from 'react';
import { styled } from '@mui/material/styles';
import { isValidElement, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';
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
    linkToRecord,
    Record,
    RecordContextProvider,
    RecordMap,
    sanitizeListRestProps,
    useListContext,
    useResourceContext,
} from 'ra-core';

import { SimpleListLoading } from './SimpleListLoading';

/**
 * The <SimpleList> component renders a list of records as a material-ui <List>.
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
 *
 * @example // Display all posts as a List
 * const postRowStyle = (record, index) => ({
 *     backgroundColor: record.views >= 500 ? '#efe' : 'white',
 * });
 * export const PostList = (props) => (
 *     <List {...props}>
 *         <SimpleList
 *             primaryText={record => record.title}
 *             secondaryText={record => `${record.views} views`}
 *             tertiaryText={record =>
 *                 new Date(record.published_at).toLocaleDateString()
 *             }
 *             rowStyle={postRowStyle}
 *          />
 *     </List>
 * );
 */
export const SimpleList = <RecordType extends Record = Record>(
    props: SimpleListProps<RecordType>
) => {
    const {
        className,
        hasBulkActions,
        leftAvatar,
        leftIcon,
        linkType = 'edit',
        primaryText,
        rightAvatar,
        rightIcon,
        secondaryText,
        tertiaryText,
        rowStyle,
        ...rest
    } = props;
    const { data, isLoading, total } = useListContext<RecordType>(props);
    const resource = useResourceContext(props);

    if (isLoading === true) {
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

    return total > 0 ? (
        <Root className={className} {...sanitizeListRestProps(rest)}>
            {data.map((record, rowIndex) => (
                <RecordContextProvider key={record.id} value={record}>
                    <ListItem>
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
                                        {isValidElement(primaryText)
                                            ? primaryText
                                            : primaryText(record, record.id)}

                                        {!!tertiaryText &&
                                            (isValidElement(tertiaryText) ? (
                                                tertiaryText
                                            ) : (
                                                <span
                                                    className={
                                                        SimpleListClasses.tertiary
                                                    }
                                                >
                                                    {tertiaryText(
                                                        record,
                                                        record.id
                                                    )}
                                                </span>
                                            ))}
                                    </div>
                                }
                                secondary={
                                    !!secondaryText &&
                                    (isValidElement(secondaryText)
                                        ? secondaryText
                                        : secondaryText(record, record.id))
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
    ) : null;
};

SimpleList.propTypes = {
    className: PropTypes.string,
    leftAvatar: PropTypes.func,
    leftIcon: PropTypes.func,
    linkType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    primaryText: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    rightAvatar: PropTypes.func,
    rightIcon: PropTypes.func,
    secondaryText: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    tertiaryText: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    rowStyle: PropTypes.func,
};

export type FunctionToElement<RecordType extends Record = Record> = (
    record: RecordType,
    id: Identifier
) => ReactNode;

export interface SimpleListProps<RecordType extends Record = Record>
    extends Omit<ListProps, 'classes'> {
    className?: string;
    hasBulkActions?: boolean;
    leftAvatar?: FunctionToElement<RecordType>;
    leftIcon?: FunctionToElement<RecordType>;
    primaryText?: FunctionToElement<RecordType> | ReactElement;
    linkType?: string | FunctionLinkType | boolean;
    rightAvatar?: FunctionToElement<RecordType>;
    rightIcon?: FunctionToElement<RecordType>;
    secondaryText?: FunctionToElement<RecordType> | ReactElement;
    tertiaryText?: FunctionToElement<RecordType> | ReactElement;
    rowStyle?: (record: Record, index: number) => any;
    // can be injected when using the component without context
    resource?: string;
    data?: RecordType[];
    isLoading?: boolean;
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
    const link =
        typeof linkType === 'function' ? linkType(record, id) : linkType;

    return link === 'edit' || link === true ? (
        // @ts-ignore
        <ListItemButton
            component={Link}
            to={linkToRecord(`/${resource}`, id)}
            {...rest}
        >
            {children}
        </ListItemButton>
    ) : link === 'show' ? (
        // @ts-ignore
        <ListItemButton
            component={Link}
            to={`${linkToRecord(`/${resource}`, id)}/show`}
            {...rest}
        >
            {children}
        </ListItemButton>
    ) : link !== false ? (
        // @ts-ignore
        <ListItemButton component={Link} to={link} {...rest}>
            {children}
        </ListItemButton>
    ) : (
        <ListItemText
            // @ts-ignore
            component="div"
            {...rest}
        >
            {children}
        </ListItemText>
    );
};

export type FunctionLinkType = (record: Record, id: Identifier) => string;

export interface LinkOrNotProps {
    linkType?: string | FunctionLinkType | boolean;
    resource: string;
    id: Identifier;
    record: Record;
    children: ReactNode;
}

const PREFIX = 'RaSimpleList';

export const SimpleListClasses = {
    tertiary: `${PREFIX}-tertiary`,
};

const Root = styled(List, { name: PREFIX })({
    [`& .${SimpleListClasses.tertiary}`]: { float: 'right', opacity: 0.541176 },
});
