import React, { Children, cloneElement, FC, memo, ReactElement } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { ReferenceArrayProps, useReferenceArrayFieldController } from 'ra-core';
import { fieldPropTypes, FieldProps, InjectedFieldProps } from './types';
import { ClassNameMap } from '@material-ui/styles';

interface ReferenceArrayFieldProps extends FieldProps, InjectedFieldProps {
    reference: string;
    classes?: Partial<ClassNameMap<ReferenceArrayFieldClassKey>>;
    children: ReactElement;
    resource?: string;
}

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
 */

const ReferenceArrayField: FC<ReferenceArrayFieldProps> = props => {
    const { children, basePath, reference, resource, record, source } = props;

    if (React.Children.count(children) !== 1) {
        throw new Error(
            '<ReferenceArrayField> only accepts a single child (like <Datagrid>)'
        );
    }

    return (
        <PureReferenceArrayFieldView
            {...props}
            {...useReferenceArrayFieldController({
                basePath,
                reference,
                resource,
                record,
                source,
            })}
        >
            {children}
        </PureReferenceArrayFieldView>
    );
};

ReferenceArrayField.propTypes = {
    ...fieldPropTypes,
    addLabel: PropTypes.bool,
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.element.isRequired,
    label: PropTypes.string,
    record: PropTypes.any,
    reference: PropTypes.string.isRequired,
    resource: PropTypes.string,
    sortBy: PropTypes.string,
    source: PropTypes.string.isRequired,
};

ReferenceArrayField.defaultProps = {
    addLabel: true,
};

const useStyles = makeStyles(
    theme => ({
        progress: { marginTop: theme.spacing(2) },
    }),
    { name: 'RaReferenceArrayField' }
);

type ReferenceArrayFieldClassKey = 'progress';

interface ReferenceArrayFieldViewProps extends FieldProps, ReferenceArrayProps {
    children: ReactElement;
    classes?: Partial<ClassNameMap<ReferenceArrayFieldClassKey>>;
    reference: string;
}

export const ReferenceArrayFieldView: FC<
    ReferenceArrayFieldViewProps
> = props => {
    const {
        children,
        className,
        data,
        ids,
        loaded,
        reference,
        referenceBasePath,
    } = props;
    const classes = useStyles(props);
    if (!loaded) {
        return <LinearProgress className={classes.progress} />;
    }

    return cloneElement(Children.only(children), {
        className,
        resource: reference,
        ids,
        data,
        loaded,
        basePath: referenceBasePath,
        currentSort: {},
    });
};

ReferenceArrayFieldView.propTypes = {
    classes: PropTypes.any,
    className: PropTypes.string,
    data: PropTypes.any,
    ids: PropTypes.array,
    loaded: PropTypes.bool,
    children: PropTypes.element.isRequired,
    reference: PropTypes.string.isRequired,
    referenceBasePath: PropTypes.string,
};

const PureReferenceArrayFieldView = memo(ReferenceArrayFieldView);

export default ReferenceArrayField;
