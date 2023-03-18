import * as React from 'react';
import { ComponentType, ReactNode } from 'react';
import { Call, Objects } from 'hotscript';
import { RaRecord } from 'ra-core';
import {
    createFields,
    Fields,
    TypedReferenceArrayField,
    TypedReferenceField,
} from './createFields';
import { createInputs, Inputs } from './createInputs';

type SimpleListTextFunction<TRecord extends RaRecord> = (
    record: TRecord
) => string;

type ListFields<TRecord extends RaRecord> = {
    SimpleList: ComponentType<{
        primaryText: SimpleListTextFunction<TRecord> | ReactNode;
        secondaryText?: SimpleListTextFunction<TRecord> | ReactNode;
        tertiaryText?: SimpleListTextFunction<TRecord> | ReactNode;
    }>;
    DataGrid: ComponentType<{
        isRowExpandable?: (record: TRecord) => boolean;
        isRowSelectable?: (record: TRecord) => boolean;
        rowStyle?: (record: TRecord, index: number) => React.CSSProperties;
    }>;
};

type ListProps<TRecord extends RaRecord, Filters = TRecord> = {
    filter?: Partial<Filters>;
    filters?: any;
};

type RendererParams<
    TRecord extends RaRecord,
    Filters extends Record<string, unknown> = TRecord
> = ListFields<TRecord> &
    Fields<TRecord> & {
        List: ComponentType<ListProps<TRecord, Filters>>;
        Filters: Inputs<Filters>;
        Reference<
            TReference extends RaRecord,
            TReferenceName extends string,
            TSource extends Call<Objects.AllPaths, TRecord>
        >(): Fields<TReference> & {
            ReferenceField: TypedReferenceField<TReferenceName, TSource>;
        };
        ReferenceArray<
            TReference extends RaRecord,
            TReferenceName extends string,
            TSource extends Call<Objects.AllPaths, TRecord>
        >(): Fields<TReference> &
            ListFields<TReference> & {
                ReferenceArrayField: TypedReferenceArrayField<
                    TReferenceName,
                    TSource
                >;
            };
    };

export type TypedList<
    TRecord extends RaRecord,
    Filters extends Record<string, unknown> = TRecord
> = (params: RendererParams<TRecord, Filters>) => ReactNode;

export const createList = <
    TRecord extends RaRecord,
    Filters extends Record<string, unknown> = TRecord
>(
    renderer: TypedList<TRecord, Filters>
) => {
    return renderer({
        List: (props: ListProps<TRecord, Filters>) => <div>{props.filter}</div>,
        Filters: createInputs<Filters>(),
        DataGrid: () => <div>DataGrid</div>,
        SimpleList: () => <div>DataGrid</div>,
        Reference<
            TReference extends RaRecord,
            TReferenceName extends string,
            TSource extends Call<Objects.AllPaths, TRecord>
        >() {
            const ReferenceField: TypedReferenceField<
                TReferenceName,
                TSource
            > = props => <div>{props.source}</div>;
            return {
                ReferenceField,
                ...createFields<TReference>(),
            };
        },
        ReferenceArray<
            TReference extends RaRecord,
            TReferenceName extends string,
            TSource extends Call<Objects.AllPaths, TRecord>
        >() {
            const ReferenceArrayField: TypedReferenceArrayField<
                TReferenceName,
                TSource
            > = props => <div>{props.source}</div>;
            return {
                ReferenceArrayField,
                DataGrid: () => <div>DataGrid</div>,
                SimpleList: () => <div>DataGrid</div>,
                ...createFields<TReference>(),
            };
        },
        ...createFields<TRecord>(),
    });
};
