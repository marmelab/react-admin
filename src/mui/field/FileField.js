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

export const FileField = ({ file, elStyle }) => {
    const uploadingStyle = file.uploading ? styles.uploading : {};
    const style = {
        ...styles.container,
        ...uploadingStyle,
        elStyle,
    };
console.log(file);
    return (
        <div style={style}>
            {file.uploading ? <CircularProgress style={styles.loader} /> : null}
            <img
                alt={file.title}
                src={file.url}
                style={styles.image}
            />
        </div>
    );
};

FileField.propTypes = {
    elStyle: PropTypes.object,
};

FileField.defaultProps = {
};

export default FileField;
