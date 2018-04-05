import { selectLocale, selectMessages } from './selectors';

describe('selectLocale', () => {
  it('should select the locale state', () => {
    const localeState = 'fr';
    const mockedState = {
      i18n: {
        locale: localeState,
      },
    };
    expect(selectLocale(mockedState)).toEqual(localeState);
  });
  it('should select the messages state', () => {
    const messages = {};
    const mockedState = {
      i18n: {
        messages,
      },
    };
    expect(selectMessages(mockedState)).toEqual(messages);
  });
});
