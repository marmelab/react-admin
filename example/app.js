import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import saga from './sagas';
import App from './components/App';
import farfetched from 'farfetched';


farfetched.attach(window);
farfetched('/comments?_sortField=id&_sortDir=DESC', { response: JSON.stringify([{ id: 3, name: 'zip' }, { id: 2, name: 'bar' }, { id: 1, name: 'foo' }]) });
farfetched('/comments?_sortField=id&_sortDir=ASC', { response: JSON.stringify([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }, { id: 3, name: 'zip' }]) });
farfetched('/comments?_sortField=name&_sortDir=ASC', { response: JSON.stringify([{ id: 2, name: 'bar' }, { id: 1, name: 'foo' }, { id: 3, name: 'zip' }]) });
farfetched('/comments?_sortField=name&_sortDir=DESC', { response: JSON.stringify([{ id: 3, name: 'zip' }, { id: 1, name: 'foo' }, { id: 2, name: 'bar' } ]) });

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
sagaMiddleware.run(saga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
