import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import { useTranslate } from 'ra-core';

export const FileInputPreview = (props: FileInputPreviewProps) => {
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
                className={FileInputPreviewClasses.removeButton}
                onClick={onRemove}
                aria-label={translate('ra.action.delete')}
                title={translate('ra.action.delete')}
                size="large"
            >
                <RemoveCircle className={FileInputPreviewClasses.removeIcon} />
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

const PREFIX = 'RaFileInputPreview';

const FileInputPreviewClasses = {
    removeButton: `${PREFIX}-removeButton`,
    removeIcon: `${PREFIX}-removeIcon`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`& .${FileInputPreviewClasses.removeButton}`]: {},

    [`& .${FileInputPreviewClasses.removeIcon}`]: {
        color: theme.palette.error.main,
    },
}));

export interface FileInputPreviewProps {
    children: ReactNode;
    className?: string;
    classes?: object;
    onRemove: () => void;
    file: any;
}
