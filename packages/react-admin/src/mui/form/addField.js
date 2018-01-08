import React from 'react';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import FormField from './FormField';
import { translate } from '../../i18n';

const enhanceField = compose(
    translate,
    mapProps(props => {
        return props.meta && props.meta.touched && props.meta.error
            ? {
                  ...props,
                  meta: {
                      ...props.meta,
                      error: props.translate(props.meta.error),
                  },
              }
            : props;
    })
);

export default BaseComponent => {
    const EnhancedComponent = enhanceField(BaseComponent);
    const WithFormField = props => (
        <FormField component={EnhancedComponent} {...props} />
    );
    return WithFormField;
};
