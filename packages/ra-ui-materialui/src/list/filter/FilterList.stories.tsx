import * as React from 'react';
import { useList, useListContext, ListContextProvider } from 'ra-core';
import { Box, Typography, Card, CardContent } from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';
import CategoryIcon from '@mui/icons-material/LocalOffer';
import { FilterList } from './FilterList';
import { FilterListItem } from './FilterListItem';

export default { title: 'ra-ui-materialui/list/filter/FilterList' };

export const Basic = () => {
    const listContext = useList({
        data: [
            { id: 1, title: 'Hello', has_newsletter: true },
            { id: 2, title: 'World', has_newsletter: false },
        ],
        ids: [1, 2],
        loading: false,
        loaded: true,
        filter: {
            category: 'deals',
        },
    });
    return (
        <ListContextProvider value={listContext}>
            <Card
                sx={{
                    width: '17em',
                    margin: '1em',
                }}
            >
                <CardContent>
                    <FilterList
                        label="Subscribed to newsletter"
                        icon={<MailIcon />}
                    >
                        <FilterListItem
                            label="Yes"
                            value={{ has_newsletter: true }}
                        />
                        <FilterListItem
                            label="No"
                            value={{ has_newsletter: false }}
                        />
                    </FilterList>
                    <FilterList label="Category" icon={<CategoryIcon />}>
                        <FilterListItem
                            label="Tests"
                            value={{ category: 'tests' }}
                        />
                        <FilterListItem
                            label="News"
                            value={{ category: 'news' }}
                        />
                        <FilterListItem
                            label="Deals"
                            value={{ category: 'deals' }}
                        />
                        <FilterListItem
                            label="Tutorials"
                            value={{ category: 'tutorials' }}
                        />
                    </FilterList>
                </CardContent>
            </Card>
            <FilterValue />
        </ListContextProvider>
    );
};

const FilterValue = () => {
    const { filterValues } = useListContext();
    return (
        <Box sx={{ margin: '1em' }}>
            <Typography>Filter values:</Typography>
            <pre>{JSON.stringify(filterValues, null, 2)}</pre>
        </Box>
    );
};
