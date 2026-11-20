import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useFieldValue, useTranslate, genericMemo } from 'ra-core';
import purify from 'dompurify';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';

/**
 * Render an HTML string as rich text
 *
 * Note: This component leverages the `dangerouslySetInnerHTML` attribute,
 * but uses the DomPurify library to sanitize the HTML before rendering it.
 *
 * It means it is safe from Cross-Site Scripting (XSS) attacks - but it's still
 * a good practice to sanitize the value server-side.
 *
 * @example
 * <RichTextField source="description" />
 *
 * @example // remove all tags and output text only
 * <RichTextField source="description" stripTags />
 */
const RichTextFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    inProps: RichTextFieldProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        className,
        emptyText,
        stripTags = false,
        purifyOptions,
        ...rest
    } = props;
    const value = useFieldValue(props);
    const translate = useTranslate();

    return (
        <StyledTypography
            className={className}
            variant="body2"
            component="span"
            {...sanitizeFieldRestProps(rest)}
        >
            {(value == null || value === '') && emptyText ? (
                translate(emptyText, { _: emptyText })
            ) : stripTags ? (
                removeTags(value)
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(
                            value,
                            getPurifyOptions(purifyOptions)
                        ),
                    }}
                />
            )}
        </StyledTypography>
    );
};
RichTextFieldImpl.displayName = 'RichTextFieldImpl';

export const RichTextField = genericMemo(RichTextFieldImpl);

// We only support the case when sanitize() returns a string
// hence we need to force the RETURN_DOM_FRAGMENT and RETURN_DOM
// options to false
export type PurifyOptions = purify.Config & {
    RETURN_DOM_FRAGMENT?: false | undefined;
    RETURN_DOM?: false | undefined;
};

const DEFAULT_FORBIDDEN_TAGS = [
    'style',
    'form',
    'input',
    'button',
    'select',
    'textarea',
    'dialog',
];

// DOMPurify gives FORBID_TAGS precedence over ALLOWED_TAGS and ADD_TAGS,
// so the default forbidden tags must exclude the tags the user allows
const getPurifyOptions = (purifyOptions: PurifyOptions = {}): PurifyOptions => {
    const {
        ALLOWED_TAGS = [],
        ADD_TAGS = [],
        FORBID_TAGS = [],
    } = purifyOptions;
    const allowedTags = [
        ...ALLOWED_TAGS,
        ...(Array.isArray(ADD_TAGS) ? ADD_TAGS : []),
    ].map(tag => tag.toLowerCase());
    const isAllowed = (tag: string) =>
        allowedTags.includes(tag) ||
        (typeof ADD_TAGS === 'function' && ADD_TAGS(tag));
    return {
        ...purifyOptions,
        FORBID_TAGS: [
            ...DEFAULT_FORBIDDEN_TAGS.filter(tag => !isAllowed(tag)),
            ...FORBID_TAGS,
        ],
    };
};

export interface RichTextFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    stripTags?: boolean;
    purifyOptions?: PurifyOptions;
}

export const removeTags = (input: string) => {
    if (!input) {
        return '';
    }

    let output = '';
    let isInsideTag = false;

    for (const character of input) {
        if (character === '<') {
            isInsideTag = true;
            continue;
        }

        if (character === '>') {
            if (isInsideTag) {
                isInsideTag = false;
                continue;
            }
        }

        if (!isInsideTag) {
            output += character;
        }
    }

    return output;
};

const PREFIX = 'RaRichTextField';

const StyledTypography = styled(Typography, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        [PREFIX]: 'root';
    }

    interface ComponentsPropsList {
        [PREFIX]: Partial<RichTextFieldProps>;
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
