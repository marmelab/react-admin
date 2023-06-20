import * as React from 'react';
import { ElementType, ReactElement } from 'react';
import { Stack, StackProps, Theme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Property } from 'csstype';
import clsx from 'clsx';

import { FieldTitle } from 'ra-core';
import { ResponsiveStyleValue } from '@mui/system';

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
export const Labeled = ({
    children,
    className = '',
    color = 'textSecondary',
    component = 'span',
    fullWidth,
    isRequired,
    label,
    resource,
    source,
    ...rest
}: LabeledProps) => (
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
            <Typography color={color} className={LabeledClasses.label}>
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
    label?: string | ReactElement | boolean;
    resource?: string;
    source?: string;
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
