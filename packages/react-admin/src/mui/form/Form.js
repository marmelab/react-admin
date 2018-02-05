import React from 'react';
import { propTypes as formPropTypes } from 'redux-form';
import compose from 'recompose/compose';

import {
    formSanitizer,
    reduxFormSanitizer,
    resourceSanitizer,
    translateSanitizer,
} from './sanitizers';

const formPropsSanitizer = compose(
    reduxFormSanitizer,
    resourceSanitizer,
    formSanitizer,
    translateSanitizer
);

const Form = (props = {}) => <form {...formPropsSanitizer(props)} />;
Form.propTypes = {
    ...formPropTypes,
};

export default Form;
