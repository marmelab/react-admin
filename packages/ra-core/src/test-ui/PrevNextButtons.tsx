import * as React from 'react';
import { LinkBase } from '../routing';
import type { RaRecord } from '../types';
import { useTranslate } from '../i18n/useTranslate';
import {
    usePrevNextController,
    type UsePrevNextControllerProps,
} from '../controller/usePrevNextController';

export const PrevNextButtons = <RecordType extends RaRecord = any>(
    props: PrevNextButtonProps<RecordType>
) => {
    const {
        hasPrev,
        hasNext,
        prevPath,
        nextPath,
        index,
        total,
        error,
        isPending,
    } = usePrevNextController<RecordType>(props);

    const translate = useTranslate();

    if (isPending) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>{error.message}</p>;
    }
    if (!hasPrev && !hasNext) {
        return null;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasPrev && prevPath ? (
                <LinkBase to={prevPath}>
                    {translate('ra.navigation.previous')}
                </LinkBase>
            ) : (
                <span style={{ opacity: 0.5 }}>
                    {translate('ra.navigation.previous')}
                </span>
            )}

            {typeof index === 'number' && (
                <span>
                    {index + 1} / {total}
                </span>
            )}

            {hasNext && nextPath ? (
                <LinkBase to={nextPath}>
                    {translate('ra.navigation.next')}
                </LinkBase>
            ) : (
                <span style={{ opacity: 0.5 }}>
                    {translate('ra.navigation.next')}
                </span>
            )}
        </div>
    );
};

export interface PrevNextButtonProps<RecordType extends RaRecord = any>
    extends UsePrevNextControllerProps<RecordType> {}
