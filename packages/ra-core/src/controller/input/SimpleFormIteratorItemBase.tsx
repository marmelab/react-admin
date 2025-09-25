import * as React from 'react';
import { type ReactNode, useMemo } from 'react';
import {
    SourceContextProvider,
    useResourceContext,
    useSourceContext,
} from '../../core';
import type { RaRecord } from '../../types';
import { useSimpleFormIterator } from './useSimpleFormIterator';
import {
    SimpleFormIteratorItemContext,
    type SimpleFormIteratorItemContextValue,
} from './SimpleFormIteratorItemContext';
import type { ArrayInputContextValue } from './ArrayInputContext';

export const SimpleFormIteratorItemBase = (
    props: SimpleFormIteratorItemBaseProps
) => {
    const { children, index } = props;
    const resource = useResourceContext(props);
    if (!resource) {
        throw new Error(
            'SimpleFormIteratorItem must be used in a ResourceContextProvider or be passed a resource prop.'
        );
    }
    const { total, reOrder, remove } = useSimpleFormIterator();

    const context = useMemo<SimpleFormIteratorItemContextValue>(
        () => ({
            index,
            total,
            reOrder: newIndex => reOrder(index, newIndex),
            remove: () => remove(index),
        }),
        [index, total, reOrder, remove]
    );

    const parentSourceContext = useSourceContext();
    const sourceContext = useMemo(
        () => ({
            getSource: (source: string) => {
                if (!source) {
                    // source can be empty for scalar values, e.g.
                    // <ArrayInput source="tags" /> => SourceContext is "tags"
                    //   <SimpleFormIterator> => SourceContext is "tags.0"
                    //      <TextInput /> => use its parent's getSource so finalSource = "tags.0"
                    //   </SimpleFormIterator>
                    // </ArrayInput>
                    return parentSourceContext.getSource(`${index}`);
                } else {
                    // Normal input with source, e.g.
                    // <ArrayInput source="orders" /> => SourceContext is "orders"
                    //   <SimpleFormIterator> => SourceContext is "orders.0"
                    //      <DateInput source="date" /> => use its parent's getSource so finalSource = "orders.0.date"
                    //   </SimpleFormIterator>
                    // </ArrayInput>
                    return parentSourceContext.getSource(`${index}.${source}`);
                }
            },
            getLabel: (source: string) => {
                // <ArrayInput source="orders" /> => LabelContext is "orders"
                //   <SimpleFormIterator> => LabelContext is ALSO "orders"
                //      <DateInput source="date" /> => use its parent's getLabel so finalLabel = "orders.date"
                //   </SimpleFormIterator>
                // </ArrayInput>
                //
                // we don't prefix with the index to avoid that translation keys contain it
                return parentSourceContext.getLabel(source);
            },
        }),
        [index, parentSourceContext]
    );

    return (
        <SimpleFormIteratorItemContext.Provider value={context}>
            <SourceContextProvider value={sourceContext}>
                {children}
            </SourceContextProvider>
        </SimpleFormIteratorItemContext.Provider>
    );
};

export type SimpleFormIteratorDisableRemoveFunction = (
    record: RaRecord
) => boolean;

export type SimpleFormIteratorItemBaseProps =
    Partial<ArrayInputContextValue> & {
        children?: ReactNode;
        index: number;
        record?: RaRecord;
        resource?: string;
        source?: string;
    };
