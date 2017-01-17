import React, { PropTypes } from 'react';
import ImageField from './ImageField';

import get from 'lodash.get';

const styles = {
    container: {
        float: 'left',
    },
    image: {
        maxHeight: '10rem',
        margin: '0.5rem',
    },
    loader: {
        margin: 0,
        display: 'block',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
};

export const DroppedFileField = ({ elStyle, file }) => {
    const style = {
        ...styles.container,
        elStyle,
    };

    return (
        <div style={style}>
            <img
                alt={file.url}
                src={file.url}
                style={styles.image}
            />
        </div>
    );
};

DroppedFileField.propTypes = {
    elStyle: PropTypes.object,
    file: PropTypes.shape({
        url: PropTypes.string.isRequired,
    }),
};

DroppedFileField.defaultProps = {
};

export default DroppedFileField;
