import React, { PropTypes } from 'react';
import SelectInput from './SelectInput';

const BooleanInput = ({ input, meta: { touched, error }, label }) => (
    <SelectInput
        input={input}
        label={label}
        choices={[
            { value: null, label: '' },
            { value: false, label: 'No' },
            { value: true, label: 'Yes' },
        ]}
        optionText="label"
        optionValue="value"
        errorText={touched && error}
    />
);

NullableBooleanInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
};

BooleanInput.defaultProps = {
    includesLabel: true,
};

export default BooleanInput;
