import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import sanitizeRestProps from './sanitizeRestProps';
import { InjectedFieldProps, FieldProps, fieldPropTypes } from './types';

export const removeTags = (input: string) => (input ? input.replace(/<[^>]+>/gm, '') : '');

interface Props extends FieldProps {
    stripTags: boolean;
}

const RichTextField: SFC<Props & InjectedFieldProps & TypographyProps> = ({
    className,
    source,
    record = {},
    stripTags,
    ...rest
}) => {
    const value = get(record, source);
    if (stripTags) {
        return (
            <Typography className={className} component="span" {...sanitizeRestProps(rest)}>
                {removeTags(value)}
            </Typography>
        );
    }

    return (
        <Typography className={className} component="span" {...sanitizeRestProps(rest)}>
            <span dangerouslySetInnerHTML={{ __html: value }} />
        </Typography>
    );
};

const EnhancedRichTextField = pure<Props & TypographyProps>(RichTextField);

EnhancedRichTextField.defaultProps = {
    addLabel: true,
    stripTags: false,
};

EnhancedRichTextField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
    stripTags: PropTypes.bool,
};

EnhancedRichTextField.displayName = 'EnhancedRichTextField';

export default EnhancedRichTextField;
