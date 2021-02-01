import { Dispatch } from 'redux';
import { DataProvider } from '../../types';

export interface QueryFunctionParams {
    /** The fetch type, e.g. `UPDATE_MANY` */
    type: string;
    payload: any;
    resource: string;
    /** The root action name, e.g. `CRUD_GET_MANY` */
    action: string;
    rest: any;
    onSuccess?: (args?: any) => void;
    onFailure?: (error: any) => void;
    dataProvider: DataProvider;
    dispatch: Dispatch;
    logoutIfAccessDenied: (error?: any) => Promise<boolean>;
    allArguments: any[];
}
