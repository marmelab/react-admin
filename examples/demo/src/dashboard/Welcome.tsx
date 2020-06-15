import * as React from 'react';
import { FC } from 'react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Grid,
    Typography,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import CodeIcon from '@material-ui/icons/Code';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-admin';

const mediaUrl = `https://marmelab.com/posters/beard-${parseInt(
    (Math.random() * 10).toString(),
    10
) + 1}.jpeg`;

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#6f4bf0',
        color: '#fff',
        padding: 20,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    media: {
        background: `url(${mediaUrl}) top right / cover`,
        marginLeft: 'auto',
    },
    actions: {
        '& a': {
            backgroundColor: '#fff',
            '& span': {
                color: theme.palette.primary.main,
            },
        },
    },
}));

const Welcome: FC = () => {
    const translate = useTranslate();
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        {translate('pos.dashboard.welcome.title')}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {translate('pos.dashboard.welcome.subtitle')}
                    </Typography>
                    <CardActions className={classes.actions}>
                        <Button
                            variant="contained"
                            href="https://marmelab.com/react-admin"
                        >
                            <HomeIcon style={{ paddingRight: '0.5em' }} />
                            {translate('pos.dashboard.welcome.aor_button')}
                        </Button>
                        <Button
                            variant="contained"
                            href="https://marmelab.com/react-admin"
                        >
                            <HomeIcon style={{ paddingRight: '0.5em' }} />
                            {translate('pos.dashboard.welcome.demo_button')}
                        </Button>
                    </CardActions>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <Box height="9em" width="15em" className={classes.media} />
                </Grid>
            </Grid>
        </Card>
    );
};

export default Welcome;
