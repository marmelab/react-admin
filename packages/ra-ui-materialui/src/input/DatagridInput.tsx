import * as React from 'react';
import { cloneElement, ReactElement, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import {
    ChoicesProps,
    Identifier,
    ListContextProvider,
    useChoicesContext,
    useInput,
} from 'ra-core';
import { CommonInputProps } from './CommonInputProps';
import { InputHelperText } from './InputHelperText';
import { SupportCreateSuggestionOptions } from './useSupportCreateSuggestion';
import { Datagrid, DatagridProps } from '../list/datagrid';
import { FilterButton, FilterForm } from '../list/filter';
import { FilterContext } from '../list/FilterContext';
import { Pagination as DefaultPagination } from '../list/pagination';

const defaultPagination = <DefaultPagination />;

/**
 * WIP: This component is not yet ready to be used.
 *
 * An input for selecting items displayed in a datagrid
 *
 * @example
 * const membersFilters = [
 *     <TextInput label="Search" source="q" alwaysOn />,
 * ];
 * const TeamEdit = () => (
 *    <Edit>
 *        <SimpleForm>
 *            <TextInput source="name" />
 *            <ReferenceArrayInput
 *                source="members"
 *                reference="users"
 *                filter={{ is_retired: false }}
 *                perPage={50}
 *                sort={{ field: 'lastName', order: 'ASC' }}
 *            >
 *                <DatagridInput
 *                    filters={membersFilters}
 *                >
 *                    <TextField source="firstName" />
 *                    <TextField source="lastName" />
 *                </DatagridInput>
 *            </ReferenceArrayInput>
 *        </SimpleForm>
 *    </Edit>
 * );
 */
export const DatagridInput = (props: DatagridInputProps) => {
    const {
        choices,
        className,
        pagination = defaultPagination,
        filters,
        source: sourceProp,
        resource: resourceProp,
        ...rest
    } = props;

    const {
        allChoices,
        availableChoices,
        selectedChoices,
        error: fetchError,
        source,
        ...choicesContext
    } = useChoicesContext({
        choices,
        resource: resourceProp,
        source: sourceProp,
    });
    const { field, fieldState } = useInput({
        ...props,
        ...choicesContext,
        source,
    });

    const onSelect = useCallback(
        (idsToAdd: Identifier[]) => {
            field.onChange(idsToAdd);
        },
        [field]
    );

    const onToggleItem = useCallback(
        (id: Identifier) => {
            if (field.value.includes(id)) {
                field.onChange(field.value.filter(item => item !== id));
            } else {
                field.onChange([...field.value, id]);
            }
        },
        [field]
    );

    const onUnselectItems = useCallback(() => {
        field.onChange([]);
    }, [field]);

    const listContext = React.useMemo(
        () => ({
            ...choicesContext,
            data: availableChoices,
            total: availableChoices?.length,
            error: null,
            onSelect,
            onToggleItem,
            onUnselectItems,
            selectedIds: field.value,
        }),
        [
            availableChoices,
            choicesContext,
            field,
            onSelect,
            onToggleItem,
            onUnselectItems,
        ]
    );
    return (
        <div className={clsx('ra-input', `ra-input-${source}`, className)}>
            {/* @ts-ignore FIXME cannot find another way to fix this error: "Types of property 'isPending' are incompatible: Type 'boolean' is not assignable to type 'false'." */}
            <ListContextProvider value={listContext}>
                {filters ? (
                    Array.isArray(filters) ? (
                        <FilterContext.Provider value={filters}>
                            <>
                                <FilterForm />
                                <FilterButton />
                            </>
                        </FilterContext.Provider>
                    ) : (
                        <>
                            {cloneElement(filters, {
                                context: 'form',
                            })}
                            {cloneElement(filters, {
                                context: 'button',
                            })}
                        </>
                    )
                ) : null}
                {!fieldState.error && !fetchError && (
                    <>
                        <Datagrid {...rest} />
                        {pagination !== false && pagination}
                    </>
                )}
                <InputHelperText
                    error={fieldState.error?.message || fetchError?.message}
                />
            </ListContextProvider>
        </div>
    );
};

export type DatagridInputProps = Omit<
    CommonInputProps,
    'source' | 'readOnly' | 'disabled'
> &
    ChoicesProps &
    Omit<SupportCreateSuggestionOptions, 'handleChange'> &
    DatagridProps & {
        children?: ReactNode;
        source?: string;
        filters?: ReactElement | ReactElement[];
        pagination?: ReactElement | false;
    };
