import * as React from 'react';
import { type ReactNode, useMemo } from 'react';
import { type UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { useWrappedSource } from '../../core/useWrappedSource';
import type { RaRecord } from '../../types';
import { useEvent } from '../../util';
import { useArrayInput } from './useArrayInput';
import { SimpleFormIteratorContext } from './SimpleFormIteratorContext';

const DefaultGetItemDefaults = item => item;

export const SimpleFormIteratorBase = (props: SimpleFormIteratorBaseProps) => {
    const {
        children,
        getItemDefaults: getItemDefaultsProp = DefaultGetItemDefaults,
    } = props;
    const getItemDefaults = useEvent(getItemDefaultsProp);

    const finalSource = useWrappedSource('');
    if (!finalSource) {
        throw new Error(
            'SimpleFormIterator can only be called within an iterator input like ArrayInput'
        );
    }

    const { append, fields, move, remove } = useArrayInput(props);
    const { trigger, getValues } = useFormContext();

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

    const addField = useEvent((item: any = undefined) => {
        append(getItemDefaults(item));
    });

    const handleReorder = useEvent((origin: number, destination: number) => {
        move(origin, destination);
    });

    const handleArrayClear = useEvent(() => {
        remove();
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
    meta?: {
        // the type defined in FieldArrayRenderProps says error is boolean, which is wrong.
        error?: any;
        submitFailed?: boolean;
    };
    getItemDefaults?: (item: any) => any;
    record?: RaRecord;
    resource?: string;
    source?: string;
}
