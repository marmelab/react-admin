import React from 'react';
import { IndexRoute, Route } from 'react-router';

export default ({path, list, show}) => {
    return (
        <Route path={path}>
            {list ? <IndexRoute component={list} /> : null}
            {show ? <Route path=":id" component={show} /> : null}
        </Route>
    );
}
