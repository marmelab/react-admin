import * as React from 'react';
import { FC } from 'react';
import { Box, Chip, useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InputProps } from 'ra-core';
import {
    Filter,
    ListBase,
    NumberInput,
    Pagination,
    ReferenceInput,
    SearchInput,
    SelectInput,
    TopToolbar,
    CreateButton,
    ExportButton,
    SortButton,
    useTranslate,
} from 'react-admin';

import { FilterProps, ListComponentProps } from '../types';
import GridList from './GridList';
import Aside from './Aside';

const useQuickFilterStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(3),
    },
}));

const QuickFilter: FC<InputProps> = ({ label }) => {
    const translate = useTranslate();
    const classes = useQuickFilterStyles();
    return <Chip className={classes.root} label={translate(label)} />;
};

interface FilterParams {
    q?: string;
    category_id?: string;
    width_gte?: number;
    width_lte?: number;
    height_gte?: number;
    height_lte?: number;
    stock_lte?: number;
}

export const ProductFilter: FC<FilterProps<FilterParams>> = props => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <ReferenceInput
            source="category_id"
            reference="categories"
            sort={{ field: 'id', order: 'ASC' }}
        >
            <SelectInput source="name" />
        </ReferenceInput>
        <NumberInput source="width_gte" />
        <NumberInput source="width_lte" />
        <NumberInput source="height_gte" />
        <NumberInput source="height_lte" />
        <QuickFilter
            label="resources.products.fields.stock_lte"
            source="stock_lte"
            defaultValue={10}
        />
    </Filter>
);

const ListActions: FC<any> = ({ isSmall }) => (
    <TopToolbar>
        {isSmall && <ProductFilter context="button" />}
        <SortButton fields={['reference', 'sales', 'stock']} />
        <CreateButton basePath="/products" />
        <ExportButton />
    </TopToolbar>
);

const ProductList: FC<ListComponentProps> = props => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    return (
        <ListBase
            filters={isSmall ? <ProductFilter /> : null}
            perPage={20}
            sort={{ field: 'reference', order: 'ASC' }}
            {...props}
        >
            <ListActions isSmall={isSmall} />
            {isSmall && (
                <Box m={1}>
                    <ProductFilter context="form" />
                </Box>
            )}
            <Box display="flex">
                <Aside />
                <Box width={isSmall ? 'auto' : 'calc(100% - 16em)'}>
                    <GridList />
                    <Pagination rowsPerPageOptions={[10, 20, 40]} />
                </Box>
            </Box>
        </ListBase>
    );
};
export default ProductList;
