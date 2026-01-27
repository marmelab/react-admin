import * as React from 'react';
import { Translate } from '../i18n/Translate';

export const Confirm = ({
    isOpen,
    content,
    onClose,
    onConfirm,
    title,
    translateOptions = {},
    titleTranslateOptions = translateOptions,
    contentTranslateOptions = translateOptions,
}: {
    isOpen: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onClose: () => void;
    translateOptions?: Record<string, any>;
    titleTranslateOptions?: Record<string, any>;
    contentTranslateOptions?: Record<string, any>;
}) => {
    return isOpen ? (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '1em',
                }}
            >
                <p>
                    {typeof title === 'string' ? (
                        <Translate
                            i18nKey={title}
                            options={{
                                _: title,
                                ...titleTranslateOptions,
                            }}
                        />
                    ) : (
                        title
                    )}
                </p>
                <p>
                    {typeof content === 'string' ? (
                        <Translate
                            i18nKey={content}
                            options={{
                                _: content,
                                ...contentTranslateOptions,
                            }}
                        />
                    ) : (
                        content
                    )}
                </p>
                <div style={{ display: 'flex', gap: '1em' }}>
                    <button onClick={onConfirm} type="button">
                        <Translate i18nKey="ra.action.confirm">
                            Confirm
                        </Translate>
                    </button>
                    <button onClick={onClose} type="button">
                        <Translate i18nKey="ra.action.cancel">Cancel</Translate>
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};
