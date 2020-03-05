import React, { FC, ComponentType } from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

interface Props {
    bgColor: string;
    Icon: ComponentType<SvgIconProps>;
}

const useStyles = makeStyles({
    card: {
        float: 'left',
        margin: '-20px 20px 0 15px',
        zIndex: 100,
        borderRadius: 3,
    },
    icon: {
        float: 'right',
        width: 54,
        height: 54,
        padding: 14,
        color: '#fff',
    },
});

const CardIcon: FC<Props> = ({ Icon, bgColor }) => {
    const classes = useStyles();
    return (
        <Card className={classes.card} style={{ backgroundColor: bgColor }}>
            <Icon className={classes.icon} />
        </Card>
    );
};

export default CardIcon;
