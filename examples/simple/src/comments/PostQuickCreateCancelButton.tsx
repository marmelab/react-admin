import * as React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import IconCancel from '@mui/icons-material/Cancel';

import { useTranslate } from 'react-admin';

const PostQuickCreateCancelButton = ({
    onClick,
    label = 'ra.action.cancel',
}) => {
    const translate = useTranslate();

    return (
        <Button
            sx={{ margin: '10px 24px', position: 'relative' }}
            onClick={onClick}
        >
            <IconCancel sx={{ paddingRight: '0.5em' }} />
            {label && translate(label, { _: label })}
        </Button>
    );
};

PostQuickCreateCancelButton.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default PostQuickCreateCancelButton;
