import React from 'react';
import { Route } from 'react-router-dom';
import Configuration from './configuration/Configuration';
import Segments from './segments/Segments';

export default [
    <Route exact path="/configuration" render={() => <Configuration />} />,
    <Route exact path="/segments" render={() => <Segments />} />,
];
