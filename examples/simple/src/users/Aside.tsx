import * as React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            width: 200,
            margin: '1em',
        },
        [theme.breakpoints.down('md')]: {
            width: 0,
            overflowX: 'hidden',
            margin: 0,
        },
    },
}));

const Aside = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant="h6">App Users</Typography>
            <Typography variant="body2">
                Eiusmod adipisicing tempor duis qui. Ullamco aliqua tempor
                incididunt aliquip aliquip qui ad minim aliqua. Aute et magna
                quis pariatur irure sunt. Aliquip velit consequat dolore ullamco
                laborum voluptate cupidatat. Proident minim reprehenderit id
                dolore elit sit occaecat ad amet tempor esse occaecat enim.
                Laborum aliqua excepteur qui ipsum in dolor et cillum est.
            </Typography>
        </div>
    );
};

export default Aside;
