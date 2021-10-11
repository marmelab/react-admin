import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import { useTranslate } from 'ra-core';

const PREFIX = 'RaFileInputPreview';

const classes = {
    removeButton: `${PREFIX}-removeButton`,
    removeIcon: `${PREFIX}-removeIcon`,
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.removeButton}`]: {},

    [`& .${classes.removeIcon}`]: {
        color: theme.palette.error.main,
    },
}));

interface Props {
    children: ReactNode;
    className?: string;
    classes?: object;
    onRemove: () => void;
    file: any;
}

const FileInputPreview = (props: Props) => {
    const {
        children,
        classes: classesOverride,
        className,
        onRemove,
        file,
        ...rest
    } = props;

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
        <Root className={className} {...rest}>
            <IconButton
                className={classes.removeButton}
                onClick={onRemove}
                aria-label={translate('ra.action.delete')}
                title={translate('ra.action.delete')}
                size="large"
            >
                <RemoveCircle className={classes.removeIcon} />
            </IconButton>
            {children}
        </Root>
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
