import { ReactElement, ReactNode, ElementType } from 'react';
import { SxProps } from '@mui/system';
import {
    Identifier,
    Exporter,
    SortPayload,
    FilterPayload,
    Record as RaRecord,
    ResourceComponentProps,
    ResourceComponentPropsWithId,
    MutationMode,
    OnSuccess,
    OnFailure,
} from 'ra-core';
import { UseQueryOptions } from 'react-query';

export interface ListProps extends ResourceComponentProps {
    actions?: ReactElement | false;
    aside?: ReactElement;
    bulkActionButtons?: ReactElement | false;
    classes?: any;
    className?: string;
    component?: ElementType;
    empty?: ReactElement | false;
    exporter?: Exporter | false;
    filter?: FilterPayload;
    filterDefaultValues?: any;
    filters?: ReactElement | ReactElement[];
    pagination?: ReactElement | false;
    perPage?: number;
    sort?: SortPayload;
    syncWithLocation?: boolean;
    title?: string | ReactElement;
}

export interface EditProps<RecordType extends RaRecord = RaRecord>
    extends ResourceComponentPropsWithId {
    actions?: ReactElement | false;
    aside?: ReactElement;
    classes?: any;
    className?: string;
    component?: ElementType;
    mutationMode?: MutationMode;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    queryOptions?: UseQueryOptions<RecordType>;
    transform?: (data: RaRecord) => RaRecord | Promise<RaRecord>;
    title?: string | ReactElement;
}

export interface CreateProps extends ResourceComponentProps {
    actions?: ReactElement | false;
    aside?: ReactElement;
    classes?: any;
    className?: string;
    component?: ElementType;
    record?: Partial<RaRecord>;
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
