import * as React from 'react';
import { ReactElement } from 'react';
import { Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import { FieldTitle } from 'ra-core';

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
    isRequired,
    label,
    resource,
    source,
}: FieldWithLabelProps) =>
    label !== false &&
    children.props.label !== false &&
    typeof children.type !== 'string' &&
    // @ts-ignore
    children.type?.displayName !== 'Labeled' &&
    // @ts-ignore
    children.type?.displayName !== 'Labeled' ? (
        <Root className={className}>
            <Typography
                color="textSecondary"
                className={FieldWithLabelClasses.label}
            >
                <FieldTitle
                    label={label || children.props.label}
                    source={source || children.props.source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </Typography>
            {children}
        </Root>
    ) : (
        <div className={className}>{children}</div>
    );

Labeled.displayName = 'Labeled';

export interface FieldWithLabelProps {
    children: ReactElement;
    className?: string;
    isRequired?: boolean;
    label?: string | ReactElement | false;
    resource?: string;
    source?: string;
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
