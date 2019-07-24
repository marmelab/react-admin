import React from 'react';
import { addField } from 'ra-core';
import { TextInput } from './TextInput';

/**
 * @deprecated use <TextInput multiline /> instead
 */
export const LongTextInput = props => {
    console.warn(
        'The LongTextInput component is deprecated. You should instead use the TextInput component and set its multiline and fullWidth props to true.'
    );

    return <TextInput {...props} />;
};

LongTextInput.defaultProps = {
    multiline: true,
};

const EnhancedLongTextInput = addField(LongTextInput);

EnhancedLongTextInput.defaultProps = {
    fullWidth: true,
};

export default EnhancedLongTextInput;
