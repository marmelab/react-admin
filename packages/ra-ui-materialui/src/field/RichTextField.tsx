import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useFieldValue, useTranslate } from 'ra-core';
import purify from 'dompurify';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps } from './types';
import { genericMemo } from './genericMemo';

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
    props: RichTextFieldProps<RecordType>
) => {
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
        <Typography
            className={className}
            variant="body2"
            component="span"
            {...sanitizeFieldRestProps(rest)}
        >
            {value == null && emptyText ? (
                translate(emptyText, { _: emptyText })
            ) : stripTags ? (
                removeTags(value)
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(value, purifyOptions || {}),
                    }}
                />
            )}
        </Typography>
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

export interface RichTextFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    stripTags?: boolean;
    purifyOptions?: PurifyOptions;
}

export const removeTags = (input: string) =>
    input ? input.replace(/<[^>]+>/gm, '') : '';
