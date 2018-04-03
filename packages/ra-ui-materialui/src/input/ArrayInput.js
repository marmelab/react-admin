import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { isRequired, FieldTitle } from 'ra-core';
import { FieldArray } from 'redux-form';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';

import sanitizeRestProps from './sanitizeRestProps';

export class ArrayInput extends Component {
    renderFieldArray = props => {
        const { children } = this.props;
        return cloneElement(children, props);
    };

    render() {
        const {
            className,
            label,
            source,
            resource,
            validate,
            ...rest
        } = this.props;

        return (
            <FormControl
                fullWidth
                margin="normal"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                <InputLabel htmlFor={source} shrink>
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired(validate)}
                    />
                </InputLabel>
                <FieldArray
                    name={source}
                    component={this.renderFieldArray}
                    validate={validate}
                    isRequired={isRequired(validate)}
                />
            </FormControl>
        );
    }
}

ArrayInput.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
    validate: PropTypes.func,
};

ArrayInput.defaultProps = {
    options: {},
    fullWidth: true,
};
export default ArrayInput;
