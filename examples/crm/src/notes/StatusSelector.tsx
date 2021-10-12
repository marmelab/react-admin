import * as React from 'react';
import { styled } from '@mui/material/styles';
import { TextField, MenuItem } from '@mui/material';
import clsx from 'clsx';

import { Status } from '../misc/Status';

const PREFIX = 'StatusSelector';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledTextField = styled(TextField)({
    [`&.${classes.root}`]: {
        width: 150,
    },
});

export const StatusSelector = ({ status, setStatus, className = '' }: any) => {
    return (
        <StyledTextField
            select
            value={status}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setStatus(event.target.value);
            }}
            variant="filled"
            label={false}
            margin="none"
            size="small"
            className={clsx(className, classes.root)}
        >
            <MenuItem value="cold">
                Cold <Status status="cold" />
            </MenuItem>
            <MenuItem value="warm">
                Warm <Status status="warm" />
            </MenuItem>
            <MenuItem value="hot">
                Hot <Status status="hot" />
            </MenuItem>
            <MenuItem value="in-contract">
                In Contract <Status status="in-contract" />
            </MenuItem>
        </StyledTextField>
    );
};
