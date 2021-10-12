import * as React from 'react';
import { Box, Chip, useMediaQuery, Theme } from '@mui/material';
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

import ImageList from './GridList';
import Aside from './Aside';

const PREFIX = 'ProductList';

const classes = {
    root: `${PREFIX}-root`,
};

const QuickFilter = ({ label }: InputProps) => {
    const translate = useTranslate();
    return (
        <Chip
            sx={{ marginBottom: 1 }}
            className={classes.root}
            label={translate(label)}
        />
    );
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

const ListActions = ({ isSmall }: any) => (
    <TopToolbar>
        {isSmall && <FilterButton />}
        <SortButton fields={['reference', 'sales', 'stock']} />
        <CreateButton basePath="/products" />
        <ExportButton />
    </TopToolbar>
);

const ProductList = (props: ListProps) => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
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

const ProductListView = ({ isSmall }: { isSmall: boolean }) => {
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
                    <ImageList />
                    <Pagination rowsPerPageOptions={[10, 20, 40]} />
                </Box>
            </Box>
        </>
    );
};
export default ProductList;
