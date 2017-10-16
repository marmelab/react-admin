import React from 'react';

import Labeled from '../input/Labeled';

const FormInput = ({ input, ...rest }) =>
    input ? (
        <div
            className={`ra-input ra-input-${input.props.source}`}
            style={input.props.style}
        >
            {input.props.addLabel ? (
                <Labeled {...input.props} {...rest}>
                    {input}
                </Labeled>
            ) : (
                React.cloneElement(input, rest)
            )}
        </div>
    ) : null;

export default FormInput;
