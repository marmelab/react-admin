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
    const { data, ids, loaded, total } = useListContext<RecordType>(props);
    const resource = useResourceContext(props);

    if (loaded === false) {
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
        id: Identifier,
        avatarCallback: FunctionToElement<RecordType>
    ) => {
        const avatarValue = avatarCallback(data[id], id);
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
            {ids.map((id, rowIndex) => (
                <RecordContextProvider key={id} value={data[id]}>
                    <ListItem>
                        <LinkOrNot
                            linkType={linkType}
                            resource={resource}
                            id={id}
                            record={data[id]}
                            style={
                                rowStyle
                                    ? rowStyle(data[id], rowIndex)
                                    : undefined
                            }
                        >
                            {leftIcon && (
                                <ListItemIcon>
                                    {leftIcon(data[id], id)}
                                </ListItemIcon>
                            )}
                            {leftAvatar && (
                                <ListItemAvatar>
                                    {renderAvatar(id, leftAvatar)}
                                </ListItemAvatar>
                            )}
                            <ListItemText
                                primary={
                                    <div>
                                        {isValidElement(primaryText)
                                            ? primaryText
                                            : primaryText(data[id], id)}

                                        {!!tertiaryText &&
                                            (isValidElement(tertiaryText) ? (
                                                tertiaryText
                                            ) : (
                                                <span
                                                    className={
                                                        SimpleListClasses.tertiary
                                                    }
                                                >
                                                    {tertiaryText(data[id], id)}
                                                </span>
                                            ))}
                                    </div>
                                }
                                secondary={
                                    !!secondaryText &&
                                    (isValidElement(secondaryText)
                                        ? secondaryText
                                        : secondaryText(data[id], id))
                                }
                            />
                            {(rightAvatar || rightIcon) && (
                                <ListItemSecondaryAction>
                                    {rightAvatar && (
                                        <Avatar>
                                            {renderAvatar(id, rightAvatar)}
                                        </Avatar>
                                    )}
                                    {rightIcon && (
                                        <ListItemIcon>
                                            {rightIcon(data[id], id)}
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
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    loaded?: boolean;
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
