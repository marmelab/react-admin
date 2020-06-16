import * as React from 'react';
import { FC, ComponentType } from 'react';
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
        margin: '15px 20px 0 15px',
        zIndex: 100,
        borderRadius: 50,
    },
    icon: {
        float: 'right',
        width: 32,
        height: 32,
        padding: '0.5em',
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
