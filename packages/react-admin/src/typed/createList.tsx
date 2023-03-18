import * as React from 'react';
import { ComponentType, ReactNode } from 'react';
import { RaRecord } from 'ra-core';
import { createInputs, Inputs } from './createInputs';
import { List, ListProps } from 'ra-ui-materialui';

type RendererParams<
    TRecord extends RaRecord & Record<string, unknown>,
    Filters extends Record<string, unknown> = TRecord
> = {
    List: ComponentType<
        ListProps & { filter?: Partial<Filters>; filters?: any }
    >;
    Filters: Inputs<Filters>;
};

export type TypedList<
    TRecord extends RaRecord & Record<string, unknown>,
    Filters extends Record<string, unknown> = TRecord
> = (params: RendererParams<TRecord, Filters>) => ReactNode;

export const createList = <
    TRecord extends RaRecord & Record<string, unknown>,
    Filters extends Record<string, unknown> = TRecord
>(
    renderer: TypedList<TRecord, Filters>
): ComponentType<any> => {
    return ((() =>
        renderer({
            List: (
                props: ListProps & { filter?: Partial<Filters>; filters?: any }
            ) => <List {...props} />,
            Filters: createInputs<Filters>(),
        })) as unknown) as ComponentType<any>;
};
