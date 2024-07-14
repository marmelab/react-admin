import { LinearProgress, Stack, Typography } from '@mui/material';
import { CreateButton, useGetList } from 'react-admin';
import useAppBarHeight from '../misc/useAppBarHeight';
import { matchPath, useLocation } from 'react-router';
import { DealCreate } from './DealCreate';
import { Contact } from '../types';
import { Link } from 'react-router-dom';

export const DealEmpty = () => {
    const location = useLocation();
    const matchCreate = matchPath('/deals/create', location.pathname);
    const appbarHeight = useAppBarHeight();

    // get Contact data
    const { data: contacts, isPending: contactsLoading } = useGetList<Contact>(
        'contacts',
        {
            pagination: { page: 1, perPage: 1 },
        }
    );

    if (contactsLoading) return <LinearProgress />;

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{
                height: `calc(100dvh - ${appbarHeight}px)`,
            }}
        >
            <img src="./img/empty.svg" alt="No contacts found" />
            {contacts && contacts.length > 0 ? (
                <>
                    <Typography variant="h6" fontWeight="bold">
                        No deals found
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        gutterBottom
                    >
                        It looks like your deal list is empty.
                    </Typography>
                    <Stack spacing={2} direction="row">
                        <CreateButton variant="contained" label="Create deal" />
                    </Stack>
                    <DealCreate open={!!matchCreate} />
                </>
            ) : (
                <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                    gutterBottom
                >
                    It looks like your contacts list is currently empty.
                    <br />
                    Please{' '}
                    <Link to="/contacts/create">
                        add your first contact
                    </Link>{' '}
                    before creating a deal.
                </Typography>
            )}
        </Stack>
    );
};
