import * as React from 'react';
import { styled } from '@mui/material/styles';

import FileInput, { FileInputProps, FileInputOptions } from './FileInput';
import { InputProps } from 'ra-core';

const PREFIX = 'RaImageInput';

const classes = {
    root: `${PREFIX}-root`,
    dropZone: `${PREFIX}-dropZone`,
    preview: `${PREFIX}-preview`,
    removeButton: `${PREFIX}-removeButton`,
};

const StyledFileInput = styled(FileInput)(({ theme }) => ({
    [`& .${classes.root}`]: { width: '100%' },

    [`& .${classes.dropZone}`]: {
        background: theme.palette.background.default,
        cursor: 'pointer',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },

    [`& .${classes.preview}`]: {
        display: 'inline-block',
    },

    [`& .${classes.removeButton}`]: {
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

const ImageInput = (props: ImageInputProps) => {
    return (
        <StyledFileInput
            labelMultiple="ra.input.image.upload_several"
            labelSingle="ra.input.image.upload_single"
            classes={classes}
            {...props}
        />
    );
};

export type ImageInputProps = FileInputProps & InputProps<FileInputOptions>;

export default ImageInput;
