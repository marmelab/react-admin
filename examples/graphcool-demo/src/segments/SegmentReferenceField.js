import React from 'react';
import { translate, ReferenceArrayField, SingleFieldList } from 'react-admin';

import Chip from '@material-ui/core/Chip';

const NameField = translate(({ translate: t, source, record = {} }) => (
    <Chip label={t(`resources.Segment.data.${record[source]}`)} />
));

const SegmentReferenceField = props => (
    <ReferenceArrayField source="groupsIds" reference="Segment" {...props}>
        <SingleFieldList>
            <NameField source="name" />
        </SingleFieldList>
    </ReferenceArrayField>
);

SegmentReferenceField.defaultProps = {
    label: 'resources.Customer.fields.groups',
    source: 'groupsIds',
    addLabel: true,
};

export default SegmentReferenceField;
