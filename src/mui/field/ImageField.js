import React, { PropTypes } from 'react';
import get from 'lodash.get';

const styles = {
    container: {
        float: 'left',
    },
    image: {
        maxHeight: '10rem',
        margin: '0.5rem',
    },
};

export const ImageField = ({ elStyle = {}, record, source, title }) => {
    const style = {
        ...styles.container,
        ...elStyle,
    };

    const titleValue = get(record, title) || title;
    const srcValue = get(record, source);
    if (!srcValue) {
        return <div />;
    }

    return (
        <div style={style}>
            <img
                title={titleValue}
                alt={titleValue}
                src={srcValue}
                style={styles.image}
            />
        </div>
    );
};

ImageField.propTypes = {
    elStyle: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    title: PropTypes.string,
};

export default ImageField;
