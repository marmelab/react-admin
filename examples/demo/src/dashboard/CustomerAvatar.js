import React from 'react';
import { Query, GET_ONE } from 'react-admin';

import Avatar from '@material-ui/core/Avatar';

const CustomerAvatar = ({ record, classes }) => {
    if (!record.customer_id) {
        return <Avatar />;
    }

    return (
        <Query type={GET_ONE} resource="customers" payload={{ id: record.customer_id }}>
            {({ data }) => <Avatar src={data ? `${data.avatar}?size=32x32` : null} className={classes.avatar} />}
        </Query>
    );
};

export default CustomerAvatar;
