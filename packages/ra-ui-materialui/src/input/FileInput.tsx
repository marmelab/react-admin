import React, {
    Children,
    FC,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import FormHelperText from '@mui/material/FormHelperText';
import {
    useInput,
    useTranslate,
    shallowEqual,
    RecordContextProvider,
} from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { Labeled } from '../Labeled';
import { FileInputPreview } from './FileInputPreview';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';
import { useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { SvgIconProps } from '@mui/material';

export const FileInput = (props: FileInputProps) => {
    const {
        accept,
        children,
        className,
        format,
        helperText,
        inputProps: inputPropsOptions,
        maxSize,
        minSize,
        multiple = false,
        label,
        labelMultiple = 'ra.input.file.upload_several',
        labelSingle = 'ra.input.file.upload_single',
        options = {},
        onRemove: onRemoveProp,
        parse,
        placeholder,
        removeIcon,
        resource,
        source,
        validate,
        validateFileRemoval,
        disabled,
        readOnly,
        ...rest
    } = props;
    const { onDrop: onDropProp } = options;
    const translate = useTranslate();

    // turn a browser dropped file structure into expected structure
    const transformFile = file => {
        if (!(file instanceof File)) {
            return file;
        }

        const preview = URL.createObjectURL(file);
        const transformedFile = {
            rawFile: file,
            src: preview,
            title: file.name,
        };

        return transformedFile;
    };

    const transformFiles = (files: any[]) => {
        if (!files) {
            return multiple ? [] : null;
        }

        if (Array.isArray(files)) {
            return files.map(transformFile);
        }

        return transformFile(files);
    };

    const {
        id,
        field: { onChange, onBlur, value },
        fieldState,
        isRequired,
    } = useInput({
        format: format || transformFiles,
        parse: parse || transformFiles,
        source,
        validate,
        disabled,
        readOnly,
        ...rest,
    });
    const { error, invalid } = fieldState;
    const files = value ? (Array.isArray(value) ? value : [value]) : [];

    const onDrop = (newFiles, rejectedFiles, event) => {
        const updatedFiles = multiple ? [...files, ...newFiles] : [...newFiles];

        if (multiple) {
            onChange(updatedFiles);
            onBlur();
        } else {
            onChange(updatedFiles[0]);
            onBlur();
        }

        if (onDropProp) {
            onDropProp(newFiles, rejectedFiles, event);
        }
    };

    const onRemove = file => async () => {
        if (validateFileRemoval) {
            try {
                await validateFileRemoval(file);
            } catch (e) {
                return;
            }
        }
        if (multiple) {
            const filteredFiles = files.filter(
                stateFile => !shallowEqual(stateFile, file)
            );
            onChange(filteredFiles as any);
            onBlur();
        } else {
            onChange(null);
            onBlur();
        }

        if (onRemoveProp) {
            onRemoveProp(file);
        }
    };

    const childrenElement =
        children && isValidElement(Children.only(children))
            ? (Children.only(children) as ReactElement<any>)
            : undefined;

    const { getRootProps, getInputProps } = useDropzone({
        accept,
        maxSize,
        minSize,
        multiple,
        disabled: disabled || readOnly,
        ...options,
        onDrop,
    });

    const renderHelperText = helperText !== false || invalid;

    const theme = useTheme();

    return (
        <StyledLabeled
            htmlFor={id}
            label={label}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            source={source}
            resource={resource}
            isRequired={isRequired}
            color={invalid ? 'error' : undefined}
            sx={{
                cursor: disabled || readOnly ? 'default' : 'pointer',
                ...rest.sx,
            }}
            {...sanitizeInputRestProps(rest)}
        >
            <>
                <div
                    {...getRootProps({
                        className: FileInputClasses.dropZone,
                        'data-testid': 'dropzone',
                        style: {
                            color:
                                disabled || readOnly
                                    ? theme.palette.text.disabled
                                    : inputPropsOptions?.color ||
                                      theme.palette.text.primary,
                            backgroundColor:
                                disabled || readOnly
                                    ? theme.palette.action.disabledBackground
                                    : inputPropsOptions?.backgroundColor,
                        },
                    })}
                >
                    <input
                        id={id}
                        name={id}
                        {...getInputProps({
                            ...inputPropsOptions,
                        })}
                    />
                    {placeholder ? (
                        placeholder
                    ) : multiple ? (
                        <p>{translate(labelMultiple)}</p>
                    ) : (
                        <p>{translate(labelSingle)}</p>
                    )}
                </div>
                {renderHelperText ? (
                    <FormHelperText error={invalid}>
                        <InputHelperText
                            error={error?.message}
                            helperText={helperText}
                        />
                    </FormHelperText>
                ) : null}

                {children && (
                    <div className="previews">
                        {files.map((file, index) => (
                            <FileInputPreview
                                key={index}
                                file={file}
                                onRemove={onRemove(file)}
                                className={FileInputClasses.removeButton}
                                removeIcon={removeIcon}
                            >
                                <RecordContextProvider value={file}>
                                    {childrenElement}
                                </RecordContextProvider>
                            </FileInputPreview>
                        ))}
                    </div>
                )}
            </>
        </StyledLabeled>
    );
};

const PREFIX = 'RaFileInput';

export const FileInputClasses = {
    dropZone: `${PREFIX}-dropZone`,
    removeButton: `${PREFIX}-removeButton`,
};

const StyledLabeled = styled(Labeled, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    width: '100%',
    [`& .${FileInputClasses.dropZone}`]: {
        background: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    [`& .${FileInputClasses.removeButton}`]: {},
}));

export type FileInputProps = CommonInputProps & {
    accept?: DropzoneOptions['accept'];
    className?: string;
    children?: ReactNode;
    labelMultiple?: string;
    labelSingle?: string;
    maxSize?: DropzoneOptions['maxSize'];
    minSize?: DropzoneOptions['minSize'];
    multiple?: DropzoneOptions['multiple'];
    options?: DropzoneOptions;
    onRemove?: Function;
    placeholder?: ReactNode;
    removeIcon?: FC<SvgIconProps>;
    inputProps?: any;
    validateFileRemoval?(file): boolean | Promise<boolean>;
    sx?: SxProps;
};
