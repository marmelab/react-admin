import {
    Avatar,
    AvatarProps,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
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
    const imageUrl = getValues()[props.source];
    const [isHovered, setIsHovered] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (!imageUrl) {
        return null;
    }

    const commonProps = {
        src: imageUrl,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onClick: () => setIsDialogOpen(true),
        style: { cursor: 'pointer' },
        sx: {
            ...props.sx,
            width: props.width || (props.type === 'avatar' ? 50 : 200),
            height: props.height || (props.type === 'avatar' ? 50 : 200),
        },
    };

    return (
        <>
            {props.type === 'avatar' ? (
                <Avatar {...commonProps} />
            ) : (
                <Box component={'img'} {...commonProps} />
            )}
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
    const [imageSrc, setImageSrc] = useState<string | undefined>(initialValue);
    const onDrop = useCallback((files: File[]) => {
        const preview = URL.createObjectURL(files[0]);
        setImageSrc(preview);
    }, []);

    const updateImage = () => {
        const cropper = cropperRef.current?.cropper;
        const croppedImage = cropper?.getCroppedCanvas().toDataURL();
        if (croppedImage) {
            setImageSrc(croppedImage);
            setValue(props.source, croppedImage);
            props.onClose();

            if (props.onSave) {
                handleSubmit(props.onSave)();
            }
        }
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
            <DialogCloseButton onClose={props.onClose} />
            <DialogTitle>Resize your image</DialogTitle>
            <DialogContent>
                <Stack gap={2} justifyContent="center">
                    <Stack
                        direction="row"
                        justifyContent="center"
                        {...getRootProps()}
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
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
                <Toolbar sx={{ width: '100%' }}>
                    <Button variant="contained" onClick={updateImage}>
                        Update Image
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
}

export interface ImageEditorDialogProps extends ImageEditorFieldProps {
    open: boolean;
    onClose: () => void;
}
