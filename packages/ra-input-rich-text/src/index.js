import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { addField } from 'ra-core';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

function uploadFile(file) {
    let url = `http://api.staging.fruitslive.jp/upload/s3`;
    let headers = new Headers({
        "Access-Control-Allow-Origin": "*",
    });

    const TOKEN = localStorage.getItem("token");
    if (TOKEN && TOKEN !== "undefined") {
        headers.append("Authorization", `Bearer ${TOKEN}`)
    }
    let body = new FormData();
    body.append("FILE", file);
    try {
        return fetch(new Request(
            url, {
            method: "POST",
            body,
            headers,
        }
        ))
            .then((data) => data.json())
    } catch (e) {
        throw new Error(e)
    }
};

function imageUpload() {
    var _this3 = this;

    let fileInput = this.container.querySelector('input.ql-image[type=file]');

    if (fileInput == null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        fileInput.classList.add('ql-image');
        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            const range = _this3.quill.getSelection(true);

            if (!files || !files.length) {
                console.log('No files selected');
                return;
            }

            _this3.quill.enable(false);
            return uploadFile(files[0])
                .then(response => {
                    _this3.quill.enable(true);
                    _this3.quill.insertEmbed(range.index, 'image', `http://fruitslive-staging.s3-ap-northeast-1.amazonaws.com/${response[0].objectName}`);
                    // this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
                    fileInput.value = '';
                })
        });
        this.container.appendChild(fileInput);
    }
    fileInput.click();
}

export class RichTextInput extends Component {
    lastValueChange = null;

    static propTypes = {
        addLabel: PropTypes.bool.isRequired,
        classes: PropTypes.object,
        input: PropTypes.object,
        label: PropTypes.string,
        meta: PropTypes.object,
        options: PropTypes.object,
        source: PropTypes.string,
        toolbar: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.bool,
            PropTypes.shape({
                container: PropTypes.array,
                handlers: PropTypes.object,
            }),
        ]),
        fullWidth: PropTypes.bool,
    };

    static defaultProps = {
        addLabel: true,
        options: {}, // Quill editor options
        record: {},
        toolbar: true,
        fullWidth: true,
    };

    componentDidMount() {
        const {
            input: { value },
            toolbar,
            options,
        } = this.props;

        this.quill = new Quill(this.divRef, {
            modules: { 
				toolbar: {
					container: toolbar,
                    handlers: {
                        image: imageHandler
                    }
				}, 
				clipboard: { matchVisual: false } 
			},
            theme: 'snow',
            ...options,
        });

        this.quill.setContents(this.quill.clipboard.convert(value));

        this.editor = this.divRef.querySelector('.ql-editor');
        this.quill.on('text-change', this.onTextChange);
    }

    componentDidUpdate() {
        if (this.lastValueChange !== this.props.input.value) {
            const selection = this.quill.getSelection();
            this.quill.setContents(
                this.quill.clipboard.convert(this.props.input.value)
            );
            if (selection && this.quill.hasFocus()) {
                this.quill.setSelection(selection);
            }
        }
    }

    componentWillUnmount() {
        this.quill.off('text-change', this.onTextChange);
        this.onTextChange.cancel();
        this.quill = null;
    }

    onTextChange = debounce(() => {
        const value =
            this.editor.innerHTML === '<p><br></p>'
                ? ''
                : this.editor.innerHTML;
        this.lastValueChange = value;
        this.props.input.onChange(value);
    }, 500);

    updateDivRef = ref => {
        this.divRef = ref;
    };

    render() {
        const { touched, error, helperText = false } = this.props.meta;
        return (
            <FormControl
                error={!!(touched && error)}
                fullWidth={this.props.fullWidth}
                className="ra-rich-text-input"
            >
                <div data-testid="quill" ref={this.updateDivRef} />
                {touched && error && (
                    <FormHelperText error className="ra-rich-text-input-error">
                        {error}
                    </FormHelperText>
                )}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }
}

const RichTextInputWithField = addField(withStyles(styles)(RichTextInput));

RichTextInputWithField.defaultProps = {
    addLabel: true,
    fullWidth: true,
};
export default RichTextInputWithField;
