export type I18nProvider = (locale: string) => object;
export type Translate = (id: string, options?: any) => string;

export interface ReduxState {
    i18n: {
        locale: string;
        messages: object;
    };
}
