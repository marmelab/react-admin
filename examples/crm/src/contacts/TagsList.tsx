import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    ReferenceArrayField,
    SingleFieldList,
    ChipField,
    useRecordContext,
} from 'react-admin';

import { Contact, Company } from '../types';

const PREFIX = 'TagsList';

const classes = {
    root: `${PREFIX}-root`,
};

const StyledReferenceArrayField = styled(ReferenceArrayField)({
    [`&.${classes.root}`]: {
        display: 'inline-block',
    },
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

export const TagsList = (props: { record: Contact }) => {
    const record = useRecordContext<Contact>(props);
    if (!record) return null;

    return (
        <StyledReferenceArrayField
            record={record}
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
