import * as React from 'react';
import { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps } from 'react-admin';
import { Product } from '../types';

const useStyles = makeStyles({
    root: { display: 'inline-block', marginTop: '1em', zIndex: 2 },
    content: { padding: 0, '&:last-child': { padding: 0 } },
    img: {
        width: 'initial',
        minWidth: 'initial',
        maxWidth: '42em',
        maxHeight: '15em',
    },
});

const Poster: FC<FieldProps<Product>> = ({ record }) => {
    const classes = useStyles();

    if (!record) return null;

    return (
        <Card className={classes.root}>
            <CardContent className={classes.content}>
                <img src={record.image} alt="" className={classes.img} />
            </CardContent>
        </Card>
    );
};

export default Poster;
