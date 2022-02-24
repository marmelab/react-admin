import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FieldProps } from 'react-admin';
import { Product } from '../types';

const PREFIX = 'Poster';

const classes = {
    root: `${PREFIX}-root`,
    content: `${PREFIX}-content`,
    img: `${PREFIX}-img`,
};

const StyledCard = styled(Card)({
    [`&.${classes.root}`]: {
        display: 'inline-block',
        marginTop: '1em',
        zIndex: 2,
    },
    [`& .${classes.content}`]: { padding: 0, '&:last-child': { padding: 0 } },
    [`& .${classes.img}`]: {
        width: 'initial',
        minWidth: 'initial',
        maxWidth: '42em',
        maxHeight: '15em',
    },
});

const Poster = (props: FieldProps<Product>) => {
    const { record } = props;

    if (!record) return null;

    return (
        <StyledCard className={classes.root}>
            <CardContent className={classes.content}>
                <img src={record.image} alt="" className={classes.img} />
            </CardContent>
        </StyledCard>
    );
};

export default Poster;
