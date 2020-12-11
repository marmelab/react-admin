import {
    useState,
    useCallback,
    ReactEventHandler,
    SyntheticEvent,
} from 'react';
import { useDelete } from '../../dataProvider';
import { CRUD_DELETE } from '../../actions';
import {
    useRefresh,
    useNotify,
    useRedirect,
    RedirectionSideEffect,
} from '../../sideEffect';
import { Record } from '../../types';
import { OnFailure, OnSuccess } from '../saveModifiers';
import { useResourceContext } from '../../core';

/**
 * Prepare a set of callbacks for a delete button guarded by confirmation dialog
 *
 * @example
 *
 * const DeleteButton = ({
 *     resource,
 *     record,
 *     basePath,
 *     redirect,
 *     onClick,
 *     ...rest
 * }) => {
 *     const {
 *         open,
 *         loading,
 *         handleDialogOpen,
 *         handleDialogClose,
 *         handleDelete,
 *     } = useDeleteWithConfirmController({
 *         resource,
 *         record,
 *         redirect,
 *         basePath,
 *         onClick,
 *     });
 *
 *     return (
 *         <Fragment>
 *             <Button
 *                 onClick={handleDialogOpen}
 *                 label="ra.action.delete"
 *                 {...rest}
 *             >
 *                 {icon}
 *             </Button>
 *             <Confirm
 *                 isOpen={open}
 *                 loading={loading}
 *                 title="ra.message.delete_title"
 *                 content="ra.message.delete_content"
 *                 translateOptions={{
 *                     name: resource,
 *                     id: record.id,
 *                 }}
 *                 onConfirm={handleDelete}
 *                 onClose={handleDialogClose}
 *             />
 *         </Fragment>
 *     );
 * };
 */
const useDeleteWithConfirmController = (
    props: UseDeleteWithConfirmControllerParams
): UseDeleteWithConfirmControllerReturn => {
    const {
        record,
        redirect: redirectTo,
        basePath,
        onClick,
        onSuccess,
        onFailure,
    } = props;
    const resource = useResourceContext(props);
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const [deleteOne, { loading }] = useDelete(resource, null, null, {
        action: CRUD_DELETE,
        onSuccess: response => {
            setOpen(false);
            if (onSuccess === undefined) {
                notify('ra.notification.deleted', 'info', { smart_count: 1 });
                redirect(redirectTo, basePath);
                refresh();
            } else {
                onSuccess(response);
            }
        },
        onFailure: error => {
            setOpen(false);
            if (onFailure === undefined) {
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning',
                    {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    }
                );
                refresh();
            } else {
                onFailure(error);
            }
        },
        undoable: false,
    });

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        setOpen(false);
        e.stopPropagation();
    };

    const handleDelete = useCallback(
        event => {
            deleteOne({
                payload: { id: record.id, previousData: record },
            });
            if (typeof onClick === 'function') {
                onClick(event);
            }
        },
        [deleteOne, onClick, record]
    );

    return { open, loading, handleDialogOpen, handleDialogClose, handleDelete };
};

export interface UseDeleteWithConfirmControllerParams {
    basePath?: string;
    record?: Record;
    redirect?: RedirectionSideEffect;
    // @deprecated. This hook get the resource from the context
    resource?: string;
    onClick?: ReactEventHandler<any>;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
}

export interface UseDeleteWithConfirmControllerReturn {
    open: boolean;
    loading: boolean;
    handleDialogOpen: (e: SyntheticEvent) => void;
    handleDialogClose: (e: SyntheticEvent) => void;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithConfirmController;
