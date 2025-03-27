import React from 'react';
import { TestTranslationProvider } from './TestTranslationProvider';
import { Translate } from './Translate';

export default {
    title: 'ra-core/i18n/Translate',
};

export const Basic = () => (
    <TestTranslationProvider
        messages={{
            custom: {
                myKey: 'My Translated Key',
            },
        }}
    >
        <Translate i18nKey="custom.myKey" />
    </TestTranslationProvider>
);

export const NoTranslation = () => (
    <TestTranslationProvider messages={{}}>
        <Translate i18nKey="custom.myKey" />
    </TestTranslationProvider>
);

export const NoTranslationWithChildrenAsString = ({ messages = {} }) => (
    <TestTranslationProvider messages={messages}>
        <Translate i18nKey="custom.myKey">My Default Translation</Translate>
    </TestTranslationProvider>
);

export const NoTranslationWithChildrenAsNode = () => (
    <TestTranslationProvider messages={{}}>
        <Translate i18nKey="custom.myKey">
            <div style={{ color: 'red' }}>
                <i>My Default Translation</i>
            </div>
        </Translate>
    </TestTranslationProvider>
);

export const Options = () => (
    <TestTranslationProvider
        messages={{
            custom: {
                myKey: ({ price }) => `It cost ${price}.00 $`,
            },
        }}
    >
        <Translate i18nKey="custom.myKey" options={{ price: '6' }} />
    </TestTranslationProvider>
);
