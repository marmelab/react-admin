import * as React from 'react';
import { Call, Objects } from 'hotscript';
import { RaRecord, useRecordContext } from 'ra-core';
import {
    Datagrid,
    DatagridProps,
    List,
    ListProps,
    Show,
    ShowProps,
    SimpleList,
    SimpleListProps,
    SingleFieldList,
    SingleFieldListProps,
} from 'ra-ui-materialui';
import { createFields } from './createFields';
import { createInputs } from './createInputs';

export class TypedResource<
    TRecord extends RaRecord & Record<string, unknown>,
    DefaultFilters extends Record<string, unknown> = Record<
        Call<Objects.AllPaths, TRecord>,
        unknown
    >
> {
    List<Filters extends Record<string, unknown> = DefaultFilters>(
        props: ListProps<TRecord> & {
            filter?: Partial<Filters>;
        }
    ) {
        return <List {...props} />;
    }

    Filters<Filters extends Record<string, unknown> = DefaultFilters>() {
        return createInputs<Filters>();
    }

    DataGrid(props: DatagridProps<TRecord>) {
        return <Datagrid {...props} />;
    }

    SimpleList(props: SimpleListProps<TRecord>) {
        return <SimpleList {...props} />;
    }
    SingleFieldList(props: SingleFieldListProps<TRecord>) {
        return <SingleFieldList {...props} />;
    }

    useRecordContext() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useRecordContext<TRecord>();
    }

    Show(props: ShowProps<TRecord>) {
        return <Show {...props} />;
    }

    get Inputs() {
        return createInputs<TRecord>();
    }

    get Fields() {
        return createFields<TRecord>();
    }
}
