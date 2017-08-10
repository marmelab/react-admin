import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import withDatagridSupport from '../list/withDatagridSupport';

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

const PureTextField = compose(pure, withDatagridSupport)(TextField);

PureTextField.defaultProps = {
    addLabel: true,
};

export default PureTextField;
