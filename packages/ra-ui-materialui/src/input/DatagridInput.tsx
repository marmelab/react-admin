import * as React from 'react';
import { cloneElement, ReactElement, ReactNode, useCallback } from 'react';
import {
    ChoicesProps,
    Identifier,
    ListContextProvider,
    useChoicesContext,
    useInput,
} from 'ra-core';
import {
    CommonInputProps,
    InputHelperText,
    SupportCreateSuggestionOptions,
} from '.';
import {
    Datagrid,
    DatagridProps,
    FilterContext,
    FilterForm,
    FilterButton,
    Pagination as DefaultPagination,
} from '../list';

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
        pagination = defaultPagination,
        filters,
        source: sourceProp,
        resource: resourceProp,
        ...rest
    } = props;

    const choicesContext = useChoicesContext({
        choices,
        resource: resourceProp,
        source: sourceProp,
    });
    const { field, fieldState, formState } = useInput({
        ...props,
        ...choicesContext,
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
            onSelect,
            onToggleItem,
            onUnselectItems,
            selectedIds: field.value,
        }),
        [choicesContext, field, onSelect, onToggleItem, onUnselectItems]
    );
    return (
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
            <Datagrid {...rest} />
            {pagination !== false && pagination}
            <InputHelperText
                touched={fieldState.isTouched || formState.isSubmitted}
                error={fieldState.error?.message}
            />
        </ListContextProvider>
    );
};

export type DatagridInputProps = Omit<CommonInputProps, 'source'> &
    ChoicesProps &
    Omit<SupportCreateSuggestionOptions, 'handleChange'> &
    DatagridProps & {
        children?: ReactNode;
        source?: string;
        filters?: ReactElement | ReactElement[];
        pagination?: ReactElement | false;
    };
