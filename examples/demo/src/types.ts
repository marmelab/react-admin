import { ReduxState, Record, Identifier, usePermissions } from 'ra-core';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import * as H from 'history';

export type ThemeName = 'light' | 'dark';

export interface AppState extends ReduxState {
    theme: ThemeName;
}

export interface Category extends Record {
    name: string;
}

export interface Product extends Record {
    category_id: Identifier;
    description: string;
    height: number;
    image: string;
    price: number;
    reference: string;
    stock: number;
    thumbnail: string;
    width: number;
}

export interface Customer extends Record {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    zipcode: string;
    avatar: string;
    birthday: string;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_commands: number;
    total_spent: number;
}

export interface Order extends Record {
    date: string;
    basket: BasketItem[];
}

export interface BasketItem {
    product_id: string;
    quantity: number;
}

/**
 * Types to eventually add in react-admin
 */
export interface FieldProps<T extends Record = Record> {
    addLabel?: boolean;
    label?: string;
    record?: T;
    source?: string;
    basePath?: string;
}

export interface Review extends Record {
    date: string;
    customer_id: string;
}

export interface ResourceMatch {
    id: string;
    [k: string]: string;
}

export interface ResourceComponentProps<
    Params extends { [K in keyof Params]?: string } = {},
    C extends StaticContext = StaticContext,
    S = H.LocationState
> extends RouteComponentProps<Params, C, S> {
    resource: string;
    options: object;
    hasList: boolean;
    hasEdit: boolean;
    hasShow: boolean;
    hasCreate: boolean;
    permissions: ReturnType<typeof usePermissions>['permissions'];
}

export interface EditComponentProps<
    Params extends ResourceMatch = { id: string },
    C extends StaticContext = StaticContext,
    S = H.LocationState
> extends ResourceComponentProps<Params, C, S> {
    id: string;
}

export interface ShowComopnentProps<
    Params extends ResourceMatch = { id: string },
    C extends StaticContext = StaticContext,
    S = H.LocationState
> extends ResourceComponentProps<Params, C, S> {
    id: string;
}

declare global {
    interface Window {
        restServer: any;
    }
}
