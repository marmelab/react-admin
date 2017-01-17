import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import DroppedFileField from '../field/DroppedFileField';
import ImageField from '../field/ImageField';

const defaultStyle = {
    dropZone: {
        background: '#efefef',
        cursor: 'pointer',
        padding: '1rem',
        textAlign: 'center',
        color: '#999',
    },
    previewContainer: {
        position: 'relative',
        display: 'inline-block',
    },
};

class FileInput extends Component {
    constructor(props) {
        super(props);

        let files = props.record[props.source] || [];
        if (!Array.isArray(files)) {
            files = [files];
        }

        this.state = {
            files: files.map(f => ({
                ...f,
                dropped: false,
            })),
        };
    }

    onDrop = (files) => {
        const updatedFiles = [
            ...this.state.files,
            ...files.map(f => ({
                title: f.name,
                url: f.preview,
                dropped: true,
            })),
        ];

        this.setState({ files: updatedFiles });
        this.props.input.onChange(files);
    }

    label() {
        if (this.props.multiple) {
            return (
                <p>Drop some files to upload, or click to select one.</p>
            );
        }

        return (
            <p>Drop a file to upload, or click to select it.</p>
        );
    }

    render() {
        const {
            accept,
            children,
            disableClick,
            maxSize,
            minSize,
            multiple,
            record,
            source,
            style,
        } = this.props;

        const finalStyle = {
            ...defaultStyle,
            ...style,
        };

        const PreviewComponent = React.Children.toArray(children)[0];

        return (
            <div>
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
                { PreviewComponent && (
                    <div className="previews">
                        {this.state.files.map((file, index) => React.cloneElement(
                            PreviewComponent, {
                                record: file,
                                key: index,
                            },
                        ))}
                    </div>
                ) }
            </div>
        );
    }
}

FileInput.propTypes = {
    accept: PropTypes.string,
    disableClick: PropTypes.bool,
    input: PropTypes.object,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    previewComponent: PropTypes.func,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    style: PropTypes.object,
};

FileInput.defaultProps = {
    addLabel: true,
    addField: true,
    multiple: false,
    previewComponent: ImageField,
    onUpload: () => {},
};

export default FileInput;
