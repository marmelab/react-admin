import * as React from 'react';
import { ReactNode } from 'react';
import { UseQueryOptions } from '@tanstack/react-query';
import { ReferenceFieldContextProvider } from './ReferenceFieldContext';
import { RaRecord } from '../../types';
import {
    useReferenceFieldController,
    UseReferenceFieldControllerResult,
} from './useReferenceFieldController';
import { ResourceContextProvider } from '../../core';
import { RecordContextProvider } from '../record';
import { useFieldValue } from '../../util';

/**
 * Fetch reference record, and render its representation, or delegate rendering to child component.
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example // using recordRepresentation
 * <ReferenceFieldBase source="userId" reference="users" />
 *
 * @example // using a Field component to represent the record
 * <ReferenceFieldBase source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceFieldBase>
 *
 * @example // By default, includes a link to the <Edit> page of the related record
 * // (`/users/:userId` in the previous example).
 * // Set the `link` prop to "show" to link to the <Show> page instead.
 * <ReferenceFieldBase source="userId" reference="users" link="show" />
 *
 * @example // You can also prevent `<ReferenceFieldBase>` from adding link to children
 * // by setting `link` to false.
 * <ReferenceFieldBase source="userId" reference="users" link={false} />
 *
 * @example // Alternatively, you can also pass a custom function to `link`.
 * // It must take reference and record as arguments and return a string
 * <ReferenceFieldBase source="userId" reference="users" link={(record, reference) => "/path/to/${reference}/${record}"} />
 *
 * @default
 * In previous versions of React-Admin, the prop `linkType` was used. It is now deprecated and replaced with `link`. However
 * backward-compatibility is still kept
 */
export const ReferenceFieldBase = <
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    props: ReferenceFieldBaseProps<ReferenceRecordType>
) => {
    const { children, render, loading, error, empty = null } = props;
    const id = useFieldValue(props);

    const controllerProps =
        useReferenceFieldController<ReferenceRecordType>(props);

    if (!render && !children) {
        throw new Error(
            "<ReferenceFieldBase> requires either a 'render' prop or 'children' prop"
        );
    }

    if (controllerProps.isPending && loading) {
        return (
            <ResourceContextProvider value={props.reference}>
                {loading}
            </ResourceContextProvider>
        );
    }
    if (controllerProps.error && error) {
        return (
            <ResourceContextProvider value={props.reference}>
                <ReferenceFieldContextProvider value={controllerProps}>
                    {error}
                </ReferenceFieldContextProvider>
            </ResourceContextProvider>
        );
    }
    if (
        (empty &&
            // no foreign key value
            !id) ||
        // no reference record
        (!controllerProps.error &&
            !controllerProps.isPending &&
            !controllerProps.referenceRecord)
    ) {
        return (
            <ResourceContextProvider value={props.reference}>
                {empty}
            </ResourceContextProvider>
        );
    }

    return (
        <ResourceContextProvider value={props.reference}>
            <ReferenceFieldContextProvider value={controllerProps}>
                <RecordContextProvider value={controllerProps.referenceRecord}>
                    {render ? render(controllerProps) : children}
                </RecordContextProvider>
            </ReferenceFieldContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceFieldBaseProps<
    ReferenceRecordType extends RaRecord = RaRecord,
> {
    children?: ReactNode;
    render?: (
        props: UseReferenceFieldControllerResult<ReferenceRecordType>
    ) => ReactNode;
    className?: string;
    empty?: ReactNode;
    error?: ReactNode;
    loading?: ReactNode;
    queryOptions?: Partial<
        UseQueryOptions<ReferenceRecordType[], Error> & {
            meta?: any;
        }
    >;
    reference: string;
    source: string;
}
