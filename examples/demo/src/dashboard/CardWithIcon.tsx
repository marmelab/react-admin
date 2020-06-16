import * as React from 'react';
import { FC, createElement } from 'react';
import { Card, makeStyles, Box, Typography, Divider } from '@material-ui/core';

import cartouche from './cartouche.png';

interface Props {
    icon: FC<any>;
    color: string;
    title?: string;
    subtitle?: string | number;
}

const useStyles = makeStyles({
    card: {
        minHeight: 52,
        flex: '1',
    },
    main: (props: Props) => ({
        overflow: 'inherit',
        padding: 16,
        background: `url(${cartouche}) ${props.color} no-repeat`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }),
    title: {},
});

const CardWithIcon: FC<Props> = props => {
    const { icon, title, subtitle, children } = props;
    const classes = useStyles(props);
    return (
        <Card className={classes.card}>
            <div className={classes.main}>
                <Box width="3em" color="white">
                    {createElement(icon, { fontSize: 'large' })}
                </Box>
                <Box textAlign="right">
                    <Typography className={classes.title} color="textSecondary">
                        {title}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {subtitle || ' '}
                    </Typography>
                </Box>
            </div>
            {children && <Divider />}
            {children}
        </Card>
    );
};

export default CardWithIcon;
