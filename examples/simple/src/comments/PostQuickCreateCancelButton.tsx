import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import IconCancel from '@mui/icons-material/Cancel';

import { useTranslate } from 'react-admin';

const PREFIX = 'PostQuickCreateCancelButton';

const classes = {
    button: `${PREFIX}-button`,
    iconPaddingStyle: `${PREFIX}-iconPaddingStyle`,
};

const StyledButton = styled(Button)({
    [`&.${classes.button}`]: {
        margin: '10px 24px',
        position: 'relative',
    },
    [`& .${classes.iconPaddingStyle}`]: {
        paddingRight: '0.5em',
    },
});

const PostQuickCreateCancelButton = ({
    onClick,
    label = 'ra.action.cancel',
}) => {
    const translate = useTranslate();

    return (
        <StyledButton className={classes.button} onClick={onClick}>
            <IconCancel className={classes.iconPaddingStyle} />
            {label && translate(label, { _: label })}
        </StyledButton>
    );
};

PostQuickCreateCancelButton.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default PostQuickCreateCancelButton;
