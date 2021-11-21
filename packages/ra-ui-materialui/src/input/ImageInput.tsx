import * as React from 'react';
import { styled } from '@mui/material/styles';

import { FileInput, FileInputProps, FileInputOptions } from './FileInput';
import { InputProps } from 'ra-core';

export const ImageInput = (props: ImageInputProps) => {
    return (
        <StyledFileInput
            labelMultiple="ra.input.image.upload_several"
            labelSingle="ra.input.image.upload_single"
            classes={ImageInputClasses}
            {...props}
        />
    );
};

export type ImageInputProps = FileInputProps & InputProps<FileInputOptions>;

const PREFIX = 'RaImageInput';

export const ImageInputClasses = {
    root: `${PREFIX}-root`,
    dropZone: `${PREFIX}-dropZone`,
    preview: `${PREFIX}-preview`,
    removeButton: `${PREFIX}-removeButton`,
};

const StyledFileInput = styled(FileInput, { name: PREFIX })(({ theme }) => ({
    [`& .${ImageInputClasses.root}`]: { width: '100%' },

    [`& .${ImageInputClasses.dropZone}`]: {
        background: theme.palette.background.default,
        cursor: 'pointer',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },

    [`& .${ImageInputClasses.preview}`]: {
        display: 'inline-block',
    },

    [`& .${ImageInputClasses.removeButton}`]: {
        display: 'inline-block',
        position: 'relative',
        float: 'left',
        '& button': {
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            minWidth: theme.spacing(2),
            opacity: 0,
        },
        '&:hover button': {
            opacity: 1,
        },
    },
}));
