// import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import { defineMessages } from 'react-intl';
// import { Provider } from 'react-redux';

import { TranslationProvider } from './TranslationProvider';
// import configureStore from '../../../configureStore';

// import { translationMessages } from '../../../i18n';

const messages = defineMessages({
  someMessage: {
    id: 'some.id',
    defaultMessage: 'This is some default message',
    en: 'This is some en message',
  },
});

describe('<TranslationProvider />', () => {
  it('should render its children', () => {
    const children = <h1>Test</h1>;
    const renderedComponent = shallow(
      <TranslationProvider messages={messages}>{children}</TranslationProvider>
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});

// describe('<ConnectedLanguageProvider />', () => {
//   let store;
//
//   beforeAll(() => {
//     store = configureStore(store);
//   });
//
//   it('should render the default language messages', () => {
//     const renderedComponent = mount(
//       <Provider store={store}>
//         <ConnectedLanguageProvider messages={translationMessages}>
//           <FormattedMessage {...messages.someMessage} />
//         </ConnectedLanguageProvider>
//       </Provider>
//     );
//     expect(renderedComponent.contains(<FormattedMessage {...messages.someMessage} />)).toBe(true);
//   });
// });
