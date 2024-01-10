import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Tab } from '@mui/material';
import { useTranslateLabel } from 'react-admin';

const PREFIX = 'FieldConfigurationTab';

const classes = {
    root: `${PREFIX}-root`,
    selected: `${PREFIX}-selected`,
};

const StyledTab = styled(Tab)(({ theme }) => ({
    [`&.MuiTab-root`]: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        textTransform: 'none',
        minHeight: 0,
        fontWeight: 'normal',
    },

    [`& .Mui-selected`]: {
        fontWeight: 'bold',
    },
}));

export const FieldConfigurationTab = ({ field, resource, ...props }) => {
    const translateLabel = useTranslateLabel();
    const labelArgs = {
        source: field.props.source,
        resource,
        label: field.props.label,
    };

    return (
        <StyledTab
            {...props}
            key={field.props.source}
            label={translateLabel(labelArgs)}
            id={`nav-tab-${field.props.source}`}
            aria-controls={`nav-tabpanel-${field.props.source}`}
            classes={classes}
        />
    );
};
