import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';
import compose from 'recompose/compose';

import withDatagridSupport from '../list/withDatagridSupport';

const EmailField = ({ source, record = {}, elStyle }) =>
    <a style={elStyle} href={`mailto:${get(record, source)}`}>
        {get(record, source)}
    </a>;

EmailField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureEmailField = compose(pure, withDatagridSupport)(EmailField);

PureEmailField.defaultProps = {
    addLabel: true,
};

export default PureEmailField;
