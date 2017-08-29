'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shouldUpdate = require('recompose/shouldUpdate');

var _shouldUpdate2 = _interopRequireDefault(_shouldUpdate);

var _Table = require('material-ui/Table');

var _DatagridCell = require('./DatagridCell');

var _DatagridCell2 = _interopRequireDefault(_DatagridCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DatagridBody = function DatagridBody(_ref) {
    var resource = _ref.resource,
        children = _ref.children,
        ids = _ref.ids,
        data = _ref.data,
        basePath = _ref.basePath,
        styles = _ref.styles,
        rowStyle = _ref.rowStyle,
        options = _ref.options,
        rowOptions = _ref.rowOptions,
        rest = (0, _objectWithoutProperties3.default)(_ref, ['resource', 'children', 'ids', 'data', 'basePath', 'styles', 'rowStyle', 'options', 'rowOptions']);
    return _react2.default.createElement(
        _Table.TableBody,
        (0, _extends3.default)({ displayRowCheckbox: false, className: 'datagrid-body' }, rest, options),
        ids.map(function (id, rowIndex) {
            return _react2.default.createElement(
                _Table.TableRow,
                (0, _extends3.default)({ style: rowStyle ? rowStyle(data[id], rowIndex) : styles.tr, key: id, selectable: false }, rowOptions),
                _react2.default.Children.map(children, function (field, index) {
                    return _react2.default.createElement(_DatagridCell2.default, (0, _extends3.default)({
                        key: id + '-' + (field.props.source || index),
                        className: 'column-' + field.props.source,
                        record: data[id],
                        defaultStyle: index === 0 ? styles.cell['td:first-child'] : styles.cell.td
                    }, { field: field, basePath: basePath, resource: resource }));
                })
            );
        })
    );
};

DatagridBody.propTypes = {
    ids: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
    isLoading: _propTypes2.default.bool,
    resource: _propTypes2.default.string,
    data: _propTypes2.default.object.isRequired,
    basePath: _propTypes2.default.string,
    options: _propTypes2.default.object,
    rowOptions: _propTypes2.default.object,
    styles: _propTypes2.default.object,
    rowStyle: _propTypes2.default.func
};

DatagridBody.defaultProps = {
    data: {},
    ids: []
};

var PureDatagridBody = (0, _shouldUpdate2.default)(function (props, nextProps) {
    return nextProps.isLoading === false;
})(DatagridBody);

// trick material-ui Table into thinking this is one of the child type it supports
PureDatagridBody.muiName = 'TableBody';

exports.default = PureDatagridBody;
module.exports = exports['default'];