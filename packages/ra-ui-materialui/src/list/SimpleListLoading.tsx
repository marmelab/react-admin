import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import List, { ListProps } from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import Placeholder from './Placeholder';
import { useTimeout } from 'ra-core';

const useStyles = makeStyles(
    theme => ({
        primary: {
            width: '30vw',
            display: 'inline-block',
            marginBottom: theme.spacing(),
        },
        tertiary: { float: 'right', opacity: 0.541176, minWidth: '10vw' },
    }),
    { name: 'RaSimpleListLoading' }
);
const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

interface Props {
    classes?: Record<'tertiary', string>;
    className?: string;
    hasLeftAvatarOrIcon?: boolean;
    hasRightAvatarOrIcon?: boolean;
    hasSecondaryText?: boolean;
    hasTertiaryText?: boolean;
    nbFakeLines?: number;
}

const SimpleListLoading = (props: Props & ListProps) => {
    const {
        classes: classesOverride,
        className,
        hasLeftAvatarOrIcon,
        hasRightAvatarOrIcon,
        hasSecondaryText,
        hasTertiaryText,
        nbFakeLines = 5,
        ...rest
    } = props;
    const classes = useStyles(props);
    const oneSecondHasPassed = useTimeout(1000);

    return oneSecondHasPassed ? (
        <List className={className} {...rest}>
            {times(nbFakeLines, key => (
                <ListItem key={key}>
                    {hasLeftAvatarOrIcon && (
                        <ListItemAvatar>
                            <Avatar>&nbsp;</Avatar>
                        </ListItemAvatar>
                    )}
                    <ListItemText
                        primary={
                            <div>
                                <Placeholder className={classes.primary} />
                                {hasTertiaryText && (
                                    <span className={classes.tertiary}>
                                        <Placeholder />
                                    </span>
                                )}
                            </div>
                        }
                        secondary={
                            hasSecondaryText ? <Placeholder /> : undefined
                        }
                    />
                    {hasRightAvatarOrIcon && (
                        <ListItemSecondaryAction>
                            <Avatar>&nbsp;</Avatar>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            ))}
        </List>
    ) : null;
};

SimpleListLoading.propTypes = {
    className: PropTypes.string,
    hasLeftAvatarOrIcon: PropTypes.bool,
    hasRightAvatarOrIcon: PropTypes.bool,
    hasSecondaryText: PropTypes.bool,
    hasTertiaryText: PropTypes.bool,
    nbFakeLines: PropTypes.number,
};

export default SimpleListLoading;
