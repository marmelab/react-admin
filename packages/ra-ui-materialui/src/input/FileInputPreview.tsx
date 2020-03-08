import React, { useEffect, ReactNode, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles(
    theme => ({
        removeButton: {},
        removeIcon: {
            color: theme.palette.error.main,
        },
    }),
    { name: 'RaFileInputPreview' }
);

interface Props {
    children: ReactNode;
    className?: string;
    onRemove: () => void;
    file: any;
}

const FileInputPreview: FunctionComponent<Props> = ({
    children,
    className,
    onRemove,
    file,
    ...rest
}) => {
    const classes = useStyles(rest);
    const translate = useTranslate();

    useEffect(() => {
        return () => {
            const preview = file.rawFile ? file.rawFile.preview : file.preview;

            if (preview) {
                window.URL.revokeObjectURL(preview);
            }
        };
    }, [file]);

    return (
        <div className={className} {...rest}>
            <IconButton
                className={classes.removeButton}
                onClick={onRemove}
                aria-label={translate('ra.action.delete')}
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
};

FileInputPreview.defaultProps = {
    file: undefined,
};

export default FileInputPreview;
