import * as React from 'react';
import { Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getFieldLabelTranslationArgs, useTranslate } from 'ra-core';

export const FieldConfigurationTab = ({ field, resource, ...props }) => {
    const classes = useStyles();
    const translate = useTranslate();
    const labelArgs = getFieldLabelTranslationArgs({
        source: field.props.source,
        resource,
        label: field.props.label,
    });

    return (
        <Tab
            {...props}
            key={field.props.source}
            label={translate(...labelArgs)}
            id={`nav-tab-${field.props.source}`}
            aria-controls={`nav-tabpanel-${field.props.source}`}
            classes={classes}
        />
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        textTransform: 'none',
        minHeight: 0,
        fontWeight: 'normal',
    },
    selected: {
        fontWeight: 'bold',
    },
}));
