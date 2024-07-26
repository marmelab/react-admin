import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MouseEventHandler, ReactNode, useState } from 'react';
import { Link } from 'react-admin';

type ActivityLogContactNoteCreatedProps = {
    header: ReactNode;
    text: string;
};

export function ActivityLogNote({
    header,
    text,
}: ActivityLogContactNoteCreatedProps) {
    const [seeMore, setSeeMore] = useState(false);

    const maxDisplayLength = 600;

    const slicedText =
        text.length > maxDisplayLength ? text.slice(0, maxDisplayLength) : null;

    const handleToggleSeeMore: MouseEventHandler = e => {
        e.preventDefault();
        setSeeMore(oldSeeMore => !oldSeeMore);
    };

    return (
        <ListItem>
            <Stack direction="column" spacing={2} sx={{ width: '100%' }}>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {header}
                </Stack>

                <Typography variant="body2">
                    {slicedText && !seeMore ? `${slicedText}...` : text}
                </Typography>

                {slicedText && (
                    <Typography
                        component={Link}
                        to="#"
                        variant="body2"
                        onClick={handleToggleSeeMore}
                    >
                        {seeMore ? 'See less' : 'See more'}
                    </Typography>
                )}
            </Stack>
        </ListItem>
    );
}
