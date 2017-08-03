import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import withDatagridHeader from '../list/withDatagridHeader';

const TextField = ({ source, record = {}, elStyle }) => {
    return (
        <span style={elStyle}>
            {get(record, source)}
        </span>
    );
};

TextField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureTextField = compose(pure, withDatagridHeader)(TextField);

PureTextField.defaultProps = {
    addLabel: true,
};

export default PureTextField;
