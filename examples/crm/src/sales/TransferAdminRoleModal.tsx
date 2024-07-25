import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Skeleton from '@mui/material/Skeleton';
import { default as MuiTextField } from '@mui/material/TextField';
import { DefaultError, useMutation } from '@tanstack/react-query';
import {
    Toolbar,
    useDataProvider,
    useGetIdentity,
    useGetList,
    usePermissions,
} from 'react-admin';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { USER_STORAGE_KEY } from '../authProvider';
import { CustomDataProvider } from '../dataProvider';
import { Sale } from '../types';
import { DialogCloseButton } from '../misc/DialogCloseButton';

type TransferAdminRoleForm = {
    sale: Sale;
};

type TransferAdminRoleModalProps = {
    open: boolean;
    onClose(): void;
};

export function TransferAdminRoleModal({
    open,
    onClose,
}: TransferAdminRoleModalProps) {
    const { identity } = useGetIdentity();
    const { refetch } = usePermissions();
    const dataProvider = useDataProvider<CustomDataProvider>();
    const navigate = useNavigate();
    const { control, handleSubmit } = useForm<TransferAdminRoleForm>();

    const mutation = useMutation<Sale, DefaultError, Sale>({
        mutationFn: async to => {
            if (!identity) {
                throw new Error('You are not logged in');
            }

            const user = await dataProvider.transferAdministratorRole(
                identity.id,
                to.id
            );
            if (!user) {
                throw new Error('Failed to transfer administrator role');
            }

            return user;
        },
        onSuccess: updatedUser => {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));

            onClose();

            // Since the current user is no longer an administrator once they transfered the role, we need to redirect him to
            // home as he does not have access to the page anymore.
            navigate('/');

            // Since the current user is no longer an administrator once they transfered the role, we need to refresh their
            // identity and permissions.
            refetch();
        },
        onError: () => {},
    });

    const handleTransfer: SubmitHandler<TransferAdminRoleForm> = data => {
        if (!identity || !data.sale) {
            return;
        }

        mutation.mutate(data.sale);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <form onSubmit={handleSubmit(handleTransfer)}>
                <DialogCloseButton onClose={onClose} />
                <DialogTitle>Transfer Administrator Role</DialogTitle>
                <DialogContent>
                    {mutation.error && (
                        <Alert severity="error">
                            Failed to transfer the administrator role
                        </Alert>
                    )}

                    <SalesAutocomplete control={control} />
                </DialogContent>
                <Toolbar>
                    <Button
                        type="submit"
                        color="error"
                        variant="contained"
                        disabled={mutation.isError || mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <CircularProgress size={16} />
                        ) : (
                            'Transfer Role'
                        )}
                    </Button>
                </Toolbar>
            </form>
        </Dialog>
    );
}

function SalesAutocomplete({
    control,
}: Pick<ReturnType<typeof useForm<TransferAdminRoleForm>>, 'control'>) {
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

    if (isPending) {
        return <Skeleton />;
    }

    if (error) {
        return <Alert severity="error">Failed to fetch account managers</Alert>;
    }

    return (
        <Controller
            render={({ field: { onChange, value, ref } }) => (
                <Autocomplete<Sale>
                    ref={ref}
                    value={value ?? null}
                    onChange={(_, newValue) => onChange(newValue)}
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
                    isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                    }
                />
            )}
            control={control}
            name="sale"
        />
    );
}
