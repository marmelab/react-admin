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
farfetched('/comments', { response: JSON.stringify([{ id: 1, name: 'foo' }, { id: 2, name: 'bar'}]) });
farfetched('/comments?sort=name', { response: JSON.stringify([{ id: 2, name: 'bar'}, { id: 1, name: 'foo' }]) });

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
