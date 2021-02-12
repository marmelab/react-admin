import { Dispatch } from 'redux';
import { DataProvider, OnSuccess, OnFailure } from '../../types';

export interface QueryFunctionParams {
    /** The fetch type, e.g. `UPDATE_MANY` */
    type: string;
    payload: any;
    resource: string;
    /** The root action name, e.g. `CRUD_GET_MANY` */
    action: string;
    rest?: {
        fetch?: string;
        meta?: object;
    };
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    dataProvider: DataProvider;
    dispatch: Dispatch;
    logoutIfAccessDenied: (error?: any) => Promise<boolean>;
    allArguments: any[];
}
