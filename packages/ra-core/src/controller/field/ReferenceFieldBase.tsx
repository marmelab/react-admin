import * as React from 'react';
import { ReactNode } from 'react';
import { UseQueryOptions } from '@tanstack/react-query';
import { ReferenceFieldContextProvider } from './ReferenceFieldContext';
import { RaRecord } from '../../types';
import { useReferenceFieldController } from './useReferenceFieldController';
import { ResourceContextProvider } from '../../core';
import { RecordContextProvider } from '../record';

/**
 * Fetch reference record, and render its representation, or delegate rendering to child component.
 *
 * The reference prop should be the name of one of the <Resource> components
 * added as <Admin> child.
 *
 * @example // using recordRepresentation
 * <ReferenceFieldBase label="User" source="userId" reference="users" />
 *
 * @example // using a Field component to represent the record
 * <ReferenceFieldBase label="User" source="userId" reference="users">
 *     <TextField source="name" />
 * </ReferenceFieldBase>
 *
 * @example // By default, includes a link to the <Edit> page of the related record
 * // (`/users/:userId` in the previous example).
 * // Set the `link` prop to "show" to link to the <Show> page instead.
 * <ReferenceFieldBase label="User" source="userId" reference="users" link="show" />
 *
 * @example // You can also prevent `<ReferenceFieldBase>` from adding link to children
 * // by setting `link` to false.
 * <ReferenceFieldBase label="User" source="userId" reference="users" link={false} />
 *
 * @example // Alternatively, you can also pass a custom function to `link`.
 * // It must take reference and record as arguments and return a string
 * <ReferenceFieldBase label="User" source="userId" reference="users" link={(record, reference) => "/path/to/${reference}/${record}"} />
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
    const { children } = props;

    const controllerProps =
        useReferenceFieldController<ReferenceRecordType>(props);

    return (
        <ResourceContextProvider value={props.reference}>
            <ReferenceFieldContextProvider value={controllerProps}>
                <RecordContextProvider value={controllerProps.referenceRecord}>
                    {children}
                </RecordContextProvider>
            </ReferenceFieldContextProvider>
        </ResourceContextProvider>
    );
};

export interface ReferenceFieldBaseProps<
    ReferenceRecordType extends RaRecord = RaRecord,
> {
    children?: ReactNode;
    className?: string;
    error?: ReactNode;
    queryOptions?: Partial<
        UseQueryOptions<ReferenceRecordType[], Error> & {
            meta?: any;
        }
    >;
    reference: string;
    source: string;
}
