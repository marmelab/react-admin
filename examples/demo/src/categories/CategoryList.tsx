import * as React from 'react';
import { styled } from '@mui/material/styles';
import { EditButton, List, useListContext } from 'react-admin';
import inflection from 'inflection';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
} from '@mui/material';

import LinkToRelatedProducts from './LinkToRelatedProducts';
import { Category } from '../types';

const PREFIX = 'CategoryList';

const classes = {
    root: `${PREFIX}-root`,
    media: `${PREFIX}-media`,
    title: `${PREFIX}-title`,
    actionSpacer: `${PREFIX}-actionSpacer`,
};

const StyledGrid = styled(Grid)({
    [`&.${classes.root}`]: {
        marginTop: '1em',
    },
    [`& .${classes.media}`]: {
        height: 140,
    },
    [`& .${classes.title}`]: {
        paddingBottom: '0.5em',
    },
    [`& .${classes.actionSpacer}`]: {
        display: 'flex',
        justifyContent: 'space-around',
    },
});

const CategoryGrid = () => {
    const { data, isLoading } = useListContext<Category>();
    if (isLoading) {
        return null;
    }
    return (
        <StyledGrid container spacing={2} className={classes.root}>
            {data.map(record => (
                <Grid key={record.id} xs={12} sm={6} md={4} lg={3} xl={2} item>
                    <Card>
                        <CardMedia
                            image={`https://marmelab.com/posters/${record.name}-1.jpeg`}
                            className={classes.media}
                        />
                        <CardContent className={classes.title}>
                            <Typography
                                variant="h5"
                                component="h2"
                                align="center"
                            >
                                {inflection.humanize(record.name)}
                            </Typography>
                        </CardContent>
                        <CardActions
                            classes={{ spacing: classes.actionSpacer }}
                        >
                            <LinkToRelatedProducts record={record} />
                            <EditButton record={record} />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </StyledGrid>
    );
};

const CategoryList = () => (
    <List
        sort={{ field: 'name', order: 'ASC' }}
        perPage={20}
        pagination={false}
        component="div"
        actions={false}
    >
        <CategoryGrid />
    </List>
);

export default CategoryList;
