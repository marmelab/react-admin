import * as React from 'react';
import { styled } from '@mui/material/styles';
import { memo } from 'react';

import { FieldProps } from 'react-admin';
import AvatarField from './AvatarField';
import { Customer } from '../types';

const PREFIX = 'FullNameField';

const classes = {
    root: `${PREFIX}-root`,
    avatar: `${PREFIX}-avatar`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },

    [`& .${classes.avatar}`]: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(-0.5),
        marginBottom: theme.spacing(-0.5),
    },
}));

interface Props extends FieldProps<Customer> {
    size?: string;
}

const FullNameField = (props: Props) => {
    const { record, size } = props;

    return record ? (
        <Root className={classes.root}>
            <AvatarField
                className={classes.avatar}
                record={record}
                size={size}
            />
            {record.first_name} {record.last_name}
        </Root>
    ) : null;
};

FullNameField.defaultProps = {
    source: 'last_name',
    label: 'resources.customers.fields.name',
};

export default memo<Props>(FullNameField);
