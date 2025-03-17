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

export const NoTranslationWithChildren = () => (
    <TestTranslationProvider messages={{}}>
        <Translate i18nKey="custom.myKey">My Key</Translate>
    </TestTranslationProvider>
);

export const NoTranslationWithEmpty = () => (
    <TestTranslationProvider messages={{}}>
        <Translate i18nKey="custom.myKey" empty="translation failed" />
    </TestTranslationProvider>
);

export const NoTranslationWithEmptyAsFalse = () => (
    <TestTranslationProvider messages={{}}>
        <Translate i18nKey="custom.myKey" empty={false} />
    </TestTranslationProvider>
);

export const Args = () => (
    <TestTranslationProvider
        messages={{
            custom: {
                myKey: ({ price }) => `It cost ${price}.00 $`,
            },
        }}
    >
        <Translate i18nKey="custom.myKey" args={{ price: '6' }} />
    </TestTranslationProvider>
);

export const Component = () => (
    <TestTranslationProvider
        messages={{
            custom: {
                myKey: 'My Translated Key',
            },
        }}
    >
        <Translate i18nKey="custom.myKey" component="mark" />
    </TestTranslationProvider>
);
