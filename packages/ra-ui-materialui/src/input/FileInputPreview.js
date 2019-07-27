import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import { translate } from 'ra-core';

const useStyles = makeStyles(theme => ({
    removeButton: {},
    removeIcon: {
        color: theme.palette.accent1Color,
    },
}));

const FileInputPreview = ({
    children,
    className,
    onRemove,
    revokeObjectURL,
    file,
    translate,
    ...rest
}) => {
    useEffect(() => {
        return () => {
            const { file, revokeObjectURL } = this.props;

            if (file.preview) {
                revokeObjectURL
                    ? revokeObjectURL(file.preview)
                    : window.URL.revokeObjectURL(file.preview);
            }
        };
    }, []);

    const classes = useStyles();

    return (
        <div className={className} {...rest}>
            <IconButton
                className={classes.removeButton}
                onClick={onRemove}
                title={translate('ra.action.delete')}
            >
                <RemoveCircle className={classes.removeIcon} />
            </IconButton>
            {children}
        </div>
    );
};

FileInputPreview.propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    file: PropTypes.object,
    onRemove: PropTypes.func.isRequired,
    revokeObjectURL: PropTypes.func,
};

FileInputPreview.defaultProps = {
    file: undefined,
    translate: id => id,
};

export default translate()(FileInputPreview);
