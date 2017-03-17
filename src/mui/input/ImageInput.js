import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import translate from '../../i18n/translate';

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

export class ImageInput extends Component {
    constructor(props) {
        super(props);

        let files = props.input.value || [];
        if (!Array.isArray(files)) {
            files = [files];
        }

        this.state = { files };
    }

    componentWillReceiveProps(nextProps) {
        let files = nextProps.input.value || [];
        if (!Array.isArray(files)) {
            files = [files];
        }

        this.setState({ files: files.map(this.transformFile) });
    }

    onDrop = (files) => {
        const updatedFiles = [
            ...this.state.files,
            ...files.map(this.transformFile),
        ];

        this.setState({ files: updatedFiles });
        this.props.input.onChange(files);
    }

    // turn a browser dropped file structure into expected structure
    transformFile = (file) => {
        if (!file.preview) {
            return file;
        }

        const { source, title } = React.Children.toArray(this.props.children)[0].props;

        const transformedFile = { ...file };
        transformedFile[source] = file.preview;

        if (title) {
            transformedFile[title] = file.name;
        }

        return transformedFile;
    };

    label() {
        const { translate } = this.props;

        if (this.props.multiple) {
            return (
                <p>{translate('aor.input.image.upload_several')}</p>
            );
        }

        return (
            <p>{translate('aor.input.image.upload_single')}</p>
        );
    }

    render() {
        const {
            accept,
            children,
            disableClick,
            elStyle,
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
                { children && (
                    <div className="previews">
                        {this.state.files.map((file, index) => React.cloneElement(
                            children, {
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

ImageInput.propTypes = {
    accept: PropTypes.string,
    children: PropTypes.element,
    disableClick: PropTypes.bool,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    multiple: PropTypes.bool,
    style: PropTypes.object,
};

ImageInput.defaultProps = {
    addLabel: true,
    addField: true,
    multiple: false,
    onUpload: () => {},
};

export default translate(ImageInput);
