import React, { Component, cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';

import { FieldProps } from './types';

interface State {
    data: object;
    ids: string[];
}

const initialState = {
    data: {},
    ids: [],
};

/**
 * Display a collection
 *
 * Ideal for embedded arrays of objects, e.g.
 * {
 *   id: 123
 *   tags: [
 *     { name: 'foo' },
 *     { name: 'bar' }
 *   ]
 * }
 *
 * The child must be an iterator component
 * (like <Datagrid> or <SingleFieldList>).
 *
 * @example Display all the backlinks of the current post as a <Datagrid>
 * // post = {
 * //   id: 123
 * //   backlinks: [
 * //       {
 * //           date: '2012-08-10T00:00:00.000Z',
 * //           url: 'http://example.com/foo/bar.html',
 * //       },
 * //       {
 * //           date: '2012-08-14T00:00:00.000Z',
 * //           url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 * //       }
 * //    ]
 * // }
 *     <ArrayField source="backlinks">
 *         <Datagrid>
 *             <DateField source="date" />
 *             <UrlField source="url" />
 *         </Datagrid>
 *     </ArrayField>
 *
 * @example Display all the tags of the current post as <Chip> components
 * // post = {
 * //   id: 123
 * //   tags: [
 * //     { name: 'foo' },
 * //     { name: 'bar' }
 * //   ]
 * // }
 *     <ArrayField source="tags">
 *         <SingleFieldList>
 *             <ChipField source="name" />
 *         </SingleFieldList>
 *     </ArrayField>
 *
 * If you need to render a collection in a custom way, it's often simpler
 * to write your own component:
 *
 * @example
 *     const TagsField = ({ record }) => (
 *          <ul>
 *              {record.tags.map(item => (
 *                  <li key={item.name}>{item.name}</li>
 *              ))}
 *          </ul>
 *     )
 *     TagsField.defaultProps = { addLabel: true };
 */
export class ArrayField extends Component<FieldProps, State> {
    constructor(props: FieldProps) {
        super(props);
        this.state = props.record
            ? this.getDataAndIds(props.record, props.source)
            : initialState;
    }

    componentWillReceiveProps(nextProps: FieldProps, prevProps: FieldProps) {
        if (nextProps.record !== prevProps.record) {
            this.setState(
                this.getDataAndIds(nextProps.record, nextProps.source)
            );
        }
    }

    getDataAndIds(record: object, source: string) {
        const list = get(record, source);
        return list
            ? {
                  data: list.reduce((prev, item) => {
                      prev[JSON.stringify(item)] = item;
                      return prev;
                  }, {}),
                  ids: list.map(JSON.stringify),
              }
            : initialState;
    }

    render() {
        const {
            addLabel,
            basePath,
            children,
            record,
            source,
            ...rest
        } = this.props;
        const { ids, data } = this.state;

        return cloneElement(Children.only(children), {
            ids,
            data,
            isLoading: false,
            basePath,
            currentSort: {},
            ...rest,
        });
    }
}

const EnhancedArrayField = pure(ArrayField);

EnhancedArrayField.defaultProps = {
    addLabel: true,
};

export default EnhancedArrayField;
