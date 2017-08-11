'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translate = function translate(BaseComponent) {
    var TranslatedComponent = (0, _recompose.getContext)({
        translate: _propTypes2.default.func.isRequired,
        locale: _propTypes2.default.string.isRequired
    })(BaseComponent);

    TranslatedComponent.defaultProps = BaseComponent.defaultProps;

    return TranslatedComponent;
};

exports.default = translate;
module.exports = exports['default'];