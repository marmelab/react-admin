export type I18nProvider = (locale: string) => object | Promise<object>;
export type Translate = (id: string, options?: any) => string;

export type AuthActionType =
    | 'AUTH_LOGIN'
    | 'AUTH_LOGOUT'
    | 'AUTH_ERROR'
    | 'AUTH_CHECK'
    | 'AUTH_GET_PERMISSIONS';

export type AuthProvider = (type: AuthActionType, params: any) => Promise<any>;

export type DataProvider = (action: any) => Promise<any>;

export interface ReduxState {
    i18n: {
        locale: string;
        messages: object;
    };
}
