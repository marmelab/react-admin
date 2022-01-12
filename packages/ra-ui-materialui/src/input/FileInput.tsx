import React, {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { shallowEqual } from 'react-redux';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import FormHelperText from '@mui/material/FormHelperText';
import classnames from 'classnames';
import { useInput, useTranslate, InputProps } from 'ra-core';

import { Labeled } from './Labeled';
import { FileInputPreview } from './FileInputPreview';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';

export const FileInput = (
    props: FileInputProps & InputProps<FileInputOptions>
) => {
    const {
        accept,
        children,
        className,
        format,
        helperText,
        label,
        labelMultiple = 'ra.input.file.upload_several',
        labelSingle = 'ra.input.file.upload_single',
        maxSize,
        minSize,
        multiple = false,
        validateFileRemoval,
        options: {
            inputProps: inputPropsOptions,
            ...options
        } = {} as FileInputOptions,
        parse,
        placeholder,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const translate = useTranslate();

    // turn a browser dropped file structure into expected structure
    const transformFile = file => {
        if (!(file instanceof File)) {
            return file;
        }

        const { source, title } = (Children.only(children) as ReactElement<
            any
        >).props;

        const preview = URL.createObjectURL(file);
        const transformedFile = {
            rawFile: file,
            [source]: preview,
        };

        if (title) {
            transformedFile[title] = file.name;
        }

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
        input: { onChange, value, ...inputProps },
        meta,
        isRequired,
    } = useInput({
        format: format || transformFiles,
        parse: parse || transformFiles,
        source,
        type: 'file',
        validate,
        ...rest,
    });
    const { touched, error, submitError } = meta;
    const files = value ? (Array.isArray(value) ? value : [value]) : [];

    const onDrop = (newFiles, rejectedFiles, event) => {
        const updatedFiles = multiple ? [...files, ...newFiles] : [...newFiles];

        if (multiple) {
            onChange(updatedFiles);
        } else {
            onChange(updatedFiles[0]);
        }

        if (options.onDrop) {
            options.onDrop(newFiles, rejectedFiles, event);
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

        if (options.onRemove) {
            options.onRemove(file);
        }
    };

    const childrenElement =
        children && isValidElement(Children.only(children))
            ? (Children.only(children) as ReactElement<any>)
            : undefined;

    const { getRootProps, getInputProps } = useDropzone({
        ...options,
        accept,
        maxSize,
        minSize,
        multiple,
        onDrop,
    });

    return (
        <StyledLabeled
            id={id}
            label={label}
            className={classnames(FileInputClasses.root, className)}
            source={source}
            resource={resource}
            isRequired={isRequired}
            meta={meta}
            {...sanitizeInputRestProps(rest)}
        >
            <>
                <div
                    data-testid="dropzone"
                    className={FileInputClasses.dropZone}
                    {...getRootProps()}
                >
                    <input
                        id={id}
                        {...getInputProps({
                            ...inputProps,
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
                <FormHelperText>
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                </FormHelperText>
                {children && (
                    <div className="previews">
                        {files.map((file, index) => (
                            <FileInputPreview
                                key={index}
                                file={file}
                                onRemove={onRemove(file)}
                                className={FileInputClasses.removeButton}
                            >
                                {cloneElement(childrenElement as ReactElement, {
                                    record: file,
                                    className: FileInputClasses.preview,
                                })}
                            </FileInputPreview>
                        ))}
                    </div>
                )}
            </>
        </StyledLabeled>
    );
};

FileInput.propTypes = {
    accept: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    children: PropTypes.element,
    className: PropTypes.string,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    labelMultiple: PropTypes.string,
    labelSingle: PropTypes.string,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    validateFileRemoval: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    placeholder: PropTypes.node,
};

const PREFIX = 'RaFileInput';

export const FileInputClasses = {
    dropZone: `${PREFIX}-dropZone`,
    preview: `${PREFIX}-preview`,
    removeButton: `${PREFIX}-removeButton`,
    root: `${PREFIX}-root`,
};

const StyledLabeled = styled(Labeled, { name: PREFIX })(({ theme }) => ({
    [`& .${FileInputClasses.dropZone}`]: {
        background: theme.palette.background.default,
        cursor: 'pointer',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },

    [`& .${FileInputClasses.preview}`]: {},
    [`& .${FileInputClasses.removeButton}`]: {},
    [`&.${FileInputClasses.root}`]: { width: '100%' },
}));

export interface FileInputProps
    extends Pick<
        DropzoneOptions,
        'accept' | 'multiple' | 'maxSize' | 'minSize'
    > {
    validateFileRemoval?(file): boolean | Promise<boolean>;
    children?: ReactNode;
    labelMultiple?: string;
    labelSingle?: string;
    placeholder?: ReactNode;
}

export interface FileInputOptions extends DropzoneOptions {
    inputProps?: any;
    onRemove?: Function;
}
