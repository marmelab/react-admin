import * as React from 'react';
import type { ElementType, ReactElement } from 'react';
import {
    Stack,
    type StackProps,
    type Theme,
    Typography,
    type TypographyProps,
} from '@mui/material';
import { type ComponentsOverrides, styled } from '@mui/material/styles';
import { type Property } from 'csstype';
import clsx from 'clsx';

import { FieldTitle } from 'ra-core';
import { useThemeProps, type ResponsiveStyleValue } from '@mui/system';

/**
 * Wrap a field or an input with a label if necessary.
 *
 * The label is displayed if:
 * - the field or input has a label prop that is not false, or
 * - the field or input has a source prop
 *
 * @example
 * <Labeled>
 *     <FooComponent source="title" />
 * </Labeled>
 */
export const Labeled = (inProps: LabeledProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        children,
        className = '',
        color,
        component = 'span',
        fullWidth,
        isRequired,
        label,
        resource,
        source,
        TypographyProps,
        ...rest
    } = props;

    return (
        <Root
            // @ts-ignore https://github.com/mui/material-ui/issues/29875
            component={component}
            className={clsx(className, {
                [LabeledClasses.fullWidth]: fullWidth,
            })}
            {...rest}
        >
            {label !== false &&
            children.props.label !== false &&
            typeof children.type !== 'string' &&
            // @ts-ignore
            children.type?.displayName !== 'Labeled' &&
            // @ts-ignore
            children.type?.displayName !== 'Labeled' ? (
                <Typography
                    sx={
                        color
                            ? { color }
                            : {
                                  color: theme =>
                                      (theme.vars || theme).palette.text
                                          .secondary,
                              }
                    }
                    className={LabeledClasses.label}
                    {...TypographyProps}
                >
                    <FieldTitle
                        label={label || children.props.label}
                        source={source || children.props.source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                </Typography>
            ) : null}
            {children}
        </Root>
    );
};

Labeled.displayName = 'Labeled';

export interface LabeledProps extends StackProps {
    children: ReactElement;
    className?: string;
    color?:
        | ResponsiveStyleValue<Property.Color | Property.Color[]>
        | ((
              theme: Theme
          ) => ResponsiveStyleValue<Property.Color | Property.Color[]>);
    component?: ElementType;
    fullWidth?: boolean;
    htmlFor?: string;
    isRequired?: boolean;
    label?: React.ReactNode;
    resource?: string;
    source?: string;
    TypographyProps?: TypographyProps;
}

const PREFIX = 'RaLabeled';

export const LabeledClasses = {
    label: `${PREFIX}-label`,
    fullWidth: `${PREFIX}-fullWidth`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'inline-flex',
    marginBottom: '0.2em',

    [`&.${LabeledClasses.fullWidth}`]: {
        width: '100%',
    },

    [`& .${LabeledClasses.label}`]: {
        fontSize: '0.75em',
        marginBottom: '0.2em',
    },
});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLabeled: 'root' | 'label' | 'fullWidth';
    }

    interface ComponentsPropsList {
        RaLabeled: Partial<LabeledProps>;
    }

    interface Components {
        RaLabeled?: {
            defaultProps?: ComponentsPropsList['RaLabeled'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLabeled'];
        };
    }
}
