import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import compose from 'recompose/compose';
import pure from 'recompose/pure';

import withDatagridSupport from '../list/withDatagridSupport';

const UrlField = ({ source, record = {}, elStyle }) =>
    <a href={get(record, source)} style={elStyle}>
        {get(record, source)}
    </a>;

UrlField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureUrlField = compose(pure, withDatagridSupport)(UrlField);

PureUrlField.defaultProps = {
    addLabel: true,
};

export default PureUrlField;
