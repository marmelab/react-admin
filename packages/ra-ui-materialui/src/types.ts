import { ReactElement, ReactNode, ElementType } from 'react';
import { SxProps } from '@mui/system';
import {
    Identifier,
    RaRecord,
    MutationMode,
    TransformData,
    UpdateParams,
    CreateParams,
    RedirectionSideEffect,
} from 'ra-core';
import { UseQueryOptions, UseMutationOptions } from 'react-query';

export interface EditProps<RecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    className?: string;
    component?: ElementType;
    id?: Identifier;
    mutationMode?: MutationMode;
    queryOptions?: UseQueryOptions<RecordType>;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        UpdateParams<RecordType>
    >;
    redirect?: RedirectionSideEffect;
    resource?: string;
    transform?: TransformData;
    title?: string | ReactElement;
}

export interface CreateProps<RecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    className?: string;
    component?: ElementType;
    record?: Partial<RecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        CreateParams<RecordType>
    >;
    transform?: TransformData;
    title?: string | ReactElement;
}

export interface ShowProps<RecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    children: ReactNode;
    className?: string;
    component?: ElementType;
    emptyWhileLoading?: boolean;
    id?: Identifier;
    queryOptions?: UseQueryOptions<RecordType>;
    resource?: string;
    title?: string | ReactElement;
    sx?: SxProps;
}

export interface BulkActionProps {
    filterValues?: any;
    resource?: string;
    selectedIds?: Identifier[];
}
