'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Iterator component to be used to display a list of entities, using a single field
 *
 * @example Display all the books by the current author
 * <ReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </ReferenceManyField>
 */
var SingleFieldList = function SingleFieldList(_ref) {
    var ids = _ref.ids,
        data = _ref.data,
        resource = _ref.resource,
        basePath = _ref.basePath,
        children = _ref.children;
    return _react2.default.createElement(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap' } },
        ids.map(function (id) {
            return _react2.default.cloneElement(children, {
                key: id,
                record: data[id],
                resource: resource,
                basePath: basePath
            });
        })
    );
};

SingleFieldList.propTypes = {
    children: _propTypes2.default.element.isRequired
};

exports.default = SingleFieldList;
module.exports = exports['default'];