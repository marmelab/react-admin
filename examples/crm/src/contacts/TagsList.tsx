import * as React from 'react';
import { ReferenceArrayField, SingleFieldList, ChipField } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import { Contact } from '../types';

const ColoredChipField = ({ record, ...props }: any) =>
    record ? (
        <ChipField
            record={record}
            {...props}
            style={{ backgroundColor: record.color, border: 0 }}
            component="span"
        />
    ) : null;

const useStyles = makeStyles({
    root: {
        display: 'inline-block',
    },
});

export const TagsList = ({ record }: { record: Contact }) => {
    const classes = useStyles();
    if (!record) return null;
    return (
        <ReferenceArrayField
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
        </ReferenceArrayField>
    );
};
