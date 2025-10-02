import * as React from 'react';
import { useState } from 'react';
import {
    type SimpleFormIteratorDisableRemoveFunction,
    useEvent,
    useSimpleFormIterator,
    useTranslate,
} from 'ra-core';
import { Confirm } from '../../layout/Confirm';
import { ClearArrayButton } from './ClearArrayButton';

export const SimpleFormIteratorClearButton = ({
    className,
    disableClear,
    disableRemove,
}: SimpleFormIteratorClearButtonProps) => {
    const translate = useTranslate();
    const [confirmIsOpen, setConfirmIsOpen] = useState<boolean>(false);
    const { clear, total } = useSimpleFormIterator();

    const handleArrayClear = useEvent(() => {
        clear();
        setConfirmIsOpen(false);
    });

    if (total === 0 || disableClear === true || disableRemove === true) {
        return null;
    }

    return (
        <>
            <Confirm
                isOpen={confirmIsOpen}
                title={translate('ra.action.clear_array_input')}
                content={translate('ra.message.clear_array_input')}
                onConfirm={handleArrayClear}
                onClose={() => setConfirmIsOpen(false)}
            />
            <ClearArrayButton
                className={className}
                onClick={() => setConfirmIsOpen(true)}
            />
        </>
    );
};

export interface SimpleFormIteratorClearButtonProps {
    className?: string;
    disableClear?: boolean;
    disableRemove?: boolean | SimpleFormIteratorDisableRemoveFunction;
}
