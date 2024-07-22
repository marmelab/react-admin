import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Skeleton from '@mui/material/Skeleton';
import { default as MuiTextField } from '@mui/material/TextField';
import { useState } from 'react';
import {
    useDataProvider,
    useGetIdentity,
    useGetList,
    useRefresh,
} from 'react-admin';
import { useNavigate } from 'react-router';
import { USER_STORAGE_KEY } from '../authProvider';
import { CustomDataProvider } from '../dataProvider';
import { Sale } from '../types';
type TransferAdminRoleModalProps = {
    open: boolean;
    onClose(): void;
};

export function TransferAdminRoleModal({
    open,
    onClose,
}: TransferAdminRoleModalProps) {
    const { identity } = useGetIdentity();
    const dataProvider = useDataProvider<CustomDataProvider>();
    const refresh = useRefresh();
    const navigate = useNavigate();
    const {
        data: sales,
        error,
        isPending,
    } = useGetList('sales', {
        filter: { administrator: false },
        pagination: {
            page: 1,
            perPage: 1000,
        },
        sort: { field: 'first_name', order: 'ASC' },
    });
    const [to, setTo] = useState<Sale | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTransfer = () => {
        if (!identity || !to) {
            return;
        }

        setLoading(true);
        void dataProvider
            .transferAdministrator(identity.id, to.id)
            .then(updatedUser => {
                localStorage.setItem(
                    USER_STORAGE_KEY,
                    JSON.stringify(updatedUser?.data)
                );
            })
            .finally(() => {
                onClose();
                setLoading(false);
                navigate('/');
                refresh();
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Transfer Administrator Role</DialogTitle>
            <DialogContent>
                {isPending && <Skeleton />}
                {error && (
                    <Alert severity="error">
                        Failed to fetch account managers
                    </Alert>
                )}
                {sales && (
                    <Autocomplete<Sale>
                        options={sales}
                        getOptionLabel={sale =>
                            `${sale.first_name} ${sale.last_name}`
                        }
                        getOptionKey={sale => `${sale.id}`}
                        renderInput={params => (
                            <MuiTextField
                                {...params}
                                label="Account Manager"
                                required
                            />
                        )}
                        value={to}
                        onChange={(event, newValue) => setTo(newValue)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleTransfer}
                    disabled={!!error || isPending || loading}
                >
                    {loading ? <CircularProgress size={16} /> : 'Transfer Role'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
