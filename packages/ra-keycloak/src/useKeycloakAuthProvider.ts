import { useKeycloak } from '@react-keycloak/web';
import { KeycloakTokenParsed } from 'keycloak-js';
import { AuthProvider, UserIdentity } from 'react-admin';
import jwt_decode from 'jwt-decode';

export type PermissionsFunction = (decoded: KeycloakTokenParsed) => boolean;

/**
 * An authProvider which handles authentication via the Keycloak server.
 *
 * @example
 * import { ReactKeycloakProvider } from "@react-keycloak/web";
 * import Keycloak, { KeycloakConfig, KeycloakTokenParsed } from "keycloak-js";
 * import { useKeycloakAuthProvider, httpClient } from 'ra-keycloak';
 * import { Admin, Resource } from "react-admin";
 * import simpleRestProvider from "ra-data-simple-rest";
 *
 * const config: KeycloakConfig = {
 *   url: "$KEYCLOAK_URL",
 *   realm: "$KEYCLOAK_REALM",
 *   clientId: "$KEYCLOAK_CLIENT_ID",
 * };
 *
 * const keycloak = Keycloak(config);
 *
 * const initOptions = { onLoad: "login-required" };
 *
 * const dataProvider = simpleRestProvider(
 *   "$API_URL",
 *   httpClient(keycloak)
 * );
 *
 * const getPermissions = (decoded: KeycloakTokenParsed): boolean => {
 *   if (!decoded.resource_access) {
 *     return false;
 *   }
 *   const admin = decoded.resource_access["$KEYCLOAK_CLIENT_ID"].roles.find(
 *     (role) => role === "admin"
 *   );
 *   return !!admin;
 * };
 *
 * const KeycloakAdmin = () => {
 *   const authProvider = useKeycloakAuthProvider(getPermissions);
 *   return (
 *     <Admin
 *       authProvider={authProvider}
 *       loginPage={false}
 *       dataProvider={dataProvider}
 *     >
 *       <Resource ... />
 *     </Admin>
 *   );
 * };
 *
 * const App = () => (
 *   <ReactKeycloakProvider
 *     authClient={keycloak}
 *     LoadingComponent={<div />}
 *     initOptions={initOptions}
 *   >
 *     <KeycloakAdmin />
 *   </ReactKeycloakProvider>
 * );
 *
 * @param {PermissionsFunction} onPermissions the function to decide if the authenticated user has the right to access to a specific resource.
 * @returns {object} the authProvider object used by React-Admin.
 */
const useKeycloakAuthProvider = (
    onPermissions: PermissionsFunction
): AuthProvider => {
    const { keycloak } = useKeycloak();
    return {
        login: () => keycloak.login(),
        checkError: () => Promise.resolve(),
        checkAuth: () => {
            return keycloak.authenticated && keycloak.token
                ? Promise.resolve()
                : Promise.reject('Failed to obtain access token.');
        },
        logout: () => keycloak.logout(),
        getIdentity: (): Promise<UserIdentity> => {
            if (keycloak.token) {
                const decoded = jwt_decode<KeycloakTokenParsed>(keycloak.token);
                const id = decoded.sub || '';
                const fullName = decoded.name;
                return Promise.resolve({ id, fullName });
            }
            return Promise.reject('Failed to get identity.');
        },
        getPermissions: () => {
            if (!keycloak.token) {
                return Promise.resolve(false);
            }
            const decoded = jwt_decode<KeycloakTokenParsed>(keycloak.token);
            return Promise.resolve(onPermissions(decoded));
        },
    };
};

export default useKeycloakAuthProvider;
