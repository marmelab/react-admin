import React from 'react';
import PropTypes from 'prop-types';

/**
 * Render children only when the permissions match.
 * 
 * To be used together with <SwitchPermission>.
 * 
 * The `Permission` component requires either :
 * - a `value` prop with the permissions to check (could be a role, an array of roles, etc), or
 * - a `resolve` function.
 * 
 * An additional `exact` prop may be specified depending on your requirements.
 * It determines whether the user must have **all** the required permissions or only some.
 * If `false`, the default, we'll only check if the user has at least one of the required permissions.
 * 
 * You may bypass the default logic by specifying a function as the `resolve` prop.
 * This function may return `true` or `false` directly, or a promise
 * resolving to either `true` or `false`. It will be called with an object
 * having the following properties:
 * - `permissions`: the result of the `authClient` call.
 * - `value`: the value of the `value` prop if specified
 * - `exact`: the value of the `exact` prop if specified
 * 
 * @example
 *     <Card>
 *         <ViewTitle title="Dashboard" />
 *         <CardContent>
 *             <SwitchPermissions>
 *                 <Permission value="associate">
 *                     <BenefitsSummary />
 *                 </Permission>
 *                 <Permission value="boss">
 *                     <BenefitsDetailsWithSensitiveData />
 *                 </Permission>
 *             </SwitchPermissions>
 *         </CardContent>
 *     </Card>
 */
const Permission = () => (
    <span>
        &lt;Permission&gt; elements are for configuration only and should not be
        rendered
    </span>
);

Permission.propTypes = {
    children: PropTypes.node.isRequired,
    exact: PropTypes.bool,
    value: PropTypes.any,
    resolve: PropTypes.any,
};

export default Permission;
