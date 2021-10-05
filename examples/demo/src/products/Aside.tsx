import * as React from 'react';
import inflection from 'inflection';
import { Card, CardContent } from '@mui/material';
import { makeStyles } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {
    FilterList,
    FilterListItem,
    FilterLiveSearch,
    useGetList,
} from 'react-admin';

import { Category } from '../types';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            width: '15em',
            marginRight: '1em',
            overflow: 'initial',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
}));

const Aside = () => {
    const { data, ids } = useGetList<Category>(
        'categories',
        { page: 1, perPage: 100 },
        { field: 'name', order: 'ASC' },
        {}
    );
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                <FilterLiveSearch />

                <FilterList
                    label="resources.products.filters.sales"
                    icon={<AttachMoneyIcon />}
                >
                    <FilterListItem
                        label="resources.products.filters.best_sellers"
                        value={{
                            sales_lte: undefined,
                            sales_gt: 25,
                            sales: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.average_sellers"
                        value={{
                            sales_lte: 25,
                            sales_gt: 10,
                            sales: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.low_sellers"
                        value={{
                            sales_lte: 10,
                            sales_gt: 0,
                            sales: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.never_sold"
                        value={{
                            sales_lte: undefined,
                            sales_gt: undefined,
                            sales: 0,
                        }}
                    />
                </FilterList>

                <FilterList
                    label="resources.products.filters.stock"
                    icon={<BarChartIcon />}
                >
                    <FilterListItem
                        label="resources.products.filters.no_stock"
                        value={{
                            stock_lt: undefined,
                            stock_gt: undefined,
                            stock: 0,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.low_stock"
                        value={{
                            stock_lt: 10,
                            stock_gt: 0,
                            stock: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.average_stock"
                        value={{
                            stock_lt: 50,
                            stock_gt: 9,
                            stock: undefined,
                        }}
                    />
                    <FilterListItem
                        label="resources.products.filters.enough_stock"
                        value={{
                            stock_lt: undefined,
                            stock_gt: 49,
                            stock: undefined,
                        }}
                    />
                </FilterList>

                <FilterList
                    label="resources.products.filters.categories"
                    icon={<LocalOfferIcon />}
                >
                    {ids &&
                        data &&
                        ids.map((id: any) => (
                            <FilterListItem
                                label={inflection.humanize(data[id].name)}
                                key={data[id].id}
                                value={{ category_id: data[id].id }}
                            />
                        ))}
                </FilterList>
            </CardContent>
        </Card>
    );
};

export default Aside;
