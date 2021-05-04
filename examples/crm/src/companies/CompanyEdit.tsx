import * as React from 'react';
import {
    Edit,
    EditProps,
    ReferenceInput,
    SimpleForm,
    TextInput,
    SelectInput,
    useRecordContext,
    required,
} from 'react-admin';
import { Box, CardContent, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { CompanyAside } from './CompanyAside';
import { LogoField } from './LogoField';
import { sectors } from './sectors';
import { sizes } from './sizes';

const useStyles = makeStyles({
    inline: {
        display: 'inline-block',
        marginLeft: '1em',
        '&.first-child': {
            marginLeft: 0,
        },
    },
});

export const CompanyEdit = (props: EditProps) => {
    const classes = useStyles();
    return (
        <Edit {...props} aside={<CompanyAside link="show" />} actions={false}>
            <SimpleForm component={CustomLayout} redirect="show">
                <TextInput source="name" validate={required()} fullWidth />
                <SelectInput
                    source="sector"
                    choices={sectors}
                    formClassName={clsx(classes.inline, 'first-child')}
                />
                <SelectInput
                    source="size"
                    choices={sizes}
                    formClassName={classes.inline}
                />
                <CustomDivider />
                <TextInput source="address" fullWidth helperText={false} />
                <TextInput
                    source="city"
                    formClassName={clsx(classes.inline, 'first-child')}
                />
                <TextInput source="zipcode" formClassName={classes.inline} />
                <TextInput source="stateAbbr" formClassName={classes.inline} />
                <CustomDivider />
                <TextInput source="website" fullWidth helperText={false} />
                <TextInput source="linkedIn" fullWidth helperText={false} />
                <TextInput source="logo" fullWidth />
                <CustomDivider />
                <TextInput
                    source="phone_number"
                    formClassName={clsx(classes.inline, 'first-child')}
                    helperText={false}
                />
                <ReferenceInput
                    source="sales_id"
                    reference="sales"
                    label="Account manager"
                    formClassName={classes.inline}
                    helperText={false}
                >
                    <SelectInput
                        optionText={(sales: any) =>
                            `${sales.first_name} ${sales.last_name}`
                        }
                    />
                </ReferenceInput>
            </SimpleForm>
        </Edit>
    );
};

const CustomLayout = (props: any) => {
    const record = useRecordContext(props);
    return (
        <CardContent>
            <Box display="flex">
                <LogoField record={record as any} />
                <Box ml={2} flex="1" maxWidth={796}>
                    {props.children}
                </Box>
            </Box>
        </CardContent>
    );
};

const CustomDivider = () => (
    <Box mb={2}>
        <Divider />
    </Box>
);
