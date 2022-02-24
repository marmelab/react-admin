import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useTranslate } from 'react-admin';
import { stringify } from 'query-string';

import visitors from '../visitors';

const PREFIX = 'LinkToRelatedCustomers';

const classes = {
    icon: `${PREFIX}-icon`,
    link: `${PREFIX}-link`,
};

const StyledButton = styled(Button)({
    [`& .${classes.icon}`]: { paddingRight: '0.5em' },
    [`&.${classes.link}`]: {
        display: 'inline-flex',
        alignItems: 'center',
    },
});

const LinkToRelatedCustomers = ({ segment }: { segment: string }) => {
    const translate = useTranslate();

    return (
        <StyledButton
            size="small"
            color="primary"
            // @ts-ignore
            component={Link}
            to={{
                pathname: '/customers',
                search: stringify({
                    filter: JSON.stringify({ groups: segment }),
                }),
            }}
            className={classes.link}
        >
            <visitors.icon className={classes.icon} />
            {translate('resources.segments.fields.customers')}
        </StyledButton>
    );
};

export default LinkToRelatedCustomers;
