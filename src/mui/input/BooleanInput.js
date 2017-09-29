import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
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

class BooleanInput extends Component {
    handleToggle = (event, value) => {
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
            <div style={elStyle || styles.block}>
                <Toggle
                    defaultToggled={!!input.value}
                    onToggle={this.handleToggle}
                    labelStyle={styles.label}
                    style={styles.toggle}
                    label={
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />
                    }
                    {...options}
                />
            </div>
        );
    }
}

BooleanInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
};

BooleanInput.defaultProps = {
    addField: true,
    options: {},
};

export default BooleanInput;
