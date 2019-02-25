export type Identifier = string | number;
export interface Record {
    id: Identifier;
    [key: string]: any;
}

export interface RecordMap {
    // Accept strings and numbers as identifiers
    [id: string]: Record;
    [id: number]: Record;
}

export interface Sort {
    field: string;
    order: string;
}
export interface Pagination {
    page: number;
    perPage: number;
}

export type I18nProvider = (locale: string) => object | Promise<object>;
export type Translate = (id: string, options?: any) => string;

export type AuthActionType =
    | 'AUTH_LOGIN'
    | 'AUTH_LOGOUT'
    | 'AUTH_ERROR'
    | 'AUTH_CHECK'
    | 'AUTH_GET_PERMISSIONS';

export type AuthProvider = (type: AuthActionType, params?: any) => Promise<any>;

export type DataProvider = (
    type: string,
    resource: string,
    params: any
) => Promise<any>;

export interface ReduxState {
    admin: {
        ui: {
            optimistic: boolean;
        };
        resources: {
            [name: string]: {
                data: any;
            };
        };
        references: {
            oneToMany: {
                [relatedTo: string]: { ids: Identifier[]; total: number };
            };
        };
    };
    i18n: {
        locale: string;
        messages: object;
    };
}

export type Dispatch<T> = T extends (...args: infer A) => any
    ? (...args: A) => void
    : never;
