import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

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
    uploading: {
        opacity: 0.3,
    },
};

export const FileField = ({ src, alt, uploading, elStyle }) => {
    const uploadingStyle = uploading ? styles.uploading : {};
    const style = {
        ...styles.container,
        ...uploadingStyle,
        elStyle,
    };

    return (
        <div style={style}>
            {uploading ? <CircularProgress style={styles.loader} /> : null}
            <img
                alt={alt}
                src={src}
                style={styles.image}
            />
        </div>
    );
};

FileField.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    uploading: PropTypes.bool,
    elStyle: PropTypes.object,
};

FileField.defaultProps = {
    uploading: false,
};

export default FileField;
