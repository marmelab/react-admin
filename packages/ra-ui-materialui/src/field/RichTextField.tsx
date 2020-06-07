import * as React from 'react';
import { FunctionComponent, memo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import sanitizeRestProps from './sanitizeRestProps';
import { InjectedFieldProps, FieldProps, fieldPropTypes } from './types';

export const removeTags = (input: string) =>
    input ? input.replace(/<[^>]+>/gm, '') : '';

interface Props extends FieldProps {
    stripTags: boolean;
}

const RichTextField: FunctionComponent<
    Props & InjectedFieldProps & TypographyProps
> = memo<Props & InjectedFieldProps & TypographyProps>(
    ({ className, emptyText, source, record = {}, stripTags, ...rest }) => {
        const value = get(record, source);

        return (
            <Typography
                className={className}
                variant="body2"
                component="span"
                {...sanitizeRestProps(rest)}
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

RichTextField.defaultProps = {
    addLabel: true,
    stripTags: false,
};

RichTextField.propTypes = {
    // @ts-ignore
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
};

RichTextField.displayName = 'RichTextField';

export default RichTextField;
