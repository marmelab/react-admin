import * as React from 'react';
import { FC, ReactNode, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import { useTranslate } from 'ra-core';
import { SvgIconProps } from '@mui/material';

export const FileInputPreview = (props: FileInputPreviewProps) => {
    const {
        children,
        className,
        onRemove,
        file,
        removeIcon: RemoveIcon = RemoveCircle,
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
                size="small"
            >
                <RemoveIcon className={FileInputPreviewClasses.removeIcon} />
            </IconButton>
            {children}
        </Root>
    );
};

const PREFIX = 'RaFileInputPreview';

const FileInputPreviewClasses = {
    removeButton: `${PREFIX}-removeButton`,
    removeIcon: `${PREFIX}-removeIcon`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${FileInputPreviewClasses.removeButton}`]: {},

    [`& .${FileInputPreviewClasses.removeIcon}`]: {
        color: theme.palette.error.main,
    },
}));

export interface FileInputPreviewProps {
    children: ReactNode;
    className?: string;
    onRemove: () => void;
    file: any;
    removeIcon?: FC<SvgIconProps>;
}
