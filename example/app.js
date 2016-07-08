import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import saga from './sagas';
import App from '../src/App';
import FakeRest from './FakeRest';
import fetchMock from 'fetch-mock';
import data from './data';
import CrudRoute from '../src/crud/CrudRoute';
import PostList from './components/posts/PostList';
import PostShow from './components/posts/PostShow';

var restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.init(data);
restServer.toggleLogging(); // logging is off by default, enable it
fetchMock.mock('^http://localhost:3000', restServer.getHandler())

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, undefined, compose(
    applyMiddleware(sagaMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
));
sagaMiddleware.run(saga);

const history = syncHistoryWithStore(hashHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={App}>
            <CrudRoute path="posts" endpoint="http://localhost:3000/posts" list={PostList} show={PostShow} />
        </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
