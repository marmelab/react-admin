import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const defaultStyle = {
    dropZone: {
        background: '#efefef',
        cursor: 'pointer',
        padding: '1rem',
        textAlign: 'center',
        color: '#999',
    },
    preview: {
        margin: '.5rem',
        maxHeight: '10rem',
    },
    uploading: {
        opacity: .5,
    }
};

class FileInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }

    onDrop = files => {
        const loadingFiles = files.map(f => ({
            data: f, // destructuring a File object remove almost all its properties
            uploading: true,
        }));
        this.setState({ files: loadingFiles });

        this.props.onUpload(files, () => {
            const loadedFiles = files.map(f => ({
                data: f,
                uploading: false,
            }));
            this.setState({ files: loadedFiles });
        });
    }

    label() {
        if (this.props.multiple) {
            return <p>Drop some files to upload, or click to select one.</p>;
        }

        return <p>Drop a file to upload, or click to select it.</p>;
    }

    renderFile = file => {
        const uploadingStyle = file.uploading ? defaultStyle.uploading : {};
        const style = {
            ...defaultStyle.preview,
            ...uploadingStyle,
            ...this.props.style.preview,
        };

        return (
            <img
                key={file.data.name}
                alt={file.data.alt}
                src={file.data.preview}
                style={style}
            />
        );
    }

    render() {
        const {
            accept,
            disableClick,
            maxSize,
            minSize,
            multiple,
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
                    <div>{this.state.files.map(this.renderFile)}</div>
                </div>
            </div>
        );
    }
}

FileInput.propTypes = {
    accept: PropTypes.string,
    disableClick: PropTypes.bool,
    includesLabel: PropTypes.bool.isRequired,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    onUpload: PropTypes.func,
    style: PropTypes.object,
};

FileInput.defaultProps = {
    includesLabel: false,
    multiple: false,
    onUpload: () => {},
};

export default FileInput;
