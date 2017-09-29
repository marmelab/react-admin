import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

export const AddressField = ({ source, record = {}, elStyle }) => {
    const address = get(record, source);
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Mac/i)) {
        return (
            <a href={`http://maps.apple.com/?q=${address}`}>
                <span style={elStyle}>{address}</span>
            </a>
        );
    }
    if (navigator.userAgent.match(/Android/i)) {
        return (
            <a href={`geo:?q=${address}`}>
                <span style={elStyle}>{address}</span>
            </a>
        );
    }
    return (
        <a
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${address}`}
        >
            <span style={elStyle}>{address}</span>
        </a>
    );
};

AddressField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureAddressField = pure(AddressField);

PureAddressField.defaultProps = {
    addLabel: true,
};

export default PureAddressField;
