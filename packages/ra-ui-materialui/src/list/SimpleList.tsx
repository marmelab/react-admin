import * as React from 'react';
import { isValidElement, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    List,
    ListProps,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemProps,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
    linkToRecord,
    sanitizeListRestProps,
    useListContext,
    Record,
    RecordMap,
    Identifier,
    RecordContextProvider,
} from 'ra-core';

import SimpleListLoading from './SimpleListLoading';
import { ClassesOverride } from '../types';

const useStyles = makeStyles(
    {
        tertiary: { float: 'right', opacity: 0.541176 },
    },
    { name: 'RaSimpleList' }
);

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
const SimpleList = <RecordType extends Record = Record>(
    props: SimpleListProps<RecordType>
) => {
    const {
        className,
        classes: classesOverride,
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
    const { basePath, data, ids, loaded, total } = useListContext<RecordType>(
        props
    );
    const classes = useStyles(props);

    if (loaded === false) {
        return (
            <SimpleListLoading
                classes={classes}
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

    return (
        total > 0 && (
            <List className={className} {...sanitizeListRestProps(rest)}>
                {ids.map((id, rowIndex) => (
                    <RecordContextProvider key={id} value={data[id]}>
                        <li>
                            <LinkOrNot
                                linkType={linkType}
                                basePath={basePath}
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
                                                (isValidElement(
                                                    tertiaryText
                                                ) ? (
                                                    tertiaryText
                                                ) : (
                                                    <span
                                                        className={
                                                            classes.tertiary
                                                        }
                                                    >
                                                        {tertiaryText(
                                                            data[id],
                                                            id
                                                        )}
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
                        </li>
                    </RecordContextProvider>
                ))}
            </List>
        )
    );
};

SimpleList.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
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
    classes?: ClassesOverride<typeof useStyles>;
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
    basePath?: string;
    data?: RecordMap<RecordType>;
    ids?: Identifier[];
    loaded?: boolean;
    total?: number;
}

const useLinkOrNotStyles = makeStyles(
    {
        link: {},
    },
    { name: 'RaLinkOrNot' }
);

const LinkOrNot = (
    props: LinkOrNotProps & Omit<ListItemProps, 'button' | 'component' | 'id'>
) => {
    const {
        classes: classesOverride,
        linkType,
        basePath,
        id,
        children,
        record,
        ...rest
    } = props;
    const classes = useLinkOrNotStyles({ classes: classesOverride });
    const link =
        typeof linkType === 'function' ? linkType(record, id) : linkType;

    return link === 'edit' || link === true ? (
        <ListItem
            button
            // @ts-ignore
            component={Link}
            to={linkToRecord(basePath, id)}
            className={classes.link}
            {...rest}
        >
            {children}
        </ListItem>
    ) : link === 'show' ? (
        <ListItem
            button
            // @ts-ignore
            component={Link}
            to={`${linkToRecord(basePath, id)}/show`}
            className={classes.link}
            {...rest}
        >
            {children}
        </ListItem>
    ) : link !== false ? (
        <ListItem
            button
            // @ts-ignore
            component={Link}
            to={link}
            className={classes.link}
            {...rest}
        >
            {children}
        </ListItem>
    ) : (
        <ListItem
            // @ts-ignore
            component="div"
            {...rest}
        >
            {children}
        </ListItem>
    );
};

export type FunctionLinkType = (record: Record, id: Identifier) => string;

export interface LinkOrNotProps {
    classes?: ClassesOverride<typeof useLinkOrNotStyles>;
    linkType?: string | FunctionLinkType | boolean;
    basePath: string;
    id: Identifier;
    record: Record;
    children: ReactNode;
}

export default SimpleList;
