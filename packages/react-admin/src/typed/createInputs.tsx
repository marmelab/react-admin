import * as React from 'react';
import { ComponentType } from 'react';
import { Booleans, Call, Objects } from 'hotscript';
import {
    BooleanInput,
    BooleanInputProps,
    NumberInput,
    NumberInputProps,
    TextInput,
    TextInputProps,
} from 'ra-ui-materialui';

export type TypedTextInput<
    TRecord extends Record<string, unknown>
> = ComponentType<
    TextInputProps & {
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
    }
>;

export type TypedBooleanInput<
    TRecord extends Record<string, unknown>
> = ComponentType<
    BooleanInputProps & {
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
    }
>;

export type TypedNumberInput<
    TRecord extends Record<string, unknown>
> = ComponentType<
    NumberInputProps & {
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
    }
>;

export type Inputs<TRecord extends Record<string, unknown>> = {
    TextInput: TypedTextInput<TRecord>;
    BooleanInput: TypedBooleanInput<TRecord>;
    NumberInput: TypedNumberInput<TRecord>;
};

export const createInputs = <TRecord extends Record<string, unknown>>(): Inputs<
    TRecord
> => {
    return {
        BooleanInput: (
            props: BooleanInputProps & {
                source: Call<
                    Objects.AllPaths,
                    Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
                >;
            }
        ) => <BooleanInput {...props} />,
        NumberInput: (
            props: NumberInputProps & {
                source: Call<
                    Objects.AllPaths,
                    Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
                >;
            }
        ) => <NumberInput {...props} />,
        TextInput: (
            props: TextInputProps & {
                source: Call<
                    Objects.AllPaths,
                    Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
                >;
            }
        ) => <TextInput {...props} />,
    };
};
