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

export interface EditProps<RaRecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    classes?: any;
    className?: string;
    component?: ElementType;
    id?: Identifier;
    mutationMode?: MutationMode;
    queryOptions?: UseQueryOptions<RaRecordType>;
    mutationOptions?: UseMutationOptions<
        RaRecordType,
        unknown,
        UpdateParams<RaRecordType>
    >;
    redirect?: RedirectionSideEffect;
    resource?: string;
    transform?: TransformData;
    title?: string | ReactElement;
}

export interface CreateProps<RaRecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    classes?: any;
    className?: string;
    component?: ElementType;
    record?: Partial<RaRecordType>;
    redirect?: RedirectionSideEffect;
    resource?: string;
    mutationOptions?: UseMutationOptions<
        RaRecordType,
        unknown,
        CreateParams<RaRecordType>
    >;
    transform?: TransformData;
    title?: string | ReactElement;
}

export interface ShowProps<RaRecordType extends RaRecord = any> {
    actions?: ReactElement | false;
    aside?: ReactElement;
    children: ReactNode;
    className?: string;
    component?: ElementType;
    emptyWhileLoading?: boolean;
    id?: Identifier;
    queryOptions?: UseQueryOptions<RaRecordType>;
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
