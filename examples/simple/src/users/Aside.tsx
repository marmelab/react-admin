import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const PREFIX = 'Aside';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
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
    return (
        /*<Box
              sx={{
                  width: {
                      sm: 200,
                      md: 0,
                  },
                  margin: {
                      sm: '1em',
                      md: 0,
                  },
                  overflowX: {
                      md: 'hidden',
                  },
              }}
        >*/
        <Root className={classes.root}>
            <Typography variant="h6">App Users</Typography>
            <Typography variant="body2">
                Eiusmod adipisicing tempor duis qui. Ullamco aliqua tempor
                incididunt aliquip aliquip qui ad minim aliqua. Aute et magna
                quis pariatur irure sunt. Aliquip velit consequat dolore ullamco
                laborum voluptate cupidatat. Proident minim reprehenderit id
                dolore elit sit occaecat ad amet tempor esse occaecat enim.
                Laborum aliqua excepteur qui ipsum in dolor et cillum est.
            </Typography>
        </Root>
    );
};

export default Aside;
