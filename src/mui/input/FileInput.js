import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import FileField from '../field/FileField';

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
        this.state = {
            files: props.record[props.source] || [],
        };
    }

    onDrop = (files) => {
        const updatedFiles = [
            ...this.state.files.map(this.props.pictureFormatter),
            ...files.map(f => ({
                alt: f.name,
                src: f.preview,
                uploading: true,
            })),
        ];
console.table(updatedFiles, files);
        this.setState({ files: updatedFiles });

        // this.props.onUpload(files, (uploadedFiles) => {
        //     const allFiles = {
        //         ...this.state.files.map(this.props.pictureF),
        //         ...uploadedFiles,
        //     };
        //
        //     this.setState({ files: uploadedFiles });
        //
        //     this.props.input.onChange(uploadedFiles.map((f) => {
        //         const cleanedFile = { ...f };
        //         delete cleanedFile.uploading;
        //         return cleanedFile;
        //     }));
        // });
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
            disableClick,
            maxSize,
            minSize,
            multiple,
            pictureFormatter,
            style,
        } = this.props;

        const finalStyle = {
            ...defaultStyle,
            ...style,
        };

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
                <div className="previews">
                    {this.state.files.map((f) => {
                        const preparedFile = pictureFormatter(f);
                        return (
                            <FileField
                                key={preparedFile.src}
                                src={preparedFile.src}
                                alt={preparedFile.alt}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

FileInput.propTypes = {
    accept: PropTypes.string,
    disableClick: PropTypes.bool,
    includesLabel: PropTypes.bool.isRequired,
    input: PropTypes.object,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    onUpload: PropTypes.func,
    style: PropTypes.object,
    pictureFormatter: PropTypes.func,
};

FileInput.defaultProps = {
    includesLabel: false,
    multiple: false,
    onUpload: () => {},
    pictureFormatter: p => p,
};

export default FileInput;
