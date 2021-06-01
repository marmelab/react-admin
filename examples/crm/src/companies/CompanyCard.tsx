import * as React from 'react';
import { useState } from 'react';
import { Paper, Typography, Link as MuiLink } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ContactsIcon from '@material-ui/icons/AccountCircle';
import DealIcon from '@material-ui/icons/MonetizationOn';
import { linkToRecord, SelectField } from 'react-admin';
import { Link } from 'react-router-dom';

import { sectors } from './sectors';
import { CompanyAvatar } from './CompanyAvatar';
import { Company } from '../types';

const useStyles = makeStyles(theme => ({
    paper: {
        height: 200,
        width: 193.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1em',
    },
    identity: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    name: {
        textAlign: 'center',
        marginTop: theme.spacing(1),
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
    },
    singleStat: {
        display: 'flex',
        alignItems: 'center',
    },
    statIcon: {
        marginRight: theme.spacing(1),
    },
}));

export const CompanyCard = ({ record }: { record: Company }) => {
    const classes = useStyles();
    const [elevation, setElevation] = useState(1);
    return (
        <MuiLink
            component={Link}
            to={linkToRecord('/companies', record.id, 'show')}
            underline="none"
            onMouseEnter={() => setElevation(3)}
            onMouseLeave={() => setElevation(1)}
        >
            <Paper className={classes.paper} elevation={elevation}>
                <div className={classes.identity}>
                    <CompanyAvatar record={record} />
                    <div className={classes.name}>
                        <Typography variant="subtitle2">
                            {record.name}
                        </Typography>
                        <SelectField
                            color="textSecondary"
                            source="sector"
                            choices={sectors}
                            record={record}
                        />
                    </div>
                </div>
                <div className={classes.stats}>
                    <div className={classes.singleStat}>
                        <ContactsIcon
                            color="disabled"
                            className={classes.statIcon}
                        />
                        <div>
                            <Typography
                                variant="subtitle2"
                                style={{ marginBottom: -8 }}
                            >
                                {record.nb_contacts}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {record.nb_contacts > 1
                                    ? 'contacts'
                                    : 'contact'}
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.singleStat}>
                        <DealIcon
                            color="disabled"
                            className={classes.statIcon}
                        />
                        <div>
                            <Typography
                                variant="subtitle2"
                                style={{ marginBottom: -8 }}
                            >
                                {record.nb_deals}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {record.nb_deals > 1 ? 'deals' : 'deal'}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Paper>
        </MuiLink>
    );
};
