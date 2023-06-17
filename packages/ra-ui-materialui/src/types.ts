import { ReactElement, ReactNode, ElementType } from 'react';
import { SxProps } from '@mui/system';
import {
    Identifier,
    RaRecord,
    MutationMode,
    TransformData,
    RedirectionSideEffect,
    UseCreateMutateParams,
    UseUpdateMutateParams,
} from 'ra-core';
import { UseQueryOptions, UseMutationOptions } from 'react-query';

export interface EditProps<
    RecordType extends RaRecord = RaRecord,
    MutationOptionsError = unknown
> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    className?: string;
    component?: ElementType;
    disableAuthentication?: boolean;
    id?: RecordType['id'];
    mutationMode?: MutationMode;
    queryOptions?: UseQueryOptions<RecordType> & { meta?: any };
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UseUpdateMutateParams<RecordType>
    >;
    redirect?: RedirectionSideEffect;
    resource?: string;
    transform?: TransformData;
    title?: string | ReactElement;
    sx?: SxProps;
}

export interface CreateProps<
    RecordType extends Omit<RaRecord, 'id'> = any,
    MutationOptionsError = unknown,
    ResultRecordType extends RaRecord = RecordType & { id: Identifier }
> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    className?: string;
    component?: ElementType;
    disableAuthentication?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    record?: Partial<RecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    mutationOptions?: UseMutationOptions<
        ResultRecordType,
        MutationOptionsError,
        UseCreateMutateParams<RecordType>
    > & { meta?: any };
    transform?: TransformData;
    title?: string | ReactElement;
    sx?: SxProps;
}

export interface ShowProps<RecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    children: ReactNode;
    className?: string;
    component?: ElementType;
    disableAuthentication?: boolean;
    emptyWhileLoading?: boolean;
    id?: Identifier;
    queryOptions?: UseQueryOptions<RecordType> & { meta?: any };
    resource?: string;
    title?: string | ReactElement;
    sx?: SxProps;
}

export interface BulkActionProps {
    filterValues?: any;
    resource?: string;
    selectedIds?: Identifier[];
}
