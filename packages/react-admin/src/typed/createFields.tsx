import * as React from 'react';
import { ComponentType, ReactNode } from 'react';
import { Booleans, Call, Objects } from 'hotscript';
import {
    BooleanField,
    BooleanFieldProps,
    ChipField,
    ChipFieldProps,
    NumberField,
    NumberFieldProps,
    ReferenceArrayField,
    ReferenceArrayFieldProps,
    ReferenceField,
    ReferenceFieldProps,
    ReferenceManyField,
    ReferenceManyFieldProps,
    TextField,
    TextFieldProps,
} from 'ra-ui-materialui';
import { RaRecord } from 'ra-core';

export type TypedReferenceField<
    TReferenceName extends string,
    TSource
> = ComponentType<
    ReferenceFieldProps & {
        reference: TReferenceName;
        source: TSource;
    }
>;

export type TypedReferenceArrayField<
    TReferenceName extends string,
    TSource
> = ComponentType<
    ReferenceArrayFieldProps & {
        reference: TReferenceName;
        source: TSource;
    }
>;

type TypedFieldProps<Source extends string, SortBy extends string> = {
    source: Source;
    sortBy?: SortBy;
};

export const createFields = <TRecord extends Record<string, unknown>>() => {
    return {
        BooleanField: function <
            Source extends string = Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
            >,
            SortBy extends string = Source
        >(props: BooleanFieldProps & TypedFieldProps<Source, SortBy>) {
            return <BooleanField {...props} />;
        },
        ChipField: function <
            Source extends string = Call<Objects.AllPaths, TRecord>,
            SortBy extends string = Source
        >(props: ChipFieldProps & TypedFieldProps<Source, SortBy>) {
            return <ChipField {...props} />;
        },
        NumberField: function <
            Source extends string = Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
            >,
            SortBy extends string = Source
        >(props: NumberFieldProps & TypedFieldProps<Source, SortBy>) {
            return <NumberField {...props} />;
        },
        TextField: function <
            Source extends string = Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
            >,
            SortBy extends string = Source
        >(props: TextFieldProps & TypedFieldProps<Source, SortBy>) {
            return <TextField {...props} />;
        },
        ReferenceField: function <
            Source extends string = Call<Objects.AllPaths, TRecord>,
            SortBy extends string = Source
        >(
            props: ReferenceFieldProps &
                TypedFieldProps<Source, SortBy> & {
                    children: ReactNode;
                    reference: string;
                }
        ) {
            return <ReferenceField {...props} />;
        },
        ReferenceArrayField: function <
            Source extends string = Call<Objects.AllPaths, TRecord>,
            SortBy extends string = Source
        >(
            props: ReferenceArrayFieldProps &
                TypedFieldProps<Source, SortBy> & {
                    children: ReactNode;
                    reference: string;
                }
        ) {
            return <ReferenceArrayField {...props} />;
        },
        ReferenceManyField: function <
            Reference extends RaRecord & Record<string, unknown>,
            ReferenceSource extends string = Call<Objects.AllPaths, Reference>,
            Source extends string = Call<Objects.AllPaths, TRecord>,
            SortBy extends string = Source
        >(
            props: ReferenceManyFieldProps &
                Partial<TypedFieldProps<Source, SortBy>> & {
                    children: ReactNode;
                    target: ReferenceSource;
                    reference: string;
                }
        ) {
            return <ReferenceManyField {...props} />;
        },
    };
};
