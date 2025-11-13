import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import {
    List,
    type ListProps,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { useTimeout } from 'ra-core';

import { Placeholder } from '../Placeholder';

export const SimpleListLoading = (inProps: SimpleListLoadingProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        hasLeftAvatarOrIcon,
        hasRightAvatarOrIcon,
        hasSecondaryText,
        hasTertiaryText,
        nbFakeLines = 5,
        ...rest
    } = props;

    const oneSecondHasPassed = useTimeout(1000);

    return oneSecondHasPassed ? (
        <StyledList className={className} {...rest}>
            {times(nbFakeLines, key => (
                <ListItem
                    key={key}
                    secondaryAction={
                        hasRightAvatarOrIcon ? <Avatar>&nbsp;</Avatar> : null
                    }
                >
                    {hasLeftAvatarOrIcon && (
                        <ListItemAvatar>
                            <Avatar>&nbsp;</Avatar>
                        </ListItemAvatar>
                    )}
                    <ListItemText
                        primary={
                            <div>
                                <Placeholder
                                    className={SimpleListLoadingClasses.primary}
                                />
                                {hasTertiaryText && (
                                    <span
                                        className={
                                            SimpleListLoadingClasses.tertiary
                                        }
                                    >
                                        <Placeholder />
                                    </span>
                                )}
                            </div>
                        }
                        secondary={
                            hasSecondaryText ? <Placeholder /> : undefined
                        }
                    />
                </ListItem>
            ))}
        </StyledList>
    ) : null;
};

const PREFIX = 'RaSimpleListLoading';

export const SimpleListLoadingClasses = {
    primary: `${PREFIX}-primary`,
    tertiary: `${PREFIX}-tertiary`,
};

const StyledList = styled(List, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${SimpleListLoadingClasses.primary}`]: {
        width: '30vw',
        display: 'inline-block',
        marginBottom: theme.spacing(),
    },

    [`& .${SimpleListLoadingClasses.tertiary}`]: {
        float: 'right',
        opacity: 0.541176,
        minWidth: '10vw',
    },
}));

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

export interface SimpleListLoadingProps extends ListProps {
    className?: string;
    hasLeftAvatarOrIcon?: boolean;
    hasRightAvatarOrIcon?: boolean;
    hasSecondaryText?: boolean;
    hasTertiaryText?: boolean;
    nbFakeLines?: number;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSimpleListLoading: 'root' | 'primary' | 'tertiary';
    }

    interface ComponentsPropsList {
        RaSimpleListLoading: Partial<SimpleListLoadingProps>;
    }

    interface Components {
        RaSimpleListLoading?: {
            defaultProps?: ComponentsPropsList['RaSimpleListLoading'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSimpleListLoading'];
        };
    }
}
