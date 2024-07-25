import { Collapse, Link, Stack, Typography } from '@mui/material';
import {
    DateTimeInput,
    FileField,
    FileInput,
    SelectInput,
    TextInput,
} from 'react-admin';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { useState } from 'react';
import { getCurrentDate } from './note';
import { Status } from '../misc/Status';

export const NoteInputs = ({
    showStatus,
    edition,
}: {
    showStatus?: boolean;
    edition?: boolean;
}) => {
    const { noteStatuses } = useConfigurationContext();
    const [displayMore, setDisplayMore] = useState(false);
    return (
        <>
            <TextInput
                source="text"
                label={edition ? 'Edit note' : 'Add a note'}
                variant="filled"
                size="small"
                multiline
                minRows={3}
                helperText={false}
            />
            {!displayMore && (
                <Stack gap={0.5} direction="row">
                    <Link
                        variant="caption"
                        href="#"
                        onClick={e => {
                            setDisplayMore(!displayMore);
                            e.preventDefault();
                        }}
                    >
                        Show options
                    </Link>
                    <Typography variant="caption" color="textSecondary">
                        (attach files, or change details)
                    </Typography>
                </Stack>
            )}
            <Collapse in={displayMore}>
                <Stack gap={1} mt={1}>
                    <Stack direction="row" spacing={2}>
                        {showStatus && (
                            <SelectInput
                                source="status"
                                choices={noteStatuses}
                                optionValue="value"
                                optionText={optionRenderer}
                                isRequired
                                defaultValue={'warm'}
                                helperText={false}
                            />
                        )}
                        <DateTimeInput
                            source="date"
                            label="Date"
                            defaultValue={getCurrentDate()}
                            helperText={false}
                        />
                    </Stack>
                    <FileInput source="attachments" multiple>
                        <FileField source="src" title="title" />
                    </FileInput>
                </Stack>
            </Collapse>
        </>
    );
};

const optionRenderer = (choice: any) => (
    <div>
        {choice.label} <Status status={choice.value} />
    </div>
);
