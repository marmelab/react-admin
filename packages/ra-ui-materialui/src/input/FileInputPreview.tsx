import React, { useEffect, FunctionComponent, HtmlHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles(theme => ({
    removeButton: {},
    removeIcon: {
        color: theme.palette.error.main,
    },
}));

interface Props {
    file: any;
    onRemove: () => void;
    revokeObjectURL?: (file: any) => void;
}

const FileInputPreview: FunctionComponent<
    Props & HtmlHTMLAttributes<HTMLDivElement>
> = ({ children, className, onRemove, revokeObjectURL, file, ...rest }) => {
    const classes = useStyles({});
    const translate = useTranslate();

    useEffect(() => {
        return () => {
            const preview = file.rawFile ? file.rawFile.preview : file.preview;

            if (preview) {
                revokeObjectURL
                    ? revokeObjectURL(preview)
                    : window.URL.revokeObjectURL(preview);
            }
        };
    }, [file, revokeObjectURL]);

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
    revokeObjectURL: PropTypes.func,
};

FileInputPreview.defaultProps = {
    file: undefined,
};

export default FileInputPreview;
