import * as React from 'react';
import { type ReactNode, type ElementType } from 'react';
import { styled, type ComponentsOverrides } from '@mui/material/styles';
import {
    Stack,
    Typography,
    useThemeProps,
    type StackProps,
    type SxProps,
    type TypographyProps,
} from '@mui/material';
import {
    FieldTitle,
    useRecordContext,
    useResourceContext,
    useTranslate,
    type ExtractRecordPaths,
    type HintedString,
} from 'ra-core';
import clsx from 'clsx';

import { TextField } from './TextField';

const PREFIX = 'RaRecordField';

export const RecordField = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    inProps: RecordFieldProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        children,
        className,
        empty,
        field,
        label,
        render,
        source,
        sx,
        TypographyProps,
        variant,
        ...rest
    } = props;
    const resource = useResourceContext();
    const record = useRecordContext<RecordType>(props);
    const translate = useTranslate();
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
            {children ? (
                <span className={RecordFieldClasses.value}>{children}</span>
            ) : render ? (
                record && (
                    <Typography
                        component="span"
                        variant="body2"
                        className={RecordFieldClasses.value}
                    >
                        {render(record) ||
                            (typeof empty === 'string'
                                ? translate(empty, { _: empty })
                                : empty)}
                    </Typography>
                )
            ) : field ? (
                React.createElement(field, {
                    source,
                    emptyText: empty as string,
                    className: RecordFieldClasses.value,
                })
            ) : source ? (
                <TextField
                    source={source}
                    emptyText={empty as string}
                    resource={resource}
                    className={RecordFieldClasses.value}
                />
            ) : null}
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
    empty?: ReactNode;
    field?: ElementType;
    label?: ReactNode;
    render?: (record: RecordType) => React.ReactNode;
    source?: NoInfer<HintedString<ExtractRecordPaths<RecordType>>>;
    record?: RecordType;
    sx?: SxProps;
    TypographyProps?: TypographyProps;
    variant?: 'default' | 'inline';
}

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
        fontSize: '0.75rem',
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaRecordField: 'root' | 'label' | 'value' | 'inline';
    }

    interface ComponentsPropsList {
        RaRecordField: Partial<RecordFieldProps>;
    }

    interface Components {
        RaRecordField?: {
            defaultProps?: ComponentsPropsList['RaRecordField'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaRecordField'];
        };
    }
}
