import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

export class BooleanInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    };

    render() {
        const {
            className,
            input,
            isRequired,
            label,
            source,
            elStyle,
            resource,
            options,
        } = this.props;

        return (
            <FormGroup className={className} style={elStyle}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={!!input.value}
                            onChange={this.handleChange}
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
            </FormGroup>
        );
    }
}

BooleanInput.propTypes = {
    className: PropTypes.string,
    elStyle: PropTypes.object,
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
