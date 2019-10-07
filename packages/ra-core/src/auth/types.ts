export type UserCheck = (
    payload: object,
    pathName: string,
    routeParams?: object
) => void;

export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_CHECK = 'AUTH_CHECK';
export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_GET_PERMISSIONS = 'AUTH_GET_PERMISSIONS';

export type AuthActionType =
    | typeof AUTH_LOGIN
    | typeof AUTH_LOGOUT
    | typeof AUTH_ERROR
    | typeof AUTH_CHECK
    | typeof AUTH_GET_PERMISSIONS;
