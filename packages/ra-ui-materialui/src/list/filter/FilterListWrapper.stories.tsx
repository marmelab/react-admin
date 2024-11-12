import CategoryIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/MailOutline';
import { Card, CardContent, List, ListItem, Typography } from '@mui/material';
import * as React from 'react';

import { FilterListWrapper } from './FilterListWrapper';

export default { title: 'ra-ui-materialui/list/filter/FilterListWrapper' };

export const Basic = () => {
    return (
        <Card
            sx={{
                width: '17em',
                margin: '1em',
            }}
        >
            <CardContent>
                <FilterListWrapper
                    label="Subscribed to newsletter"
                    icon={<MailIcon />}
                >
                    <List>
                        <ListItem>
                            <Typography>Yes</Typography>
                        </ListItem>
                    </List>
                </FilterListWrapper>
                <FilterListWrapper label="Category" icon={<CategoryIcon />}>
                    <List>
                        <ListItem>
                            <Typography>Tests</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>News</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Deals</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Tutorials</Typography>
                        </ListItem>
                    </List>
                </FilterListWrapper>
            </CardContent>
        </Card>
    );
};
