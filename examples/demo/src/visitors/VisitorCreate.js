import React from 'react';
import { Create, DateInput, FormTab, LongTextInput, TabbedForm, TextInput } from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

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

const VisitorCreate = ({ classes, ...props }) => (
    <Create {...props}>
        <TabbedForm>
            <FormTab label="resources.customers.tabs.identity">
                <TextInput autoFocus source="first_name" formClassName={classes.first_name} />
                <TextInput source="last_name" formClassName={classes.last_name} />
                <TextInput
                    type="email"
                    source="email"
                    validation={{ email: true }}
                    fullWidth={true}
                    formClassName={classes.email}
                />
                <DateInput source="birthday" />
            </FormTab>
            <FormTab label="resources.customers.tabs.address" path="address">
                <LongTextInput source="address" formClassName={classes.address} />
                <TextInput source="zipcode" formClassName={classes.zipcode} />
                <TextInput source="city" formClassName={classes.city} />
            </FormTab>
        </TabbedForm>
    </Create>
);

export default withStyles(styles)(VisitorCreate);
