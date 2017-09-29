import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import Dropzone from 'react-dropzone';

import FileInputPreview from './FileInputPreview';
import translate from '../../i18n/translate';

const defaultStyle = {
    dropZone: {
        background: '#efefef',
        cursor: 'pointer',
        padding: '1rem',
        textAlign: 'center',
        color: '#999',
    },
    preview: {
        float: 'left',
    },
};

export class FileInput extends Component {
    static propTypes = {
        accept: PropTypes.string,
        children: PropTypes.element,
        disableClick: PropTypes.bool,
        elStyle: PropTypes.object,
        input: PropTypes.object,
        itemStyle: PropTypes.object,
        labelMultiple: PropTypes.string,
        labelSingle: PropTypes.string,
        maxSize: PropTypes.number,
        minSize: PropTypes.number,
        multiple: PropTypes.bool,
        removeStyle: PropTypes.object,
        style: PropTypes.object,
        translate: PropTypes.func.isRequired,
        placeholder: PropTypes.node,
    };

    static defaultProps = {
        addLabel: true,
        addField: true,
        itemStyle: {},
        labelMultiple: 'aor.input.file.upload_several',
        labelSingle: 'aor.input.file.upload_single',
        multiple: false,
        onUpload: () => {},
        removeStyle: { display: 'inline-block' },
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
        this.props.input.onChange(updatedFiles);
    };

    onRemove = file => () => {
        const filteredFiles = this.state.files.filter(
            stateFile => !shallowEqual(stateFile, file)
        );

        this.setState({ files: filteredFiles });
        this.props.input.onChange(filteredFiles);
    };

    // turn a browser dropped file structure into expected structure
    transformFile = file => {
        if (!(file instanceof File)) {
            return file;
        }

        const { source, title } = React.Children.toArray(
            this.props.children
        )[0].props;

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
            disableClick,
            elStyle,
            itemStyle,
            maxSize,
            minSize,
            multiple,
            style,
            removeStyle,
        } = this.props;

        const finalStyle = {
            ...defaultStyle,
            ...style,
        };

        return (
            <div style={elStyle}>
                <Dropzone
                    onDrop={this.onDrop}
                    accept={accept}
                    disableClick={disableClick}
                    maxSize={maxSize}
                    minSize={minSize}
                    multiple={multiple}
                    style={finalStyle.dropZone}
                >
                    {this.label()}
                </Dropzone>
                {children && (
                    <div className="previews">
                        {this.state.files.map((file, index) => (
                            <FileInputPreview
                                key={index}
                                file={file}
                                itemStyle={itemStyle}
                                onRemove={this.onRemove(file)}
                                removeStyle={removeStyle}
                            >
                                {React.cloneElement(children, {
                                    record: file,
                                    style: defaultStyle.preview,
                                })}
                            </FileInputPreview>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default translate(FileInput);
