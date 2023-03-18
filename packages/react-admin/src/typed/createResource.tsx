import * as React from 'react';
import { ReactNode } from 'react';
import { RaRecord, useRecordContext } from 'ra-core';
import {
    Datagrid,
    DatagridProps,
    SimpleList,
    SimpleListProps,
    SingleFieldList,
    SingleFieldListProps,
} from 'ra-ui-materialui';
import { createFields } from './createFields';
import { createInputs } from './createInputs';
import { createList, TypedList } from './createList';

export const createResource = <
    TRecord extends RaRecord & Record<string, unknown>
>() => {
    return {
        createList: function <
            Filters extends Record<string, unknown> = TRecord
        >(renderer: TypedList<TRecord, Filters>) {
            return createList<TRecord, Filters>(renderer);
        },
        DataGrid: function (
            props: DatagridProps & {
                isRowExpandable?: (record: TRecord) => boolean;
                isRowSelectable?: (record: TRecord) => boolean;
                rowStyle?: (
                    record: TRecord,
                    index: number
                ) => React.CSSProperties;
            }
        ) {
            return <Datagrid {...props} />;
        },
        SimpleList: function (
            props: SimpleListProps & {
                primaryText: SimpleListTextFunction<TRecord> | ReactNode;
                secondaryText?: SimpleListTextFunction<TRecord> | ReactNode;
                tertiaryText?: SimpleListTextFunction<TRecord> | ReactNode;
            }
        ) {
            return <SimpleList {...props} />;
        },
        SingleFieldList: function (props: SingleFieldListProps) {
            return <SingleFieldList {...props} />;
        },
        useRecordContext: function () {
            return useRecordContext<TRecord>();
        },
        ...createInputs<TRecord>(),
        ...createFields<TRecord>(),
    };
};

type SimpleListTextFunction<TRecord extends RaRecord> = (
    record: TRecord
) => string;
