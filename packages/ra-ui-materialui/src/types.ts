import { FC, ReactElement, ReactNode } from 'react';
import { usePermissions, Exporter, Sort } from 'ra-core';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { LocationState } from 'history';

export interface ResourceComponentProps<
    Params extends { [K in keyof Params]?: string } = {},
    C extends StaticContext = StaticContext,
    S = LocationState
> extends RouteComponentProps<Params, C, S> {
    resource?: string;
    basePath?: string;
    options?: object;
    hasList?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasCreate?: boolean;
    permissions?: ReturnType<typeof usePermissions>['permissions'];
}

export interface ListProps extends ResourceComponentProps {
    children: ReactNode;
    actions?: ReactElement | false;
    aside?: ReactElement;
    bulkActionButtons?: ReactElement | false;
    classes?: any;
    className?: string;
    component?: FC<{ className?: string }>;
    empty?: ReactElement | false;
    exporter?: Exporter | false;
    filter?: any;
    filterDefaultValues?: any;
    filters?: ReactElement;
    pagination?: ReactElement | false;
    perPage?: number;
    sort?: Sort;
    title?: string | ReactElement;
}

export interface ResourceMatch {
    id: string;
    [k: string]: string;
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
