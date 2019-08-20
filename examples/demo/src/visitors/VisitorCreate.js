import React from 'react';
import { Create, DateInput, FormTab, TabbedForm, TextInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

export const styles = {
    first_name: { display: 'inline-block' },
    last_name: { display: 'inline-block', marginLeft: 32 },
    email: { width: 544 },
    address: { maxWidth: 544 },
    zipcode: { display: 'inline-block' },
    city: { display: 'inline-block', marginLeft: 32 },
    comment: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

const useStyles = makeStyles(styles);

const VisitorCreate = props => {
    const classes = useStyles();
    return (
        <Create {...props}>
            <TabbedForm>
                <FormTab label="resources.customers.tabs.identity">
                    <TextInput
                        autoFocus
                        source="first_name"
                        formClassName={classes.first_name}
                    />
                    <TextInput
                        source="last_name"
                        formClassName={classes.last_name}
                    />
                    <TextInput
                        type="email"
                        source="email"
                        validation={{ email: true }}
                        fullWidth={true}
                        formClassName={classes.email}
                    />
                    <DateInput source="birthday" />
                </FormTab>
                <FormTab
                    label="resources.customers.tabs.address"
                    path="address"
                >
                    <TextInput
                        source="address"
                        formClassName={classes.address}
                        multiline={true}
                        fullWidth={true}
                    />
                    <TextInput
                        source="zipcode"
                        formClassName={classes.zipcode}
                    />
                    <TextInput source="city" formClassName={classes.city} />
                </FormTab>
            </TabbedForm>
        </Create>
    );
};

export default VisitorCreate;
