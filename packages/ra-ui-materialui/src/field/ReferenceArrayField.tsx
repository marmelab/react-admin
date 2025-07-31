import * as React from 'react';
import { memo } from 'react';
import {
    useListContext,
    type ListControllerProps,
    ReferenceArrayFieldBase,
    type RaRecord,
    ReferenceArrayFieldBaseProps,
} from 'ra-core';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';

import type { FieldProps } from './types';
import { LinearProgress } from '../layout';
import { SingleFieldList } from '../list/SingleFieldList';

/**
 * A container component that fetches records from another resource specified
 * by an array of *ids* in current record.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the products of the current order as datagrid
 * // order = {
 * //   id: 123,
 * //   product_ids: [456, 457, 458],
 * // }
 * <ReferenceArrayField label="Products" reference="products" source="product_ids">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="description" />
 *         <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 *         <EditButton />
 *     </Datagrid>
 * </ReferenceArrayField>
 *
 * @example Display all the categories of the current product as a list of chips
 * // product = {
 * //   id: 456,
 * //   category_ids: [11, 22, 33],
 * // }
 * <ReferenceArrayField label="Categories" reference="categories" source="category_ids">
 *     <SingleFieldList>
 *         <ChipField source="name" />
 *     </SingleFieldList>
 * </ReferenceArrayField>
 *
 * By default, restricts the displayed values to 1000. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <ReferenceArrayField perPage={10} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 *
 * By default, the field displays the results in the order in which they are referenced
 * (i.e. in the order of the list of ids). You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <ReferenceArrayField sort={{ field: 'name', order: 'ASC' }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 *
 * Also, you can filter the results to display only a subset of values. Use the
 * `filter` prop for that.
 *
 * @example
 * <ReferenceArrayField filter={{ is_published: true }} reference="categories" source="category_ids">
 *    ...
 * </ReferenceArrayField>
 */
export const ReferenceArrayField = <
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
>(
    inProps: ReferenceArrayFieldProps<RecordType, ReferenceRecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { pagination, children, className, sx, render, ...controllerProps } =
        props;
    return (
        <ReferenceArrayFieldBase {...controllerProps}>
            <PureReferenceArrayFieldView
                pagination={pagination}
                className={className}
                sx={sx}
                render={render}
            >
                {children}
            </PureReferenceArrayFieldView>
        </ReferenceArrayFieldBase>
    );
};
export interface ReferenceArrayFieldProps<
    RecordType extends RaRecord = RaRecord,
    ReferenceRecordType extends RaRecord = RaRecord,
> extends ReferenceArrayFieldBaseProps<RecordType, ReferenceRecordType>,
        FieldProps<RecordType> {
    sx?: SxProps<Theme>;
    pagination?: React.ReactElement;
}

export interface ReferenceArrayFieldViewProps {
    pagination?: React.ReactElement;
    children?: React.ReactNode;
    render?: (props: ListControllerProps) => React.ReactNode;
    className?: string;
    sx?: SxProps<Theme>;
}

export const ReferenceArrayFieldView = (
    props: ReferenceArrayFieldViewProps
) => {
    const { children, render, pagination, className, sx } = props;
    const listContext = useListContext();

    const { isPending, total } = listContext;

    return (
        <Root className={className} sx={sx}>
            {isPending ? (
                <LinearProgress
                    className={ReferenceArrayFieldClasses.progress}
                />
            ) : (
                <span>
                    {(render ? render(listContext) : children) || (
                        <SingleFieldList />
                    )}
                    {pagination && total !== undefined ? pagination : null}
                </span>
            )}
        </Root>
    );
};

const PREFIX = 'RaReferenceArrayField';

export const ReferenceArrayFieldClasses = {
    progress: `${PREFIX}-progress`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'block',
    [`& .${ReferenceArrayFieldClasses.progress}`]: {
        marginTop: theme.spacing(2),
    },
}));

const PureReferenceArrayFieldView = memo(ReferenceArrayFieldView);

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaReferenceArrayField: 'root' | 'progress';
    }

    interface ComponentsPropsList {
        RaReferenceArrayField: Partial<ReferenceArrayFieldProps>;
    }

    interface Components {
        RaReferenceArrayField?: {
            defaultProps?: ComponentsPropsList['RaReferenceArrayField'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaReferenceArrayField'];
        };
    }
}
