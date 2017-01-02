import React, { PropTypes } from 'react';
import SelectInput from './SelectInput';
import title from '../../util/title';

const NullableBooleanInput = ({ input, meta: { touched, error }, label, source, elStyle }) => (
    <SelectInput
        input={input}
        label={title(label, source)}
        choices={[
            { id: null, name: '' },
            { id: false, name: 'No' },
            { id: true, name: 'Yes' },
        ]}
        errorText={touched && error}
        style={elStyle}
    />
);

NullableBooleanInput.propTypes = {
    elStyle: PropTypes.object,
    includesField: PropTypes.bool.isRequired,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
    source: PropTypes.string,
};

NullableBooleanInput.defaultProps = {
    includesField: false,
    includesLabel: true,
};

export default NullableBooleanInput;
