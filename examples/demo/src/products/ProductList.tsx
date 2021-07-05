import * as React from 'react';
import { FC } from 'react';
import { Box, Chip, useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    FilterForm,
    FilterContext,
    InputProps,
    ListBase,
    ListProps,
    NumberInput,
    Pagination,
    ReferenceInput,
    SearchInput,
    SelectInput,
    SortButton,
    Title,
    TopToolbar,
    useListContext,
    useTranslate,
} from 'react-admin';

import GridList from './GridList';
import Aside from './Aside';

const useQuickFilterStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(1),
    },
}));

const QuickFilter: FC<InputProps> = ({ label }) => {
    const translate = useTranslate();
    const classes = useQuickFilterStyles();
    return <Chip className={classes.root} label={translate(label)} />;
};

export const productFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput
        source="category_id"
        reference="categories"
        sort={{ field: 'id', order: 'ASC' }}
    >
        <SelectInput source="name" />
    </ReferenceInput>,
    <NumberInput source="width_gte" />,
    <NumberInput source="width_lte" />,
    <NumberInput source="height_gte" />,
    <NumberInput source="height_lte" />,
    <QuickFilter
        label="resources.products.fields.stock_lte"
        source="stock_lte"
        defaultValue={10}
    />,
];

const ListActions: FC<any> = ({ isSmall }) => (
    <TopToolbar>
        {isSmall && <FilterButton />}
        <SortButton fields={['reference', 'sales', 'stock']} />
        <CreateButton basePath="/products" />
        <ExportButton />
    </TopToolbar>
);

const ProductList: FC<ListProps> = props => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    return (
        <ListBase
            perPage={20}
            sort={{ field: 'reference', order: 'ASC' }}
            {...props}
        >
            <ProductListView isSmall={isSmall} />
        </ListBase>
    );
};

const ProductListView: FC<{ isSmall: boolean }> = ({ isSmall }) => {
    const { defaultTitle } = useListContext();
    return (
        <>
            <Title defaultTitle={defaultTitle} />
            <FilterContext.Provider value={productFilters}>
                <ListActions isSmall={isSmall} />
                {isSmall && (
                    <Box m={1}>
                        <FilterForm />
                    </Box>
                )}
            </FilterContext.Provider>
            <Box display="flex">
                <Aside />
                <Box width={isSmall ? 'auto' : 'calc(100% - 16em)'}>
                    <GridList />
                    <Pagination rowsPerPageOptions={[10, 20, 40]} />
                </Box>
            </Box>
        </>
    );
};
export default ProductList;
