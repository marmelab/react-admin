'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileInput = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _recompose = require('recompose');

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _FileInputPreview = require('./FileInputPreview');

var _FileInputPreview2 = _interopRequireDefault(_FileInputPreview);

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultStyle = {
    dropZone: {
        background: '#efefef',
        cursor: 'pointer',
        padding: '1rem',
        textAlign: 'center',
        color: '#999'
    },
    preview: {
        float: 'left'
    }
};

var FileInput = exports.FileInput = function (_Component) {
    (0, _inherits3.default)(FileInput, _Component);

    function FileInput(props) {
        (0, _classCallCheck3.default)(this, FileInput);

        var _this = (0, _possibleConstructorReturn3.default)(this, (FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call(this, props));

        _initialiseProps.call(_this);

        var files = props.input.value || [];
        if (!Array.isArray(files)) {
            files = [files];
        }

        _this.state = {
            files: files.map(_this.transformFile)
        };
        return _this;
    }

    (0, _createClass3.default)(FileInput, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var files = nextProps.input.value || [];
            if (!Array.isArray(files)) {
                files = [files];
            }

            this.setState({ files: files.map(this.transformFile) });
        }

        // turn a browser dropped file structure into expected structure

    }, {
        key: 'label',
        value: function label() {
            var _props = this.props,
                translate = _props.translate,
                placeholder = _props.placeholder,
                labelMultiple = _props.labelMultiple,
                labelSingle = _props.labelSingle;


            if (placeholder) {
                return placeholder;
            }

            if (this.props.multiple) {
                return _react2.default.createElement(
                    'p',
                    null,
                    translate(labelMultiple)
                );
            }

            return _react2.default.createElement(
                'p',
                null,
                translate(labelSingle)
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props2 = this.props,
                accept = _props2.accept,
                children = _props2.children,
                disableClick = _props2.disableClick,
                elStyle = _props2.elStyle,
                itemStyle = _props2.itemStyle,
                maxSize = _props2.maxSize,
                minSize = _props2.minSize,
                multiple = _props2.multiple,
                style = _props2.style,
                removeStyle = _props2.removeStyle;


            var finalStyle = (0, _extends3.default)({}, defaultStyle, style);

            return _react2.default.createElement(
                'div',
                { style: elStyle },
                _react2.default.createElement(
                    _reactDropzone2.default,
                    {
                        onDrop: this.onDrop,
                        accept: accept,
                        disableClick: disableClick,
                        maxSize: maxSize,
                        minSize: minSize,
                        multiple: multiple,
                        style: finalStyle.dropZone
                    },
                    this.label()
                ),
                children && _react2.default.createElement(
                    'div',
                    { className: 'previews' },
                    this.state.files.map(function (file, index) {
                        return _react2.default.createElement(
                            _FileInputPreview2.default,
                            {
                                key: index,
                                file: file,
                                itemStyle: itemStyle,
                                onRemove: _this2.onRemove(file),
                                removeStyle: removeStyle
                            },
                            _react2.default.cloneElement(children, {
                                record: file,
                                style: defaultStyle.preview
                            })
                        );
                    })
                )
            );
        }
    }]);
    return FileInput;
}(_react.Component);

FileInput.propTypes = {
    accept: _propTypes2.default.string,
    children: _propTypes2.default.element,
    disableClick: _propTypes2.default.bool,
    elStyle: _propTypes2.default.object,
    input: _propTypes2.default.object,
    itemStyle: _propTypes2.default.object,
    labelMultiple: _propTypes2.default.string,
    labelSingle: _propTypes2.default.string,
    maxSize: _propTypes2.default.number,
    minSize: _propTypes2.default.number,
    multiple: _propTypes2.default.bool,
    removeStyle: _propTypes2.default.object,
    style: _propTypes2.default.object,
    placeholder: _propTypes2.default.node
};
FileInput.defaultProps = {
    addLabel: true,
    addField: true,
    itemStyle: {},
    labelMultiple: 'aor.input.file.upload_several',
    labelSingle: 'aor.input.file.upload_single',
    multiple: false,
    onUpload: function onUpload() {},
    removeStyle: { display: 'inline-block' }
};

var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.onDrop = function (files) {
        var updatedFiles = [].concat((0, _toConsumableArray3.default)(_this3.state.files), (0, _toConsumableArray3.default)(files.map(_this3.transformFile)));

        _this3.setState({ files: updatedFiles });
        _this3.props.input.onChange(updatedFiles);
    };

    this.onRemove = function (file) {
        return function () {
            var filteredFiles = _this3.state.files.filter(function (stateFile) {
                return !(0, _recompose.shallowEqual)(stateFile, file);
            });

            _this3.setState({ files: filteredFiles });
            _this3.props.input.onChange(filteredFiles);
        };
    };

    this.transformFile = function (file) {
        if (!(file instanceof File)) {
            return file;
        }

        var _React$Children$toArr = _react2.default.Children.toArray(_this3.props.children)[0].props,
            source = _React$Children$toArr.source,
            title = _React$Children$toArr.title;

        var transformedFile = (0, _defineProperty3.default)({
            rawFile: file
        }, source, file.preview);

        if (title) {
            transformedFile[title] = file.name;
        }

        return transformedFile;
    };
};

exports.default = (0, _translate2.default)(FileInput);