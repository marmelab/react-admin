import * as React from 'react';
import {
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import CodeIcon from '@material-ui/icons/Code';

const useStyles = makeStyles(theme => ({
    root: {
        background: `#c5dedd`,
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '1em',
        marginBottom: '1em',
        marginTop: '2em',
    },
    actions: {
        padding: theme.spacing(2),
        marginTop: -theme.spacing(2),
        marginBottom: -theme.spacing(1),
        flexDirection: 'column',
        '& a': {
            marginBottom: theme.spacing(1),
            backgroundColor: 'white',
            marginLeft: '0 !important',
        },
    },
}));

export const Welcome = () => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    CRM demo
                </Typography>
                <Typography gutterBottom>
                    This app runs in the browser, and relies on a mock REST API.
                    Feel free to explore and modify the data - it's local to
                    your computer, and will reset each time you reload.
                </Typography>
                <Typography gutterBottom>
                    It was built using react-admin, an open-source framework.
                    The code for this demo is also open-source. Reading it is a
                    great way to learn react-admin!
                </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
                <Button
                    variant="contained"
                    fullWidth
                    href="https://marmelab.com/react-admin"
                    startIcon={<HomeIcon />}
                >
                    React-admin site
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    href="https://github.com/marmelab/react-admin/tree/master/examples/crm"
                    startIcon={<CodeIcon />}
                >
                    Source for this demo
                </Button>
            </CardActions>
        </Card>
    );
};
