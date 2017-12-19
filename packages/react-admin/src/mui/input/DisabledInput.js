import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

const DisabledInput = ({
    basePath,
    classes,
    className,
    initializeForm,
    meta,
    record,
    defaultValue,
    input: { value },
    isRequired,
    label,
    resource,
    source,
    options,
    textAlign,
    ...rest
}) => (
    <TextField
        disabled
        margin="normal"
        value={value}
        label={<FieldTitle label={label} source={source} resource={resource} />}
        className={className}
        classes={classes}
        {...options}
        {...rest}
    />
);

DisabledInput.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    input: PropTypes.object,
};

export default addField(DisabledInput);
