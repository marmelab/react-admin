import React from 'react';
import TextInput from './TextInput';

/**
 * @deprecated use <TextInput multiline /> instead
 */
export const LongTextInput = props => {
    return <TextInput {...props} />;
};

LongTextInput.defaultProps = {
    multiline: true,
    fullWidth: true,
};

export default LongTextInput;
