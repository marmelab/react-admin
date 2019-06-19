import React from 'react';
import { addField } from 'ra-core';
import { TextInput } from './TextInput';

export const LongTextInput = props => {
    console.warn(
        'The LongTextInput component is deprecated. You should instead use the TextInput component and set its multiline prop to true.'
    );

    return <TextInput {...props} />;
};

LongTextInput.defaultProps = {
    multiline: true,
};

LongTextInput.displayName = 'LongTextInput';

export default addField(LongTextInput);
