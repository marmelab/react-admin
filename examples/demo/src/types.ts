import { ReactElement } from 'react';
import { ReduxState, Record, Identifier, Sort, RecordMap } from 'ra-core';
import { History, Location } from 'history';

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
}

export interface Review extends Record {
    customer_id: string;
}

export interface ListProps {
    permissions?: object;
    basePath: string;
    history: History;
    location: Location;
    match: {
        path: string;
        url: string;
        isExact: boolean;
        params: object;
    };
    resource: string;
    options: {};
    hasList: boolean;
    hasEdit: boolean;
    hasShow: boolean;
    hasCreate: boolean;
    children: ReactElement;
}

// interface from logged props
// export interface ProductFilterProps<T extends Record = Record> {
//     basePath: string
//     currentSort: Sort
//     data: RecordMap<T>
//     defaultTitle: string
//     displayedFilters: {[key: string]: boolean}
//     hasCreate: boolean
//     hideFilter: ƒ (filterName)
//     ids: []
//     loading: boolean
//     loaded: boolean
//     onSelect: ƒ (newIds)
//     onToggleItem: ƒ (id)
//     onUnselectItems: ƒ ()
//     page: number
//     perPage: number
//     refresh: undefined
//     resource?: Function
//     selectedIds: Identifier[]
//     setFilters: ƒ (filters, displayedFilters)
//     setPage: (newPage: number) => void
//     setPerPage: (newPerPage: number) => void
//     setSort: (newSort: string) => void
//     showFilter: ƒ (filterName, defaultValue)
//     total: number
//     version: number
//     filterValues: {q: "df", width_gte: 2}
//     context?: string
// }
