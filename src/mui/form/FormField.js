import React from 'react';
import { Field } from 'redux-form';
import Labeled from '../input/Labeled';

const FormField = ({ input, ...rest }) => input.props.addField ?
    (input.props.addLabel ?
        <Field {...rest} {...input.props} name={input.props.source} component={Labeled} label={input.props.label}>{ input }</Field> :
        <Field {...rest} {...input.props} name={input.props.source} component={input.type} />
    ) :
    (input.props.addLabel ?
        <Labeled {...rest} label={input.props.label} source={input.props.source}>{input}</Labeled> :
        (typeof input.type === 'string' ?
            input :
            React.cloneElement(input, rest)
        )
    );

export default FormField;
