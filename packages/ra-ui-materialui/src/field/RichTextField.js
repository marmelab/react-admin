import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import Typography from '@material-ui/core/Typography';
import sanitizeRestProps from './sanitizeRestProps';

export const removeTags = input =>
    input ? input.replace(/<[^>]+>/gm, '') : '';

const RichTextField = ({
    className,
    source,
    record = {},
    stripTags,
    ...rest
}) => {
    const value = get(record, source);
    if (stripTags) {
        return (
            <Typography
                className={className}
                component="span"
                {...sanitizeRestProps(rest)}
            >
                {removeTags(value)}
            </Typography>
        );
    }

    return (
        <Typography
            className={className}
            component="span"
            {...sanitizeRestProps(rest)}
        >
            <span dangerouslySetInnerHTML={{ __html: value }} />
        </Typography>
    );
};

RichTextField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    className: PropTypes.string,
    cellClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    stripTags: PropTypes.bool,
};

const PureRichTextField = pure(RichTextField);

PureRichTextField.defaultProps = {
    addLabel: true,
    stripTags: false,
};

export default PureRichTextField;
