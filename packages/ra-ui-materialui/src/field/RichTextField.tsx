import * as React from 'react';
import { FC, memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { useRecordContext } from 'ra-core';

import { sanitizeFieldRestProps } from './sanitizeFieldRestProps';
import { InjectedFieldProps, PublicFieldProps, fieldPropTypes } from './types';

export const RichTextField: FC<RichTextFieldProps> = memo<RichTextFieldProps>(
    props => {
        const {
            className,
            emptyText,
            source,
            stripTags = false,
            ...rest
        } = props;
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
                    removeTags(value)
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: value }} />
                )}
            </Typography>
        );
    }
);

RichTextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
};

export interface RichTextFieldProps
    extends PublicFieldProps,
        InjectedFieldProps,
        Omit<TypographyProps, 'textAlign'> {
    stripTags?: boolean;
}

RichTextField.displayName = 'RichTextField';

export const removeTags = (input: string) =>
    input ? input.replace(/<[^>]+>/gm, '') : '';
