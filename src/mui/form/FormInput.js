import React from 'react';

const FormInput = ({ input, ...rest }) =>
    input ? (
        <div
            className={`aor-input aor-input-${input.props.source}`}
            style={input.props.style}
        >
            {React.cloneElement(input, rest)}
        </div>
    ) : null;

export default FormInput;
