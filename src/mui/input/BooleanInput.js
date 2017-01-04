import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import title from '../../util/title';

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

const BooleanInput = ({ input, label, source, elStyle }) => (
    <div style={elStyle || styles.block}>
        <Toggle
            defaultToggled={!!input.value}
            onToggle={input.onChange}
            labelStyle={styles.label}
            style={styles.toggle}
            label={title(label, source)}
        />
    </div>
);

BooleanInput.propTypes = {
    elStyle: PropTypes.object,
    includesField: PropTypes.bool.isRequired,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    source: PropTypes.string,
};

BooleanInput.defaultProps = {
    includesField: false,
    includesLabel: true,
};

export default BooleanInput;
