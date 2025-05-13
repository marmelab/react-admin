import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { FileInput, FileInputProps, FileInputClasses } from './FileInput';

export const ImageInput = (inProps: ImageInputProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    return (
        <StyledFileInput
            labelMultiple="ra.input.image.upload_several"
            labelSingle="ra.input.image.upload_single"
            {...props}
        />
    );
};

export type ImageInputProps = FileInputProps;

const PREFIX = 'RaImageInput';

const StyledFileInput = styled(FileInput, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    width: '100%',

    [`& .${FileInputClasses.dropZone}`]: {
        background: (theme.vars || theme).palette.background.default,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: (theme.vars || theme).palette.primary.contrastText,
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaImageInput: 'root' | 'dropZone' | 'removeButton';
    }

    interface ComponentsPropsList {
        RaImageInput: Partial<ImageInputProps>;
    }

    interface Components {
        RaImageInput?: {
            defaultProps?: ComponentsPropsList['RaImageInput'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaImageInput'];
        };
    }
}
