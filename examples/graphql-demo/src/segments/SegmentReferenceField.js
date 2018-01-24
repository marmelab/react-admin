import React from 'react';
import { translate, ReferenceArrayField, SingleFieldList } from 'react-admin';

import Chip from 'material-ui/Chip';

const NameField = translate(({ translate: t, source, record = {} }) => (
    <Chip label={t(record[source])} />
));

const SegmentReferenceField = props => (
    <ReferenceArrayField source="groups" reference="Segment" {...props}>
        <SingleFieldList>
            <NameField source="name" />
        </SingleFieldList>
    </ReferenceArrayField>
);

SegmentReferenceField.defaultProps = {
    label: 'resources.Customer.fields.groups',
    source: 'groups',
    addLabel: true,
};

export default SegmentReferenceField;
