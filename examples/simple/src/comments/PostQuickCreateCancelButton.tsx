import * as React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import IconCancel from '@mui/icons-material/Cancel';
import { makeStyles } from '@mui/styles';

import { useTranslate } from 'react-admin';

const useStyles = makeStyles({
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
});

const PostQuickCreateCancelButton = ({
    onClick,
    label = 'ra.action.cancel',
}) => {
    const translate = useTranslate();
    const classes = useStyles();
    return (
        <Button className={classes.button} onClick={onClick}>
            <IconCancel className={classes.iconPaddingStyle} />
            {label && translate(label, { _: label })}
        </Button>
    );
};

PostQuickCreateCancelButton.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default PostQuickCreateCancelButton;
