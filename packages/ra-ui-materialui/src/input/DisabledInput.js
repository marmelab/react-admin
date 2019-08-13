import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { useInput, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

const DisabledInput = ({
    record,
    label,
    resource,
    source,
    options,
    ...rest
}) => {
    const {
        id,
        input: { value },
    } = useInput({
        resource,
        source,
        type: 'checkbox',
    });

    return (
        <TextField
            id={id}
            value={value}
            disabled
            margin="normal"
            label={
                <FieldTitle label={label} source={source} resource={resource} />
            }
            {...options}
            {...sanitizeRestProps(rest)}
        />
    );
};

DisabledInput.propTypes = {
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

export default DisabledInput;
