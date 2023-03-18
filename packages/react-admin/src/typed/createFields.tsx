import * as React from 'react';
import { ComponentType } from 'react';
import { Booleans, Call, Objects } from 'hotscript';

export type TypedTextField<
    TRecord extends Record<string, unknown>
> = ComponentType<{
    source: Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
    >;
}>;

export type TypedBooleanField<
    TRecord extends Record<string, unknown>
> = ComponentType<{
    source: Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
    >;
}>;

export type TypedNumberField<
    TRecord extends Record<string, unknown>
> = ComponentType<{
    source: Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
    >;
}>;

export type Fields<TRecord extends Record<string, unknown>> = {
    TextField: TypedTextField<TRecord>;
    BooleanField: TypedBooleanField<TRecord>;
    NumberField: TypedNumberField<TRecord>;
};

export type TypedReferenceField<
    TReferenceName extends string,
    TSource
> = ComponentType<{
    reference: TReferenceName;
    source: TSource;
}>;

export type TypedReferenceArrayField<
    TReferenceName extends string,
    TSource
> = ComponentType<{
    reference: TReferenceName;
    source: TSource;
}>;

export const createFields = <TRecord extends Record<string, unknown>>(): Fields<
    TRecord
> => {
    return {
        BooleanField: (props: {
            source: Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
            >;
        }) => <div>{props.source}</div>,
        NumberField: (props: {
            source: Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
            >;
        }) => <div>{props.source}</div>,
        TextField: (props: {
            source: Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
            >;
        }) => <div>{props.source}</div>,
    };
};
