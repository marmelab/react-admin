import React, { Children, cloneElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import { useInput, useTranslate } from 'ra-core';

import Labeled from './Labeled';
import FileInputPreview from './FileInputPreview';
import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';

const useStyles = makeStyles(theme => ({
    dropZone: {
        background: theme.palette.background.default,
        cursor: 'pointer',
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    preview: {},
    removeButton: {},
    root: { width: '100%' },
}));

const FileInput = ({
    accept,
    children,
    classes: classesOverride,
    className,
    disableClick,
    helperText,
    label,
    labelMultiple,
    labelSingle,
    maxSize,
    minSize,
    multiple,
    options = {},
    placeholder,
    resource,
    source,
    validate,
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles({ classes: classesOverride });

    // turn a browser dropped file structure into expected structure
    const transformFile = file => {
        if (!(file instanceof File)) {
            return file;
        }

        const { source, title } = Children.only(children).props;

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

    const transformFiles = files => {
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
        format: transformFiles,
        parse: transformFiles,
        source,
        validate,
        ...rest,
    });
    const { touched, error } = meta;
    const files = value ? (Array.isArray(value) ? value : [value]) : [];

    const onDrop = newFiles => {
        const updatedFiles = multiple ? [...files, ...newFiles] : [...newFiles];

        if (multiple) {
            onChange(updatedFiles);
        } else {
            onChange(updatedFiles[0]);
        }
    };

    const onRemove = file => () => {
        if (multiple) {
            const filteredFiles = files.filter(
                stateFile => !shallowEqual(stateFile, file)
            );
            onChange(filteredFiles);
        } else {
            onChange(null);
        }
    };

    const childrenElement = isValidElement(Children.only(children))
        ? Children.only(children)
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
            {...sanitizeRestProps(rest)}
        >
            <>
                <div
                    data-testid="dropzone"
                    className={classes.dropZone}
                    {...getRootProps()}
                >
                    <input
                        id={id}
                        {...inputProps}
                        {...options.inputProps}
                        {...getInputProps()}
                    />
                    {placeholder ? (
                        placeholder
                    ) : multiple ? (
                        <p>{translate(labelMultiple)}</p>
                    ) : (
                        <p>{translate(labelSingle)}</p>
                    )}
                </div>
                {children && (
                    <div className="previews">
                        {files.map((file, index) => (
                            <FileInputPreview
                                key={index}
                                file={file}
                                onRemove={onRemove(file)}
                                className={classes.removeButton}
                            >
                                {cloneElement(childrenElement, {
                                    record: file,
                                    className: classes.preview,
                                })}
                            </FileInputPreview>
                        ))}
                    </div>
                )}
                {helperText || (touched && error) ? (
                    <FormHelperText>
                        <InputHelperText
                            touched={touched}
                            error={error}
                            helperText={helperText}
                        />
                    </FormHelperText>
                ) : null}
            </>
        </Labeled>
    );
};

FileInput.propTypes = {
    accept: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    disableClick: PropTypes.bool,
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

FileInput.defaultProps = {
    labelMultiple: 'ra.input.file.upload_several',
    labelSingle: 'ra.input.file.upload_single',
    multiple: false,
    onUpload: () => {},
};

export default FileInput;
