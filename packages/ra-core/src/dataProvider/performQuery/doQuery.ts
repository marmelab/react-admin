import { performOptimisticQuery } from './performOptimisticQuery';
import { performUndoableQuery } from './performUndoableQuery';
import { performPessimisticQuery } from './performPessimisticQuery';
import { answerWithCache } from './answerWithCache';
import { canReplyWithCache } from '../replyWithCache';
import { QueryFunctionParams } from './QueryFunctionParams';
import { MutationMode } from '../../types';

/**
 * Execute a dataProvider call
 *
 * Delegates execution to cache, optimistic, undoable, or pessimistic queries
 *
 * @see useDataProvider
 */
export const doQuery = ({
    type,
    payload,
    resource,
    action,
    rest,
    onSuccess,
    onFailure,
    dataProvider,
    dispatch,
    logoutIfAccessDenied,
    allArguments,
    store,
    mutationMode,
}: DoQueryParameters) => {
    const resourceState = store.getState().admin.resources[resource];
    if (canReplyWithCache(type, payload, resourceState)) {
        return answerWithCache({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            resourceState,
            dispatch,
        });
    } else if (mutationMode === 'optimistic') {
        return performOptimisticQuery({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            onFailure,
            dataProvider,
            dispatch,
            logoutIfAccessDenied,
            allArguments,
        });
    } else if (mutationMode === 'undoable') {
        return performUndoableQuery({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            onFailure,
            dataProvider,
            dispatch,
            logoutIfAccessDenied,
            allArguments,
        });
    } else {
        return performPessimisticQuery({
            type,
            payload,
            resource,
            action,
            rest,
            onSuccess,
            onFailure,
            dataProvider,
            dispatch,
            logoutIfAccessDenied,
            allArguments,
        });
    }
};

interface DoQueryParameters extends QueryFunctionParams {
    store: any; // unfortunately react-redux doesn't expose Store and AnyAction types, so we can't do better
    mutationMode: MutationMode;
}
