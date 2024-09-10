import { createContext } from 'react';
import { RaRecord } from '../../types';
import { ListControllerBaseResult } from '../../controller';

/**
 * Context to store choices and functions to retrieve them.
 *
 * Use the useChoicesContext() hook to read the context.
 */
export const ChoicesContext = createContext<ChoicesContextValue | undefined>(
    undefined
);

export type ChoicesContextBaseValue<RecordType extends RaRecord = any> =
    ListControllerBaseResult<RecordType> & {
        source: string;
        isFromReference: boolean;
    };

export interface ChoicesContextLoadingResult<RecordType extends RaRecord = any>
    extends ChoicesContextBaseValue<RecordType> {
    allChoices: undefined;
    availableChoices: undefined;
    selectedChoices: undefined;
    total: undefined;
    error: null;
    isPending: true;
}
export interface ChoicesContextErrorResult<
    RecordType extends RaRecord = any,
    TError = Error,
> extends ChoicesContextBaseValue<RecordType> {
    allChoices: undefined;
    availableChoices: undefined;
    selectedChoices: undefined;
    total: undefined;
    error: TError;
    isPending: false;
}
export interface ChoicesContextRefetchErrorResult<
    RecordType extends RaRecord = any,
    TError = Error,
> extends ChoicesContextBaseValue<RecordType> {
    allChoices: RecordType[];
    availableChoices: RecordType[];
    selectedChoices: RecordType[];
    total: number;
    error: TError;
    isPending: false;
}
export interface ChoicesContextSuccessResult<RecordType extends RaRecord = any>
    extends ChoicesContextBaseValue<RecordType> {
    allChoices: RecordType[];
    availableChoices: RecordType[];
    selectedChoices: RecordType[];
    total: number;
    error: null;
    isPending: false;
}

export type ChoicesContextValue<RecordType extends RaRecord = any> =
    | ChoicesContextLoadingResult<RecordType>
    | ChoicesContextErrorResult<RecordType>
    | ChoicesContextRefetchErrorResult<RecordType>
    | ChoicesContextSuccessResult<RecordType>;
