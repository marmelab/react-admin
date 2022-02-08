import * as React from 'react';
import { ReactElement } from 'react';
import { Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FieldTitle } from 'ra-core';

/**
 * Wrap a field with a label if necessary.
 *
 * The label is displayed if:
 * - the field has a label prop that is not false, or
 * - the field has a source prop
 *
 * @example
 * <FieldWithLabel>
 *     <FooComponent source="title" />
 * </FieldWithLabel>
 */
export const FieldWithLabel = ({
    label,
    children,
    className = '',
}: FieldWithLabelProps) =>
    children.props.label !== false &&
    typeof children.type !== 'string' &&
    // @ts-ignore
    children.type?.displayName !== 'Labeled' &&
    // @ts-ignore
    children.type?.displayName !== 'FieldWithLabel' ? (
        <Root className={className}>
            <Typography
                color="textSecondary"
                className={FieldWithLabelClasses.label}
            >
                <FieldTitle
                    label={label || children.props.label}
                    source={children.props.source}
                />
            </Typography>
            {children}
        </Root>
    ) : (
        <div className={className}>{children}</div>
    );

FieldWithLabel.displayName = 'FieldWithLabel';

export interface FieldWithLabelProps {
    children: ReactElement;
    className?: string;
    label?: string | ReactElement;
}

const PREFIX = 'RaFieldWithLabel';

export const FieldWithLabelClasses = {
    label: `${PREFIX}-label`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    marginBottom: '0.2em',
    [`& .${FieldWithLabelClasses.label}`]: {
        fontSize: '0.75em',
        marginBottom: '0.2em',
    },
}));
