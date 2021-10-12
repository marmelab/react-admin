import * as React from 'react';
import { styled } from '@mui/material/styles';
import { EditButton, List, ListProps, useListContext } from 'react-admin';
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

const CategoryGrid = (props: any) => {
    const { data, ids } = useListContext<Category>();
    return ids ? (
        <StyledGrid container spacing={2} className={classes.root}>
            {ids.map(id => (
                <Grid key={id} xs={12} sm={6} md={4} lg={3} xl={2} item>
                    <Card>
                        <CardMedia
                            image={`https://marmelab.com/posters/${data[id].name}-1.jpeg`}
                            className={classes.media}
                        />
                        <CardContent className={classes.title}>
                            <Typography
                                variant="h5"
                                component="h2"
                                align="center"
                            >
                                {inflection.humanize(data[id].name)}
                            </Typography>
                        </CardContent>
                        <CardActions
                            classes={{ spacing: classes.actionSpacer }}
                        >
                            <LinkToRelatedProducts record={data[id]} />
                            <EditButton
                                basePath="/categories"
                                record={data[id]}
                            />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </StyledGrid>
    ) : null;
};

const CategoryList = (props: ListProps) => (
    <List
        {...props}
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
