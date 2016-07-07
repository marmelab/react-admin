import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import saga from './sagas';
import App from './components/App';
import PostList from './components/PostList';
import FakeRest from './FakeRest';
import fetchMock from 'fetch-mock';
import data from './data';

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

const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={PostList}/>
            <Route path="posts" component={PostList} />
            <Route path="posts/:id" component={PostList} />
        </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
