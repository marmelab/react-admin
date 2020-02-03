import React from 'react';
import Inbox from '@material-ui/icons/Inbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useTranslate } from 'ra-core';
import { CreateButton } from '../button';
import inflection from 'inflection';

const useStyles = makeStyles(
    {
        message: {
            textAlign: 'center',
            opacity: 0.5,
            margin: '0 1em',
        },
        icon: {
            width: '9em',
            height: '9em',
        },
        toolbar: {
            textAlign: 'center',
            marginTop: '2em',
        },
    },
    { name: 'RaEmpty' }
);

const Empty = ({ resource, basePath }) => {
    const classes = useStyles();
    const translate = useTranslate();

    const resourceName = inflection.humanize(
        translate(`resources.${resource}.name`, {
            smart_count: 0,
            _: inflection.pluralize(resource),
        }),
        true
    );

    const emptyMessage = translate('ra.page.empty', { name: resourceName });
    const inviteMessage = translate('ra.page.invite');

    return (
        <>
            <div className={classes.message}>
                <Inbox className={classes.icon} />
                <Typography variant="h4" paragraph>
                    {translate(`resources.${resource}.empty`, {
                        _: emptyMessage,
                    })}
                </Typography>
                <Typography variant="body1">
                    {translate(`resources.${resource}.invite`, {
                        _: inviteMessage,
                    })}
                </Typography>
            </div>
            <div className={classes.toolbar}>
                <CreateButton variant="contained" basePath={basePath} />
            </div>
        </>
    );
};

export default Empty;
