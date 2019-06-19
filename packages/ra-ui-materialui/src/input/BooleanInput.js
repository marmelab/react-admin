import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import { addField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';

export class BooleanInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    };

    render() {
        const {
            className,
            id,
            input,
            isRequired,
            label,
            source,
            resource,
            options,
            fullWidth,
            meta,
            helperText,
            ...rest
        } = this.props;

        const { value, ...inputProps } = input;
        const { touched, error } = meta;

        return (
            <FormControl className={className} {...sanitizeRestProps(rest)}>
                <FormGroup>
                    <FormControlLabel
                        htmlFor={id}
                        control={
                            <Switch
                                id={id}
                                color="primary"
                                checked={!!value}
                                onChange={this.handleChange}
                                {...inputProps}
                                {...options}
                            />
                        }
                        label={
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={resource}
                                isRequired={isRequired}
                            />
                        }
                    />
                    {helperText || (touched && error) ? (
                        <FormHelperText>
                            <InputHelperText
                                touched={touched}
                                error={error}
                                helperText={helperText}
                            />
                        </FormHelperText>
                    ) : null}
                </FormGroup>
            </FormControl>
        );
    }
}

BooleanInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
};

BooleanInput.defaultProps = {
    options: {},
};

export default addField(BooleanInput);
