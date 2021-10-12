import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReferenceArrayField, SingleFieldList, ChipField } from 'react-admin';

import { Contact } from '../types';

const PREFIX = 'TagsList';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledReferenceArrayField = styled(ReferenceArrayField)({
    [`&.${classes.root}`]: {
        display: 'inline-block',
    },
});

const ColoredChipField = ({ record, ...props }: any) =>
    record ? (
        <ChipField
            record={record}
            {...props}
            style={{ backgroundColor: record.color, border: 0 }}
            component="span"
        />
    ) : null;

export const TagsList = ({ record }: { record: Contact }) => {
    if (!record) return null;
    return (
        <StyledReferenceArrayField
            record={record}
            basePath="/contacts"
            resource="contacts"
            source="tags"
            reference="tags"
            className={classes.root}
        >
            <SingleFieldList linkType={false} component="span">
                <ColoredChipField
                    source="name"
                    variant="outlined"
                    size="small"
                />
            </SingleFieldList>
        </StyledReferenceArrayField>
    );
};
