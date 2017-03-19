import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { red600 } from 'material-ui/styles/colors';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';


const styles = {
    container: {
        display: 'inline-block',
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        minWidth: '2rem',
    },
};

export const ImageInputPreview = ({ children, onRemove }) => (
    <div style={styles.container}>
        <FlatButton
            style={styles.removeButton}
            icon={<RemoveCircle color={red600} />}
            onClick={onRemove}
        />
        {children}
    </div>
);

ImageInputPreview.propTypes = {
    children: PropTypes.element.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default ImageInputPreview;
