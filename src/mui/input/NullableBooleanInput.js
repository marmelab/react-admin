import React, { PropTypes } from 'react';
import SelectInput from './SelectInput';

const NullableBooleanInput = ({ input, meta: { touched, error }, label, source, elStyle, resource }) => (
    <SelectInput
        input={input}
        label={label}
        source={source}
        resource={resource}
        choices={[
            { id: null, name: '' },
            { id: false, name: 'aor.boolean.false' },
            { id: true, name: 'aor.boolean.true' },
        ]}
        errorText={touched && error}
        style={elStyle}
    />
);

NullableBooleanInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

NullableBooleanInput.defaultProps = {
    addField: true,
};

export default NullableBooleanInput;
