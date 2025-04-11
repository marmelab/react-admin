import * as React from 'react';
import { type ReactNode, useEffect } from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import { useTranslate } from 'ra-core';
import { type SvgIconProps } from '@mui/material';

export const FileInputPreview = (inProps: FileInputPreviewProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
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
        color: (theme.vars || theme).palette.error.main,
    },
}));

export interface FileInputPreviewProps {
    children: ReactNode;
    className?: string;
    onRemove: () => void;
    file: any;
    removeIcon?: React.ComponentType<SvgIconProps>;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaFileInputPreview: 'root' | 'removeButton' | 'removeIcon';
    }

    interface ComponentsPropsList {
        RaFileInputPreview: Partial<FileInputPreviewProps>;
    }

    interface Components {
        RaFileInputPreview?: {
            defaultProps?: ComponentsPropsList['RaFileInputPreview'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaFileInputPreview'];
        };
    }
}
