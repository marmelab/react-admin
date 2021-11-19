import { ReactElement, ReactNode, ElementType } from 'react';
import { SxProps } from '@mui/system';
import {
    Identifier,
    Exporter,
    SortPayload,
    FilterPayload,
    Record as RaRecord,
    MutationMode,
    OnSuccess,
    OnFailure,
    UpdateParams,
} from 'ra-core';
import { UseQueryOptions, UseMutationOptions } from 'react-query';

export interface ListProps {
    actions?: ReactElement | false;
    aside?: ReactElement;
    bulkActionButtons?: ReactElement | false;
    classes?: any;
    className?: string;
    component?: ElementType;
    empty?: ReactElement | false;
    exporter?: Exporter | false;
    filter?: FilterPayload;
    filterDefaultValues?: object;
    filters?: ReactElement | ReactElement[];
    pagination?: ReactElement | false;
    perPage?: number;
    resource?: string;
    sort?: SortPayload;
    syncWithLocation?: boolean;
    title?: string | ReactElement;
}

export interface EditProps<RecordType extends RaRecord = RaRecord> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    classes?: any;
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
    resource?: string;
    transform?: (data: RaRecord) => RaRecord | Promise<RaRecord>;
    title?: string | ReactElement;
}

export interface CreateProps {
    actions?: ReactElement | false;
    aside?: ReactElement;
    classes?: any;
    className?: string;
    component?: ElementType;
    record?: Partial<RaRecord>;
    resource?: string;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: (data: RaRecord) => RaRecord | Promise<RaRecord>;
    title?: string | ReactElement;
}

export interface ShowProps<RecordType extends RaRecord = RaRecord> {
    actions?: ReactElement | false;
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
    basePath?: string;
    filterValues?: any;
    resource?: string;
    selectedIds?: Identifier[];
}

/**
 * Generic type for the classes prop allowing to override material-ui styles
 *
 * @see https://github.com/mui-org/material-ui/issues/17973#issuecomment-639281445
 *
 * @example
 *
 * const useStyles = makeStyles({
 *     root: {
 *         ...
 *     }
 * })
 *
 * const DummyComponent: FC<DummyComponentProps> = (props) => {
 *     const classes = useStyles();
 *     // ...
 *     return (
 *         <div className={classes.root}>
 *             // ...
 *         </div>
 *     );
 * }
 *
 * interface DummyComponentProps {
 *	    classes?: ClassesOverride<typeof useStyles>;
 * }
 */
export type ClassesOverride<
    UseStyles extends (props: any) => Record<string, string>
> = Partial<Record<keyof ReturnType<UseStyles>, string>>;
