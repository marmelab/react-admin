import { UPDATE } from 'react-admin';

export const COMMENT_APPROVE = 'COMMENT_APPROVE';

export const commentApprove = record => ({
    type: COMMENT_APPROVE,
    // These are the parameters received by the data provider. They are specific to the custom end point
    payload: { id: record.id },
    meta: {
        fetch: COMMENT_APPROVE,
        effect: UPDATE,
        // Data used to optimistically update the record
        effectData: { ...record, status: 'approved' },
        resource: 'comments',
        onSuccess: {
            notification: {
                body: 'simple.notification.approved',
                level: 'info',
            },
            refresh: true,
        },
    },
});

export const COMMENT_REJECT = 'COMMENT_REJECT';

export const commentReject = record => ({
    type: COMMENT_REJECT,
    // These are the parameters received by the data provider. They are specific to the custom end point
    payload: { id: record.id },
    meta: {
        fetch: COMMENT_REJECT,
        effect: UPDATE,
        // Data used to optimistically update the record
        effectData: { ...record, status: 'rejected' },
        resource: 'comments',
        onSuccess: {
            notification: {
                body: 'simple.notification.rejected',
                level: 'info',
            },
            refresh: true,
        },
        onFailure: {
            notification: {
                body: 'simple.notification.rejected_error',
                level: 'warning',
            },
        },
    },
});
