import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

export const removeTags = input =>
    input ? input.replace(/<[^>]+>/gm, '') : '';

const RichTextField = ({ source, record = {}, stripTags, elStyle }) => {
    const value = get(record, source);
    if (stripTags) {
        return <div style={elStyle}>{removeTags(value)}</div>;
    }

    return <div style={elStyle} dangerouslySetInnerHTML={{ __html: value }} />;
};

RichTextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
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
