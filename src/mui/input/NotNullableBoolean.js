import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';

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

const NotNullableBoolean = ({ input, meta: { touched, error }, label }) => (
    <div style={styles.block}>
        <Toggle
            {...input}
            labelStyle={styles.label}
            style={styles.toggle}
            label={label}
        />
    </div>
);

NotNullableBoolean.propTypes = {
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    label: PropTypes.string,
    meta: PropTypes.object,
};

NotNullableBoolean.defaultProps = {
    includesLabel: true,
};

export default NotNullableBoolean;
