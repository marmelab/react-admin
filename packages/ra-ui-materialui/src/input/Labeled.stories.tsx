import * as React from 'react';
import { Typography, Stack, TextField } from '@mui/material';
import { Labeled } from './Labeled';

export default { title: 'ra-ui-materialui/input/Labeled' };

export const Basic = () => (
    <Stack
        direction="row"
        spacing={2}
        sx={{ margin: 2, border: 'solid 1px lightgrey' }}
    >
        <Stack spacing={2}>
            <Labeled label="First name">
                <Typography variant="body2" component="span">
                    John
                </Typography>
            </Labeled>
            <Labeled label="Last name">
                <Typography variant="body2" component="span">
                    Doe
                </Typography>
            </Labeled>
            <Labeled label="Comments">
                <Typography variant="body2" component="span">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
            </Labeled>
        </Stack>
        <Stack spacing={2}>
            <TextField
                label="First Name"
                value="John"
                size="small"
                variant="filled"
            />
            <TextField
                label="Last Name"
                value="Doe"
                size="small"
                variant="filled"
            />
            <TextField
                label="Comments"
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                size="small"
                variant="filled"
            />
        </Stack>
        <Stack spacing={2}>
            <TextField label="First Name" value="John" size="small" />
            <TextField label="Last Name" value="Doe" size="small" />
            <TextField
                label="Comments"
                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                size="small"
            />
        </Stack>
    </Stack>
);

export const Variants = () => (
    <Stack
        direction="row"
        spacing={2}
        sx={{ margin: 2, border: 'solid 1px lightgrey' }}
    >
        <Stack spacing={2}>
            <Labeled label="With Error" meta={{ error: true, touched: true }}>
                <Typography variant="body2" component="span">
                    John
                </Typography>
            </Labeled>
            <Labeled label="Required" isRequired>
                <Typography variant="body2" component="span">
                    Doe
                </Typography>
            </Labeled>
        </Stack>
    </Stack>
);
