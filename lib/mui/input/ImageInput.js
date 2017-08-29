'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImageInput = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _FileInput2 = require('./FileInput');

var _translate = require('../../i18n/translate');

var _translate2 = _interopRequireDefault(_translate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageInput = exports.ImageInput = function (_FileInput) {
    (0, _inherits3.default)(ImageInput, _FileInput);

    function ImageInput() {
        (0, _classCallCheck3.default)(this, ImageInput);
        return (0, _possibleConstructorReturn3.default)(this, (ImageInput.__proto__ || Object.getPrototypeOf(ImageInput)).apply(this, arguments));
    }

    return ImageInput;
}(_FileInput2.FileInput);

ImageInput.defaultProps = (0, _extends3.default)({}, _FileInput2.FileInput.defaultProps, {
    labelMultiple: 'aor.input.image.upload_several',
    labelSingle: 'aor.input.image.upload_single',
    itemStyle: {
        display: 'inline-block',
        position: 'relative'
    },
    removeStyle: {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        minWidth: '2rem',
        opacity: 0
    }
});
exports.default = (0, _translate2.default)(ImageInput);