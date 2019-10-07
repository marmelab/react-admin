import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import Dropzone from 'react-dropzone';
import compose from 'recompose/compose';
import { withStyles, createStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import classnames from 'classnames';
import { addField, translate } from 'ra-core';

import Labeled from './Labeled';
import FileInputPreview from './FileInputPreview';
import sanitizeRestProps from './sanitizeRestProps';

const styles = createStyles({
    dropZone: {
        background: '#efefef',
        cursor: 'pointer',
        padding: '1rem',
        textAlign: 'center',
        color: '#999',
    },
    preview: {},
    removeButton: {},
    root: { width: '100%' },
});

export class FileInput extends Component {
    static propTypes = {
        accept: PropTypes.string,
        children: PropTypes.element,
        classes: PropTypes.object,
        className: PropTypes.string,
        disableClick: PropTypes.bool,
        id: PropTypes.string,
        input: PropTypes.object,
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
        translate: PropTypes.func.isRequired,
        placeholder: PropTypes.node,
    };

    static defaultProps = {
        labelMultiple: 'ra.input.file.upload_several',
        labelSingle: 'ra.input.file.upload_single',
        multiple: false,
        onUpload: () => {},
        translate: id => id,
    };

    constructor(props) {
        super(props);
        let files = props.input.value || [];
        if (!Array.isArray(files)) {
            files = [files];
        }

        this.state = {
            files: files.map(this.transformFile),
        };
    }

    componentWillReceiveProps(nextProps) {
        let files = nextProps.input.value || [];
        if (!Array.isArray(files)) {
            files = [files];
        }

        this.setState({ files: files.map(this.transformFile) });
    }

    onDrop = files => {
        const updatedFiles = this.props.multiple
            ? [...this.state.files, ...files.map(this.transformFile)]
            : [...files.map(this.transformFile)];

        this.setState({ files: updatedFiles });

        if (this.props.multiple) {
            // Use onBlur to ensure redux-form set the input as touched
            this.props.input.onBlur(updatedFiles);
        } else {
            this.props.input.onBlur(updatedFiles[0]);
        }
    };

    onRemove = file => () => {
        const filteredFiles = this.state.files.filter(
            stateFile => !shallowEqual(stateFile, file)
        );

        this.setState({ files: filteredFiles });

        // Use onBlur to ensure redux-form set the input as touched
        if (this.props.multiple) {
            this.props.input.onBlur(filteredFiles);
        } else {
            this.props.input.onBlur(null);
        }
    };

    // turn a browser dropped file structure into expected structure
    transformFile = file => {
        if (!(file instanceof File)) {
            return file;
        }

        const { source, title } = Children.only(this.props.children).props;

        const transformedFile = {
            rawFile: file,
            [source]: file.preview,
        };

        if (title) {
            transformedFile[title] = file.name;
        }

        return transformedFile;
    };

    label() {
        const {
            translate,
            placeholder,
            labelMultiple,
            labelSingle,
        } = this.props;

        if (placeholder) {
            return placeholder;
        }

        if (this.props.multiple) {
            return <p>{translate(labelMultiple)}</p>;
        }

        return <p>{translate(labelSingle)}</p>;
    }

    render() {
        const {
            accept,
            children,
            classes = {},
            className,
            disableClick,
            id,
            isRequired,
            label,
            maxSize,
            meta,
            minSize,
            multiple,
            resource,
            source,
            translate,
            options = {},
            ...rest
        } = this.props;

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
                <span>
                    <Dropzone
                        onDrop={this.onDrop}
                        accept={accept}
                        disableClick={disableClick}
                        maxSize={maxSize}
                        minSize={minSize}
                        multiple={multiple}
                        className={classes.dropZone}
                        {...options}
                        inputProps={{ id, ...options.inputProps }}
                    >
                        {this.label()}
                    </Dropzone>
                    {children && (
                        <div className="previews">
                            {this.state.files.map((file, index) => (
                                <FileInputPreview
                                    key={index}
                                    file={file}
                                    onRemove={this.onRemove(file)}
                                    className={classes.removeButton}
                                >
                                    {cloneElement(Children.only(children), {
                                        record: file,
                                        className: classes.preview,
                                    })}
                                </FileInputPreview>
                            ))}
                        </div>
                    )}
                    {meta && meta.touched && meta.error && (
                        <FormHelperText>{translate(meta.error)}</FormHelperText>
                    )}
                </span>
            </Labeled>
        );
    }
}

export default compose(
    addField,
    translate,
    withStyles(styles)
)(FileInput);
