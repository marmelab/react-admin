import React from 'react';
import { Route } from 'react-router-dom';
import Configuration from './configuration/Configuration';
import Segments from './segments/Segments';

export default [
    <Route
        key="configuration"
        exact
        path="/configuration"
        component={Configuration}
    />,
    <Route key="segments" exact path="/Segment" component={Segments} />,
];
