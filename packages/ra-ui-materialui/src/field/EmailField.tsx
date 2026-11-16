import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Link, LinkProps } from '@mui/material';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { useFieldValue, useTranslate, genericMemo } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';

const EmailFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    inProps: EmailFieldProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const { className, emptyText, ...rest } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    if (value == null) {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        ) : null;
    }

    return (
        <StyledLink
            className={className}
            href={getMailtoUrl(value)}
            onClick={stopPropagation}
            variant="body2"
            {...sanitizeFieldRestProps(rest)}
        >
            {value}
        </StyledLink>
    );
};
EmailFieldImpl.displayName = 'EmailFieldImpl';

export const EmailField = genericMemo(EmailFieldImpl);

export interface EmailFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<LinkProps, 'textAlign'> {}

// "?", "&", "=", "#" and "%" are legal in an email address but are delimiters
// in a mailto: URL, so they are percent-encoded. "," and ";" are kept to
// separate several addresses.
// @see https://www.rfc-editor.org/rfc/rfc6068#section-2
const getMailtoUrl = (value: any) =>
    `mailto:${String(value).replace(
        /[^\w@.+\-,;\u0080-\uffff]/g,
        encodeURIComponent
    )}`;

// useful to prevent click bubbling in a Datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

const PREFIX = 'RaEmailField';

const StyledLink = styled(Link, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<EmailFieldProps>;
    }

    interface Components {
        [PREFIX]?: {
            defaultProps?: ComponentsPropsList[typeof PREFIX];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >[typeof PREFIX];
        };
    }
}
