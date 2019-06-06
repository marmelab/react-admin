import { AuthActionType } from '../types';

export type UserCheck = (
    payload: object,
    pathName: string,
    routeParams?: object
) => void;

export const AUTH_LOGIN: AuthActionType = 'AUTH_LOGIN';
export const AUTH_CHECK: AuthActionType = 'AUTH_CHECK';
export const AUTH_ERROR: AuthActionType = 'AUTH_ERROR';
export const AUTH_LOGOUT: AuthActionType = 'AUTH_LOGOUT';
export const AUTH_GET_PERMISSIONS: AuthActionType = 'AUTH_GET_PERMISSIONS';
