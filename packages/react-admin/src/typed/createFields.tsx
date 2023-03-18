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

export const createFields = <TRecord extends Record<string, unknown>>() => {
    return {
        BooleanField: (
            props: BooleanFieldProps & {
                source: Call<
                    Objects.AllPaths,
                    Call<Objects.PickBy<Booleans.Equals<boolean>>, TRecord>
                >;
            }
        ) => <BooleanField {...props} />,
        ChipField: (
            props: ChipFieldProps & { source: Call<Objects.AllPaths, TRecord> }
        ) => <ChipField {...props} />,
        NumberField: (
            props: NumberFieldProps & {
                source: Call<
                    Objects.AllPaths,
                    Call<Objects.PickBy<Booleans.Equals<number>>, TRecord>
                >;
            }
        ) => <NumberField {...props} />,
        TextField: (
            props: TextFieldProps & {
                source: Call<
                    Objects.AllPaths,
                    Call<Objects.PickBy<Booleans.Equals<string>>, TRecord>
                >;
            }
        ) => <TextField {...props} />,
        ReferenceField: (
            props: ReferenceFieldProps & {
                children: ReactNode;
                source: Call<Objects.AllPaths, TRecord>;
                reference: string;
            }
        ) => <ReferenceField {...props} />,
        ReferenceArrayField: (
            props: ReferenceArrayFieldProps & {
                children: ReactNode;
                source: Call<Objects.AllPaths, TRecord>;
                reference: string;
            }
        ) => <ReferenceArrayField {...props} />,
        ReferenceManyField: (
            props: ReferenceManyFieldProps & {
                children: ReactNode;
                target: Call<Objects.AllPaths, TRecord>;
                reference: string;
            }
        ) => <ReferenceManyField {...props} />,
    };
};
