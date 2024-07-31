import { ListItem, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type ActivityLogContactNoteCreatedProps = {
    header: ReactNode;
    text: string;
};

export function ActivityLogNote({
    header,
    text,
}: ActivityLogContactNoteCreatedProps) {
    const paragraphs = text.split('\n');

    return (
        <ListItem disableGutters>
            <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    width="100%"
                >
                    {header}
                </Stack>
                <div>
                    <Typography
                        variant="body2"
                        sx={{
                            display: '-webkit-box',
                            '-webkit-line-clamp': '3',
                            '-webkit-box-orient': 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {paragraphs.map((paragraph: string, index: number) => (
                            <>
                                {paragraph}
                                {index < paragraphs.length - 1 && <br />}
                            </>
                        ))}
                    </Typography>
                </div>
            </Stack>
        </ListItem>
    );
}
