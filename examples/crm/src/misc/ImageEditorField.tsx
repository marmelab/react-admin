import {
    Avatar,
    AvatarProps,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import 'cropperjs/dist/cropper.css';
import { useFieldValue } from 'ra-core';
import { createRef, useCallback, useState } from 'react';
import { FieldProps, Toolbar } from 'react-admin';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { DialogCloseButton } from './DialogCloseButton';

const ImageEditorField = (props: ImageEditorFieldProps) => {
    const { getValues } = useFormContext();
    const source = getValues(props.source);
    const imageUrl = source?.src;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { type = 'image', emptyText, linkPosition = 'none' } = props;

    const commonProps = {
        src: imageUrl,
        onClick: () => setIsDialogOpen(true),
        style: { cursor: 'pointer' },
        sx: {
            ...props.sx,
            width: props.width || (type === 'avatar' ? 50 : 200),
            height: props.height || (type === 'avatar' ? 50 : 200),
        },
    };

    return (
        <>
            <Stack
                direction={linkPosition === 'right' ? 'row' : 'column'}
                alignItems={'center'}
                gap={linkPosition === 'right' ? 2 : 0.5}
                borderRadius={1}
                p={props.backgroundImageColor ? 1 : 0}
                sx={{
                    backgroundColor:
                        props.backgroundImageColor || 'transparent',
                }}
            >
                {props.type === 'avatar' ? (
                    <Avatar {...commonProps}>{emptyText}</Avatar>
                ) : (
                    <Box component={'img'} {...commonProps} />
                )}
                {linkPosition !== 'none' && (
                    <Typography
                        component={Link}
                        variant="caption"
                        onClick={() => setIsDialogOpen(true)}
                        textAlign="center"
                        sx={{ display: 'inline', cursor: 'pointer' }}
                    >
                        Change
                    </Typography>
                )}
            </Stack>
            <ImageEditorDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                {...props}
            />
        </>
    );
};

const ImageEditorDialog = (props: ImageEditorDialogProps) => {
    const { setValue, handleSubmit } = useFormContext();
    const cropperRef = createRef<ReactCropperElement>();
    const initialValue = useFieldValue(props);
    const [file, setFile] = useState<File | undefined>();
    const [imageSrc, setImageSrc] = useState<string | undefined>(
        initialValue?.src
    );
    const onDrop = useCallback((files: File[]) => {
        const preview = URL.createObjectURL(files[0]);
        setFile(files[0]);
        setImageSrc(preview);
    }, []);

    const updateImage = () => {
        const cropper = cropperRef.current?.cropper;
        const croppedImage = cropper?.getCroppedCanvas().toDataURL();
        if (croppedImage) {
            setImageSrc(croppedImage);

            const newFile = file ?? new File([], initialValue?.src);
            setValue(
                props.source,
                {
                    src: croppedImage,
                    title: newFile.name,
                    rawFile: newFile,
                },
                { shouldDirty: true }
            );
            props.onClose();

            if (props.onSave) {
                handleSubmit(props.onSave)();
            }
        }
    };

    const deleteImage = () => {
        setValue(props.source, null, { shouldDirty: true });
        if (props.onSave) {
            handleSubmit(props.onSave)();
        }
        props.onClose();
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/jpeg': ['.jpeg', '.png'] },
        onDrop,
        maxFiles: 1,
    });

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth
            maxWidth="md"
        >
            {props.type === 'avatar' && (
                <style>
                    {`
                        .cropper-crop-box,
                        .cropper-view-box {
                            border-radius: 50%;
                        }
                    `}
                </style>
            )}
            <DialogCloseButton onClose={props.onClose} />
            <DialogTitle>Upload and resize image</DialogTitle>
            <DialogContent>
                <Stack gap={2} justifyContent="center">
                    <Stack
                        direction="row"
                        justifyContent="center"
                        {...getRootProps()}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                        }}
                    >
                        <input {...getInputProps()} />
                        <p>Drop a file to upload, or click to select it.</p>
                    </Stack>
                    <Cropper
                        ref={cropperRef}
                        src={imageSrc}
                        aspectRatio={1}
                        guides={false}
                        cropBoxResizable={false}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 0 }}>
                <Toolbar
                    sx={{ width: '100%', justifyContent: 'space-between' }}
                >
                    <Button variant="contained" onClick={updateImage}>
                        Update Image
                    </Button>
                    <Button variant="text" color="error" onClick={deleteImage}>
                        Delete
                    </Button>
                </Toolbar>
            </DialogActions>
        </Dialog>
    );
};

export default ImageEditorField;

export interface ImageEditorFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends FieldProps<RecordType>,
        AvatarProps {
    width?: number;
    height?: number;
    type?: 'avatar' | 'image';
    onSave?: any;
    linkPosition?: 'right' | 'bottom' | 'none';
    backgroundImageColor?: string;
}

export interface ImageEditorDialogProps extends ImageEditorFieldProps {
    open: boolean;
    onClose: () => void;
}
