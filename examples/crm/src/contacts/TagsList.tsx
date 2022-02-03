import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    ReferenceArrayField,
    SingleFieldList,
    ChipField,
    useRecordContext,
} from 'react-admin';

const PREFIX = 'TagsList';

const StyledReferenceArrayField = styled(ReferenceArrayField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    display: 'inline-block',
});

const ColoredChipField = (props: any) => {
    const record = useRecordContext();
    if (!record) {
        return null;
    }
    return (
        <ChipField
            record={record}
            {...props}
            style={{ backgroundColor: record.color, border: 0 }}
            component="span"
        />
    );
};

export const TagsList = () => (
    <StyledReferenceArrayField
        resource="contacts"
        source="tags"
        reference="tags"
    >
        <SingleFieldList linkType={false} component="span">
            <ColoredChipField source="name" variant="outlined" size="small" />
        </SingleFieldList>
    </StyledReferenceArrayField>
);
