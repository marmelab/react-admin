import React from 'react';
import { Link } from 'react-admin';

import FullNameField from './FullNameField';

const CustomerLinkField = props => (
    <Link to={`/Customer/${props.record.id}`}>
        <FullNameField {...props} />
    </Link>
);

CustomerLinkField.defaultProps = {
    source: 'customer_id',
    addLabel: true,
};

export default CustomerLinkField;
