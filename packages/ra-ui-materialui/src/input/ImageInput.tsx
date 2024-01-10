import * as React from 'react';
import { styled } from '@mui/material/styles';
import { FileInput, FileInputProps, FileInputClasses } from './FileInput';

export const ImageInput = (props: ImageInputProps) => (
    <StyledFileInput
        labelMultiple="ra.input.image.upload_several"
        labelSingle="ra.input.image.upload_single"
        {...props}
    />
);

export type ImageInputProps = FileInputProps;

const PREFIX = 'RaImageInput';

const StyledFileInput = styled(FileInput, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    width: '100%',

    [`& .${FileInputClasses.dropZone}`]: {
        background: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        cursor: 'pointer',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    [`& .${FileInputClasses.removeButton}`]: {
        display: 'inline-block',
        position: 'relative',
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
