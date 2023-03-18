import * as React from 'react';
import { ComponentType } from 'react';
import { Booleans, Call, Objects } from 'hotscript';

export type TypedTextInput<
    TRecord extends Record<string, unknown>
> = ComponentType<{
    source: Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
    >;
    defaultValue?: TRecord[Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
    >];
    format?: (
        value: TRecord[Call<
            Objects.AllPaths,
            Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
        >]
    ) => string;
    parse?: (
        value: string
    ) => TRecord[Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
    >];
}>;

export type TypedBooleanInput<
    TRecord extends Record<string, unknown>
> = ComponentType<{
    source: Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
    >;
    defaultValue?: TRecord[Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
    >];
    format?: (
        value: TRecord[Call<
            Objects.AllPaths,
            Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
        >]
    ) => string;
    parse?: (
        value: string
    ) => TRecord[Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
    >];
}>;

export type TypedNumberInput<
    TRecord extends Record<string, unknown>
> = ComponentType<{
    source: Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
    >;
    defaultValue?: TRecord[Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
    >];
    format?: (
        value: TRecord[Call<
            Objects.AllPaths,
            Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
        >]
    ) => string;
    parse?: (
        value: string
    ) => TRecord[Call<
        Objects.AllPaths,
        Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
    >];
}>;

export type Inputs<TRecord extends Record<string, unknown>> = {
    TextInput: TypedTextInput<TRecord>;
    BooleanInput: TypedBooleanInput<TRecord>;
    NumberInput: TypedNumberInput<TRecord>;
};

export const createInputs = <TRecord extends Record<string, unknown>>(): Inputs<
    TRecord
> => {
    return {
        BooleanInput: (props: {
            source: Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
            >;
        }) => <div>{props.source}</div>,
        NumberInput: (props: {
            source: Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
            >;
        }) => <div>{props.source}</div>,
        TextInput: (props: {
            source: Call<
                Objects.AllPaths,
                Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
            >;
        }) => <div>{props.source}</div>,
    };
};
