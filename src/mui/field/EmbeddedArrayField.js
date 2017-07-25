import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import EmbbededArrayShowLayout from '../detail/EmbbededArrayShowLayout';

/**
 * A container component that shows embedded array elements as a list of input sets
 *
 * You must define the fields and pass them as children.
 *
 * @example Display all the items of an order
 * // order = {
 * //   id: 123,
 * //   items: [
 * //       { qty: 1, price: 10 },
 * //       { qty: 3, price: 15 },
 * //   ],
 * // }
 * <EmbeddedArrayField source="items">
 *      <NumberField source="qty" />
 *      <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 * </EmbeddedArrayField>
 *
 */
export class EmbeddedArrayField extends Component {
    render() {
        const { resource, children, source, record } = this.props;
        const layoutProps = { resource, basePath: '/', record };
        const elements = get(record, source) || [];
        return (
            <div>
                {elements.map(
                    (element, i) =>
                        <EmbbededArrayShowLayout {...layoutProps} key={i}>
                            {React.Children.map(children, child =>
                                React.cloneElement(child, {
                                    source: `${source}[${i}].${child.props
                                        .source}`,
                                })
                            )}
                        </EmbbededArrayShowLayout>,
                    this
                )}
            </div>
        );
    }
}

EmbeddedArrayField.propTypes = {
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    data: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string.isRequired,
};

EmbeddedArrayField.defaultProps = {
    addLabel: true,
};

export default EmbeddedArrayField;
