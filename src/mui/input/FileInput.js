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
};

class FileInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }

    onDrop = files => {
        this.setState({ files });
    }

    label() {
        if (this.props.multiple) {
            return <p>Drop some files to upload, or click to select one.</p>;
        }

        return <p>Drop a file to upload, or click to select it.</p>;
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
            style,
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
                    <div>{this.state.files.map(file => (
                        <img src={file.preview} style={finalStyle.preview} alt={file.name} />
                    ))}</div>
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
    style: PropTypes.object,
};

FileInput.defaultProps = {
    includesLabel: false,
    multiple: true,
};

export default FileInput;
