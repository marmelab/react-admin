import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FileInput, { FileInputProps, FileInputOptions } from './FileInput';
import { InputProps } from 'ra-core';

const useStyles = makeStyles(
    theme => ({
        root: { width: '100%' },
        dropZone: {
            background: theme.palette.background.default,
            cursor: 'pointer',
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        preview: {
            display: 'inline-block',
        },
        removeButton: {
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
    }),
    { name: 'RaImageInput' }
);

const ImageInput = (props: ImageInputProps) => {
    const classes = useStyles(props);

    return (
        <FileInput
            labelMultiple="ra.input.image.upload_several"
            labelSingle="ra.input.image.upload_single"
            classes={classes}
            {...props}
        />
    );
};

export type ImageInputProps = FileInputProps & InputProps<FileInputOptions>;

export default ImageInput;
