import * as React from 'react';
import { ComponentProps } from 'react';
import { SingleFieldList, useRecordContext } from 'react-admin';
import { ContactFields, Tag, TagFields } from '../types';

type TagChipFieldProps = ComponentProps<typeof TagFields['ChipField']>;

const ColoredChipField = (props: TagChipFieldProps) => {
    const record = useRecordContext<Tag>();
    if (!record) return null;
    return (
        <TagFields.ChipField
            record={record}
            // FIXME For some reason, the ChipField component prop is not inferred
            // @ts-ignore
            component="span"
            {...props}
            style={{ backgroundColor: record.color, border: 0 }}
        />
    );
};

export const TagsList = () => (
    <ContactFields.ReferenceArrayField
        sx={{ display: 'inline-block' }}
        resource="contacts"
        source="tags"
        reference="tags"
    >
        <SingleFieldList linkType={false} component="span">
            <ColoredChipField source="name" variant="outlined" size="small" />
        </SingleFieldList>
    </ContactFields.ReferenceArrayField>
);
