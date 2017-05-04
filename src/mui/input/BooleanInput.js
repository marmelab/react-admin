import React from 'react';
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

const BooleanInput = ({ input, label, source, elStyle, resource }) => (
    <div style={elStyle || styles.block}>
        <Toggle
            defaultToggled={!!input.value}
            onToggle={input.onChange}
            labelStyle={styles.label}
            style={styles.toggle}
            label={<FieldTitle label={label} source={source} resource={resource} />}
        />
    </div>
);

BooleanInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
};

BooleanInput.defaultProps = {
    addField: true,
};

export default BooleanInput;
