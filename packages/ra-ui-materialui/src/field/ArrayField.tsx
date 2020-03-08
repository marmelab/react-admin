import { Component, cloneElement, Children } from 'react';
import get from 'lodash/get';
import pure from 'recompose/pure';
import { Identifier } from 'ra-core';

import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';

interface State {
    data: object;
    ids: Identifier[];
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
 * //           uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
 * //           date: '2012-08-10T00:00:00.000Z',
 * //           url: 'http://example.com/foo/bar.html',
 * //       },
 * //       {
 * //           uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
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
 * If the array value contains a lot of items, you may experience slowdowns in the UI.
 * In such cases, set the `fieldKey` prop to use one field as key, and reduce CPU and memory usage:
 *
 * @example
 *     <ArrayField source="backlinks" fieldKey="uuid">
 *         ...
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
export class ArrayField extends Component<
    FieldProps & InjectedFieldProps,
    State
> {
    constructor(props: FieldProps & InjectedFieldProps) {
        super(props);
        this.state = props.record
            ? this.getDataAndIds(props.record, props.source, props.fieldKey)
            : initialState;
    }

    componentWillReceiveProps(
        nextProps: FieldProps & InjectedFieldProps,
        prevProps: FieldProps & InjectedFieldProps
    ) {
        if (nextProps.record !== prevProps.record) {
            this.setState(
                this.getDataAndIds(
                    nextProps.record,
                    nextProps.source,
                    nextProps.fieldKey
                )
            );
        }
    }

    getDataAndIds(record: object, source: string, fieldKey: string) {
        const list = get(record, source);
        if (!list) {
            return initialState;
        }
        return fieldKey
            ? {
                  data: list.reduce((prev, item) => {
                      prev[item[fieldKey]] = item;
                      return prev;
                  }, {}),
                  ids: list.map(item => item[fieldKey]),
              }
            : {
                  data: list.reduce((prev, item) => {
                      prev[JSON.stringify(item)] = item;
                      return prev;
                  }, {}),
                  ids: list.map(JSON.stringify),
              };
    }

    render() {
        const {
            addLabel,
            basePath,
            children,
            record,
            sortable,
            source,
            fieldKey,
            ...rest
        } = this.props;
        const { ids, data } = this.state;

        // @ts-ignore
        return cloneElement(Children.only(children), {
            ids,
            data,
            loading: false,
            basePath,
            currentSort: {},
            ...rest,
        });
    }
}

const EnhancedArrayField = pure<FieldProps>(ArrayField);

EnhancedArrayField.defaultProps = {
    addLabel: true,
};

EnhancedArrayField.propTypes = fieldPropTypes;
EnhancedArrayField.displayName = 'EnhancedArrayField';

export default EnhancedArrayField;
