import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MouseEvent, useCallback, useState } from 'react';
import { useGetIdentity } from 'react-admin';
import { TransferAdminRoleModal } from './TransferAdminRoleModal';

export function TransferAdminRole() {
    const { identity } = useGetIdentity();
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setShowModal(true);
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    if (!identity) {
        return null;
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="h5">
                            Transfer Administrator Role
                        </Typography>

                        <Typography component="p" variant="body2">
                            You are an administrator. Only administrators can
                            manage access for users.
                        </Typography>

                        <Typography component="p" variant="body2">
                            You can{' '}
                            <Link
                                onClick={handleShowModal}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                transfer the administrator role
                            </Link>{' '}
                            to another user. By transferring the administrator
                            role, you will no longer be able to manage access
                            for other users.
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>

            <TransferAdminRoleModal
                open={showModal}
                onClose={handleCloseModal}
            />
        </>
    );
}
