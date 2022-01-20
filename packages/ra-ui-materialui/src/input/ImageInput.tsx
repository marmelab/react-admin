import * as React from 'react';
import { styled } from '@mui/material/styles';

import { FileInput, FileInputProps, FileInputClasses } from './FileInput';

export const ImageInput = (props: ImageInputProps) => {
    return (
        <StyledFileInput
            labelMultiple="ra.input.image.upload_several"
            labelSingle="ra.input.image.upload_single"
            className={ImageInputClasses.root}
            {...props}
        />
    );
};

export type ImageInputProps = FileInputProps;

const PREFIX = 'RaImageInput';

export const ImageInputClasses = {
    root: `${PREFIX}-root`,
};

const StyledFileInput = styled(FileInput, { name: PREFIX })(({ theme }) => ({
    [`&.${ImageInputClasses.root}`]: { width: '100%' },

    [`& .${FileInputClasses.dropZone}`]: {
        background: theme.palette.background.default,
        cursor: 'pointer',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },

    [`& .${FileInputClasses.preview}`]: {
        display: 'inline-block',
    },

    [`& .${FileInputClasses.removeButton}`]: {
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
