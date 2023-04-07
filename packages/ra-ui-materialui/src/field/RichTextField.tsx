import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { Call, Objects } from 'hotscript';
import { useRecordContext } from 'ra-core';
import purify from 'dompurify';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { InjectedFieldProps, PublicFieldProps, fieldPropTypes } from './types';

/**
 * A version of React.memo that preserves the original component type allowing it to accept generics.
 * See {@link https://stackoverflow.com/a/70890101}
 */
const genericMemo: <T>(component: T) => T = memo;

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
const RichTextFieldImpl = (props: RichTextFieldProps) => {
    const { className, emptyText, source, stripTags = false, ...rest } = props;
    const record = useRecordContext(props);
    const value = get(record, source);

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
                removeTags(value.toString())
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: purify.sanitize(value),
                    }}
                />
            )}
        </Typography>
    );
};

export const RichTextField = genericMemo(RichTextFieldImpl);

// @ts-ignore
RichTextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
};

// @ts-ignore
RichTextField.displayName = 'RichTextField';

export interface RichTextFieldProps<
    RecordType extends Record<string, unknown> = Record<string, unknown>
> extends PublicFieldProps,
        InjectedFieldProps<RecordType>,
        Omit<TypographyProps, 'textAlign'> {
    stripTags?: boolean;
    source?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
    sortBy?: unknown extends RecordType
        ? string
        : Call<Objects.AllPaths, RecordType>;
}

export const removeTags = (input: string) =>
    input ? input.replace(/<[^>]+>/gm, '') : '';
