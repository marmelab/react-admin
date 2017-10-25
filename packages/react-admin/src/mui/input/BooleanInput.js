import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import addField from '../form/addField';
import FieldTitle from '../../util/FieldTitle';

const styles = {
    block: {
        margin: '1rem 0',
        maxWidth: 250,
    },
    label: {
        color: 'rgba(0, 0, 0, 0.298039)',
    },
    toggle: {
        marginBottom: 16,
    },
};

export class BooleanInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    };

    render() {
        const {
            input,
            isRequired,
            label,
            source,
            elStyle,
            resource,
            options,
        } = this.props;

        return (
            <FormGroup>
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
