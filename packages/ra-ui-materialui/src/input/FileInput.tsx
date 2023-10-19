import React, {
    Children,
    FC,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
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
        field: { onChange, value },
        fieldState,
        formState: { isSubmitted },
        isRequired,
    } = useInput({
        format: format || transformFiles,
        parse: parse || transformFiles,
        source,
        validate,
        ...rest,
    });
    const { isTouched, error, invalid } = fieldState;
    const files = value ? (Array.isArray(value) ? value : [value]) : [];

    const onDrop = (newFiles, rejectedFiles, event) => {
        const updatedFiles = multiple ? [...files, ...newFiles] : [...newFiles];

        if (multiple) {
            onChange(updatedFiles);
        } else {
            onChange(updatedFiles[0]);
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
        } else {
            onChange(null);
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
        ...options,
        onDrop,
    });

    const renderHelperText =
        helperText !== false || ((isTouched || isSubmitted) && invalid);

    return (
        <StyledLabeled
            htmlFor={id}
            label={label}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            source={source}
            resource={resource}
            isRequired={isRequired}
            color={(isTouched || isSubmitted) && invalid ? 'error' : undefined}
            {...sanitizeInputRestProps(rest)}
        >
            <>
                <div
                    {...getRootProps({
                        className: FileInputClasses.dropZone,
                        'data-testid': 'dropzone',
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
                    <FormHelperText
                        error={(isTouched || isSubmitted) && invalid}
                    >
                        <InputHelperText
                            touched={isTouched || isSubmitted}
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

FileInput.propTypes = {
    accept: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    labelMultiple: PropTypes.string,
    labelSingle: PropTypes.string,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    validateFileRemoval: PropTypes.func,
    options: PropTypes.object,
    removeIcon: PropTypes.elementType,
    resource: PropTypes.string,
    source: PropTypes.string,
    placeholder: PropTypes.node,
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
        cursor: 'pointer',
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
