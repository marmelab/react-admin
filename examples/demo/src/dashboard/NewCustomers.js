import React from 'react';
import compose from 'recompose/compose';
import Card from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import CustomerIcon from '@material-ui/icons/PersonAdd';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router-dom';
import { translate } from 'react-admin';

import CardIcon from './CardIcon';

const styles = theme => ({
    main: {
        flex: '1',
        marginLeft: '1em',
        marginTop: 20,
    },
    card: {
        overflow: 'inherit',
        textAlign: 'right',
        padding: 16,
    },
    value: {
        minHeight: 48,
    },
    avatar: {
        background: theme.palette.background.avatar,
    },
    listItemText: {
        paddingRight: 0,
    },
});

const NewCustomers = ({ visitors = [], nb, translate, classes }) => (
    <div className={classes.main}>
        <CardIcon Icon={CustomerIcon} bgColor="#4caf50" />
        <Card className={classes.card}>
            <Typography className={classes.title} color="textSecondary">
                {translate('pos.dashboard.new_customers')}
            </Typography>
            <Typography
                variant="headline"
                component="h2"
                className={classes.value}
            >
                {nb}
            </Typography>
            <Divider />
            <List>
                {visitors.map(record => (
                    <ListItem
                        button
                        to={`/customers/${record.id}`}
                        component={Link}
                        key={record.id}
                    >
                        <Avatar
                            src={`${record.avatar}?size=32x32`}
                            className={classes.avatar}
                        />
                        <ListItemText
                            primary={`${record.first_name} ${record.last_name}`}
                            className={classes.listItemText}
                        />
                    </ListItem>
                ))}
            </List>
        </Card>
    </div>
);

const enhance = compose(withStyles(styles), translate);

export default enhance(NewCustomers);
