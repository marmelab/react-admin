import * as React from 'react';
import { Route } from 'react-router-dom';
import { CustomRoute } from '../types';

/**
 * Custom route with no layout, to be used in the <Admin customRoutes> array.
 *
 * @example
 * // in src/customRoutes.js
 * import * as React from "react";
 * import { Route } from 'react-router-dom';
 * import { RouteWithoutLayout } from 'react-admin';
 * import Foo from './Foo';
 * import Register from './Register';
 *
 * export default [
 *     <Route exact path="/foo" component={Foo} />,
 *     <RouteWithoutLayout exact path="/register" component={Register} />,
 * ];
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin } from 'react-admin';
 *
 * import customRoutes from './customRoutes';
 *
 * const App = () => (
 *     <Admin customRoutes={customRoutes} dataProvider={simpleRestProvider('http://path.to.my.api')}>
 *         ...
 *     </Admin>
 * );
 *
 * export default App;
 */
export const RouteWithoutLayout = ({ noLayout, ...props }) => (
    <Route<CustomRoute> {...props} />
);

RouteWithoutLayout.defaultProps = {
    noLayout: true,
};
