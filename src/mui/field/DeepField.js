import React, { PropTypes } from 'react';
import at from 'lodash.at';

const DeepField = ({ record = {}, path, children, ...rest }) => React.cloneElement(children, { record: at(record, path).pop(), ...rest });

DeepField.propTypes = {
    record: PropTypes.object,
    label: PropTypes.string,
    path: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default DeepField;
