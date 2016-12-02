import React, { PropTypes } from 'react';
import SelectInput from './SelectInput';

const NullableBooleanInput = ({ input, meta: { touched, error }, label }) => (
    <SelectInput
        input={input}
        label={label}
        choices={[
            { id: null, name: '' },
            { id: false, name: 'No' },
            { id: true, name: 'Yes' },
        ]}
        errorText={touched && error}
    />
);

NullableBooleanInput.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
};

NullableBooleanInput.defaultProps = {
    includesLabel: true,
};

export default NullableBooleanInput;
