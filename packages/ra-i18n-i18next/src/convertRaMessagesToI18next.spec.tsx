import { convertRaMessagesToI18next } from './convertRaMessagesToI18next';

describe('i18next i18nProvider', () => {
    describe('convertRaMessagesToI18next', () => {
        test('should convert react-admin default messages to i18next format', () => {
            expect(
                convertRaMessagesToI18next(
                    {
                        simple: 'simple',
                        interpolation: 'interpolation %{variable}',
                        pluralization: 'singular |||| plural',
                        nested: {
                            deep: {
                                simple: 'simple',
                                interpolation: 'interpolation %{variable}',
                                pluralization: 'singular |||| plural',
                            },
                        },
                    },
                    {}
                )
            ).toEqual({
                simple: 'simple',
                interpolation: 'interpolation {{variable}}',
                pluralization_one: 'singular',
                pluralization_other: 'plural',
                nested: {
                    deep: {
                        simple: 'simple',
                        interpolation: 'interpolation {{variable}}',
                        pluralization_one: 'singular',
                        pluralization_other: 'plural',
                    },
                },
            });
        });

        test('should convert react-admin default messages to i18next format with custom prefix/suffix', () => {
            expect(
                convertRaMessagesToI18next(
                    {
                        simple: 'simple',
                        interpolation: 'interpolation %{variable}',
                        pluralization: 'singular |||| plural',
                        nested: {
                            deep: {
                                simple: 'simple',
                                interpolation: 'interpolation %{variable}',
                                pluralization: 'singular |||| plural',
                            },
                        },
                    },
                    {
                        prefix: '#{',
                        suffix: '}#',
                    }
                )
            ).toEqual({
                simple: 'simple',
                interpolation: 'interpolation #{variable}#',
                pluralization_one: 'singular',
                pluralization_other: 'plural',
                nested: {
                    deep: {
                        simple: 'simple',
                        interpolation: 'interpolation #{variable}#',
                        pluralization_one: 'singular',
                        pluralization_other: 'plural',
                    },
                },
            });
        });
    });
});
