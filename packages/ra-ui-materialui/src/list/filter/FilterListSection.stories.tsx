import CategoryIcon from '@mui/icons-material/LocalOffer';
import MailIcon from '@mui/icons-material/MailOutline';
import { Card, CardContent, List, ListItem, Typography } from '@mui/material';
import * as React from 'react';

import { FilterListSection } from './FilterListSection';

export default { title: 'ra-ui-materialui/list/filter/FilterListSection' };

export const Basic = () => {
    return (
        <Card
            sx={{
                width: '17em',
                margin: '1em',
            }}
        >
            <CardContent>
                <FilterListSection
                    label="Subscribed to newsletter"
                    icon={<MailIcon />}
                >
                    <List>
                        <ListItem>
                            <Typography>Yes</Typography>
                        </ListItem>
                    </List>
                </FilterListSection>
                <FilterListSection label="Category" icon={<CategoryIcon />}>
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
                </FilterListSection>
            </CardContent>
        </Card>
    );
};
