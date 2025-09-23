import * as React from 'react';
import { Children, type ReactNode, useMemo, useRef } from 'react';
import { type UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { FormDataConsumer } from '../../form/FormDataConsumer';
import { useWrappedSource } from '../../core/useWrappedSource';
import type { RaRecord } from '../../types';
import { useEvent } from '../../util';
import { useArrayInput } from './useArrayInput';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';

export const SimpleFormIteratorBase = (props: SimpleFormIteratorBaseProps) => {
    const { children, inputs } = props;

    const finalSource = useWrappedSource('');
    if (!finalSource) {
        throw new Error(
            'SimpleFormIterator can only be called within an iterator input like ArrayInput'
        );
    }

    const { append, fields, move, remove, replace } = useArrayInput(props);
    const { trigger, getValues } = useFormContext();
    const initialDefaultValue = useRef({});

    const removeField = useEvent((index: number) => {
        remove(index);
        const isScalarArray = getValues(finalSource).every(
            (value: any) => typeof value !== 'object'
        );
        if (isScalarArray) {
            // Trigger validation on the Array to avoid ghost errors.
            // Otherwise, validation errors on removed fields might still be displayed
            trigger(finalSource);
        }
    });

    if (fields.length > 0) {
        const { id, ...rest } = fields[0];
        initialDefaultValue.current = rest;
        for (const k in initialDefaultValue.current)
            initialDefaultValue.current[k] = null;
    }

    const addField = useEvent((item: any = undefined) => {
        let defaultValue = item;
        if (item == null) {
            defaultValue = initialDefaultValue.current;
            if (
                Children.count(inputs) === 1 &&
                React.isValidElement(Children.only(inputs)) &&
                // @ts-ignore
                !Children.only(inputs).props.source &&
                // Make sure it's not a FormDataConsumer
                // @ts-ignore
                Children.only(inputs).type !== FormDataConsumer
            ) {
                // ArrayInput used for an array of scalar values
                // (e.g. tags: ['foo', 'bar'])
                defaultValue = '';
            } else {
                // ArrayInput used for an array of objects
                // (e.g. authors: [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Doe' }])
                defaultValue = defaultValue || ({} as Record<string, unknown>);
                Children.forEach(inputs, input => {
                    if (
                        React.isValidElement(input) &&
                        input.type !== FormDataConsumer &&
                        input.props.source
                    ) {
                        defaultValue[input.props.source] =
                            input.props.defaultValue ?? null;
                    }
                });
            }
        }
        append(defaultValue);
    });

    const handleReorder = useEvent((origin: number, destination: number) => {
        move(origin, destination);
    });

    const handleArrayClear = useEvent(() => {
        replace([]);
    });

    const context = useMemo(
        () => ({
            total: fields.length,
            add: addField,
            clear: handleArrayClear,
            remove: removeField,
            reOrder: handleReorder,
            source: finalSource,
        }),
        [
            addField,
            fields.length,
            handleArrayClear,
            handleReorder,
            removeField,
            finalSource,
        ]
    );

    if (!fields) {
        return null;
    }
    return (
        <SimpleFormIteratorContext.Provider value={context}>
            {children}
        </SimpleFormIteratorContext.Provider>
    );
};

export interface SimpleFormIteratorBaseProps
    extends Partial<UseFieldArrayReturn> {
    children: ReactNode;
    inline?: boolean;
    inputs: ReactNode;
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    record?: RaRecord;
    resource?: string;
    source?: string;
}
