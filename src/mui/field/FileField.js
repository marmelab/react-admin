import React, { PropTypes } from 'react';

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

export const FileField = ({ elStyle, title, url }) => {
    const style = {
        ...styles.container,
        elStyle,
    };

    return (
        <div style={style}>
            <img
                alt={title}
                src={url}
                style={styles.image}
            />
        </div>
    );
};

FileField.propTypes = {
    elStyle: PropTypes.object,
    title: PropTypes.string,
    url: PropTypes.string.isRequired,
};

FileField.defaultProps = {
};

export default FileField;
