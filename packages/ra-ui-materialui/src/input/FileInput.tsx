import React, {
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'react-redux';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import { useInput, useTranslate, InputProps } from 'ra-core';

import Labeled from './Labeled';
import FileInputPreview from './FileInputPreview';
import sanitizeInputRestProps from './sanitizeInputRestProps';
import InputHelperText from './InputHelperText';

const useStyles = makeStyles(
    theme => ({
        dropZone: {
            background: theme.palette.background.default,
            cursor: 'pointer',
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
        preview: {},
        removeButton: {},
        root: { width: '100%' },
    }),
    { name: 'RaFileInput' }
);

export interface FileInputProps {
    accept?: string;
    children?: ReactNode;
    labelMultiple?: string;
    labelSingle?: string;
    maxSize?: number;
    minSize?: number;
    multiple?: boolean;
    placeholder?: ReactNode;
}

export interface FileInputOptions extends DropzoneOptions {
    inputProps?: any;
    onRemove?: Function;
}

const FileInput = (props: FileInputProps & InputProps<FileInputOptions>) => {
    const {
        accept,
        children,
        className,
        classes: classesOverride,
        format,
        helperText,
        label,
        labelMultiple = 'ra.input.file.upload_several',
        labelSingle = 'ra.input.file.upload_single',
        maxSize,
        minSize,
        multiple = false,
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
    const classes = useStyles(props);

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

    const onRemove = file => () => {
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
        <Labeled
            id={id}
            label={label}
            className={classnames(classes.root, className)}
            source={source}
            resource={resource}
            isRequired={isRequired}
            meta={meta}
            {...sanitizeInputRestProps(rest)}
        >
            <>
                <div
                    data-testid="dropzone"
                    className={classes.dropZone}
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
                                className={classes.removeButton}
                            >
                                {cloneElement(childrenElement as ReactElement, {
                                    record: file,
                                    className: classes.preview,
                                })}
                            </FileInputPreview>
                        ))}
                    </div>
                )}
            </>
        </Labeled>
    );
};

FileInput.propTypes = {
    accept: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    labelMultiple: PropTypes.string,
    labelSingle: PropTypes.string,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    placeholder: PropTypes.node,
};

export default FileInput;
