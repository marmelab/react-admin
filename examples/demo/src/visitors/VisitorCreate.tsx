import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    Create,
    CreateProps,
    DateInput,
    SimpleForm,
    TextInput,
    useTranslate,
    PasswordInput,
    required,
    email,
} from 'react-admin';
import { AnyObject } from 'react-final-form';
import { Typography, Box } from '@mui/material';

const PREFIX = 'VisitorCreate';

const classes = {
    first_name: `${PREFIX}-first_name`,
    last_name: `${PREFIX}-last_name`,
    email: `${PREFIX}-email`,
    address: `${PREFIX}-address`,
    zipcode: `${PREFIX}-zipcode`,
    city: `${PREFIX}-city`,
    comment: `${PREFIX}-comment`,
    password: `${PREFIX}-password`,
    confirm_password: `${PREFIX}-confirm_password`,
};

const StyledSimpleForm = styled(SimpleForm)({
    [`& .${classes.first_name}`]: { display: 'inline-block' },
    [`& .${classes.last_name}`]: { display: 'inline-block', marginLeft: 32 },
    [`& .${classes.email}`]: { width: 544 },
    [`& .${classes.address}`]: { maxWidth: 544 },
    [`& .${classes.zipcode}`]: { display: 'inline-block' },
    [`& .${classes.city}`]: { display: 'inline-block', marginLeft: 32 },
    [`& .${classes.comment}`]: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    [`& .${classes.password}`]: { display: 'inline-block' },
    [`& .${classes.confirm_password}`]: {
        display: 'inline-block',
        marginLeft: 32,
    },
});

export {};

export const validatePasswords = ({
    password,
    confirm_password,
}: AnyObject) => {
    const errors = {} as any;

    if (password && confirm_password && password !== confirm_password) {
        errors.confirm_password = [
            'resources.customers.errors.password_mismatch',
        ];
    }

    return errors;
};

const VisitorCreate = (props: CreateProps) => (
    <Create {...props}>
        <StyledSimpleForm validate={validatePasswords}>
            <SectionTitle label="resources.customers.fieldGroups.identity" />
            <TextInput
                autoFocus
                source="first_name"
                formClassName={classes.first_name}
                validate={requiredValidate}
            />
            <TextInput
                source="last_name"
                formClassName={classes.last_name}
                validate={requiredValidate}
            />
            <TextInput
                type="email"
                source="email"
                validation={{ email: true }}
                fullWidth
                formClassName={classes.email}
                validate={[required(), email()]}
            />
            <DateInput source="birthday" />
            <Separator />
            <SectionTitle label="resources.customers.fieldGroups.address" />
            <TextInput
                source="address"
                formClassName={classes.address}
                multiline
                fullWidth
                helperText={false}
            />
            <TextInput
                source="zipcode"
                formClassName={classes.zipcode}
                helperText={false}
            />
            <TextInput
                source="city"
                formClassName={classes.city}
                helperText={false}
            />
            <Separator />
            <SectionTitle label="resources.customers.fieldGroups.password" />
            <PasswordInput source="password" formClassName={classes.password} />
            <PasswordInput
                source="confirm_password"
                formClassName={classes.confirm_password}
            />
        </StyledSimpleForm>
    </Create>
);

const requiredValidate = [required()];

const SectionTitle = ({ label }: { label: string }) => {
    const translate = useTranslate();

    return (
        <Typography variant="h6" gutterBottom>
            {translate(label)}
        </Typography>
    );
};

const Separator = () => <Box pt="1em" />;

export default VisitorCreate;
