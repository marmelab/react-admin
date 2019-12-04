import React from 'react';
import Inbox from '@material-ui/icons/Inbox';
import { makeStyles } from '@material-ui/styles';
import { useTranslate } from 'ra-core';
import { CreateButton } from '../button';
import inflection from 'inflection';

const useStyles = makeStyles({
    message: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
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
});

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

    return (
        <>
            <div className={classes.message}>
                <Inbox className={classes.icon} />
                <h1>{translate('ra.page.empty', { name: resourceName })}</h1>
                <div>{translate('ra.page.invite')}</div>
            </div>
            <div className={classes.toolbar}>
                <CreateButton variant="contained" basePath={basePath} />
            </div>
        </>
    );
};

export default Empty;
