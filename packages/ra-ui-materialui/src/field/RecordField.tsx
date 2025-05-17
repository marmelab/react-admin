import * as React from 'react';
import { type ReactNode, type ElementType } from 'react';
import { styled } from '@mui/material/styles';
import {
    Stack,
    Typography,
    type StackProps,
    type SxProps,
    type TypographyProps,
} from '@mui/material';
import {
    FieldTitle,
    useRecordContext,
    useResourceContext,
    type ExtractRecordPaths,
    type HintedString,
    type RaRecord,
} from 'ra-core';
import clsx from 'clsx';

import { TextField } from './TextField';

export const RecordField = <
    RecordType extends Record<string, any> = Record<string, any>,
>({
    children,
    className,
    field,
    label,
    render,
    source,
    sx,
    TypographyProps,
    variant,
    ...rest
}: RecordFieldProps<RecordType>) => {
    const resource = useResourceContext();
    const record = useRecordContext<RecordType>();
    if (!source && !label) return null;
    return (
        <Root
            sx={sx}
            className={clsx(className, {
                [RecordFieldClasses.inline]: variant === 'inline',
            })}
            {...rest}
        >
            {label !== '' && label !== false ? (
                <Typography
                    className={RecordFieldClasses.label}
                    {...TypographyProps}
                >
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={false}
                    />
                </Typography>
            ) : null}
            {children ??
                (render ? (
                    record && (
                        <Typography
                            component="span"
                            variant="body2"
                            className={RecordFieldClasses.value}
                        >
                            {render(record)}
                        </Typography>
                    )
                ) : field ? (
                    React.createElement(field, {
                        source,
                        className: RecordFieldClasses.value,
                    })
                ) : source ? (
                    <TextField
                        source={source}
                        className={RecordFieldClasses.value}
                    />
                ) : null)}
        </Root>
    );
};

// FIXME remove custom type when using TypeScript >= 5.4 as it is now native
type NoInfer<T> = T extends infer U ? U : never;

export interface RecordFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends StackProps {
    children?: ReactNode;
    className?: string;
    field?: ElementType;
    label?: ReactNode;
    render?: (record: RecordType) => React.ReactNode;
    source?: NoInfer<HintedString<ExtractRecordPaths<RecordType>>>;
    record?: RaRecord;
    sx?: SxProps;
    TypographyProps?: TypographyProps;
    variant?: 'default' | 'inline';
}

const PREFIX = 'RaRecordField';

export const RecordFieldClasses = {
    label: `${PREFIX}-label`,
    value: `${PREFIX}-value`,
    inline: `${PREFIX}-inline`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`&.${RecordFieldClasses.inline}`]: {
        flexDirection: 'row',
    },
    [`& .${RecordFieldClasses.label}`]: {
        fontSize: '0.75em',
        marginBottom: '0.2em',
        color: (theme.vars || theme).palette.text.secondary,
    },
    [`&.${RecordFieldClasses.inline} .${RecordFieldClasses.label}`]: {
        fontSize: '0.875rem',
        display: 'block',
        minWidth: 150,
    },
    [`& .${RecordFieldClasses.value}`]: {
        flex: 1,
    },
}));
