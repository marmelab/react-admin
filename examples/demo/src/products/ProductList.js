import React from 'react';
import {
    Filter,
    List,
    NumberInput,
    Pagination,
    ReferenceInput,
    SearchInput,
    SelectInput,
    useTranslate,
} from 'react-admin';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import GridList from './GridList';

const useQuickFilterStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(3),
    },
}));

const QuickFilter = ({ label }) => {
    const translate = useTranslate();
    const classes = useQuickFilterStyles();
    return <Chip className={classes.root} label={translate(label)} />;
};

export const ProductFilter = props => (
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

const ProductList = props => (
    <List
        {...props}
        filters={<ProductFilter />}
        perPage={20}
        pagination={<Pagination rowsPerPageOptions={[10, 20, 40]} />}
        sort={{ field: 'id', order: 'ASC' }}
    >
        <GridList />
    </List>
);

export default ProductList;
