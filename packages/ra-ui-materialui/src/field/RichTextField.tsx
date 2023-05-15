import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useRecordContext } from 'ra-core';
import purify from 'dompurify';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { FieldProps, fieldPropTypes } from './types';
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
    RecordType extends Record<string, unknown> = Record<string, any>
>(
    props: RichTextFieldProps<RecordType>
) => {
    const {
        className,
        emptyText,
        source,
        stripTags = false,
        purifyOptions,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const value = get(record, source)?.toString();

    return (
        <Typography
            className={className}
            variant="body2"
            component="span"
            {...sanitizeFieldRestProps(rest)}
        >
            {value == null && emptyText ? (
                emptyText
            ) : stripTags ? (
                removeTags(value)
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(value, purifyOptions),
                    }}
                />
            )}
        </Typography>
    );
};

export const RichTextField = genericMemo(RichTextFieldImpl);

RichTextFieldImpl.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
    purifyOptions: PropTypes.any,
};

RichTextField.propTypes = RichTextFieldImpl.propTypes;

// We only support the case when sanitize() returns a string
// hence we need to force the RETURN_DOM_FRAGMENT and RETURN_DOM
// options to false
export type PurifyOptions = purify.Config & {
    RETURN_DOM_FRAGMENT?: false | undefined;
    RETURN_DOM?: false | undefined;
};

export interface RichTextFieldProps<
    RecordType extends Record<string, unknown> = Record<string, any>
> extends FieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    stripTags?: boolean;
    purifyOptions?: PurifyOptions;
}

RichTextFieldImpl.displayName = 'RichTextFieldImpl';
RichTextField.displayName = 'RichTextField';

export const removeTags = (input: string) =>
    input ? input.replace(/<[^>]+>/gm, '') : '';
