# ra-keycloak

An auth provider for [react-admin](https://github.com/marmelab/react-admin) which handles authentication via a [Keycloak](https://www.keycloak.org/guides) server.

This package provides:
-  A `useKeycloakAuthProvider` hook, which can be used to build an auth provider for react-admin.
- `httpClient` which adds headers needed by Keycloak in all requests.

This package uses [keycloak-js](https://www.npmjs.com/package/keycloak-js) to handle the Keycloak authentication. And it uses [@react-keycloak/[web](https://github.com/react-keycloak/react-keycloak/blob/master/packages/web/README.md), which is a wrapper around the `keycloak-js` library, which provides a `keycloakAuthProvider`.

## Installation

```sh
yarn add ra-keycloak
# or
npm install ra-keycloak
```

## Usage

```jsx
// in src/App.js
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak, { KeycloakConfig, KeycloakTokenParsed } from "keycloak-js";
import { useKeycloakAuthProvider, httpClient } from 'ra-keycloak';
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
 
const config: KeycloakConfig = {
    url: "$KEYCLOAK_URL",
    realm: "$KEYCLOAK_REALM",
    clientId: "$KEYCLOAK_CLIENT_ID",
};
 
const keycloak = Keycloak(config);

const initOptions = { onLoad: "login-required" };

const dataProvider = simpleRestProvider(
    "$API_URL",
    httpClient(keycloak)
);
 
const getPermissions = (decoded: KeycloakTokenParsed): boolean => {
    if (!decoded.resource_access) {
        return false;
    }
    const admin = decoded.resource_access["$KEYCLOAK_CLIENT_ID"].roles.find(
        (role) => role === "admin"
    );
    return !!admin;
};
 
const KeycloakAdmin = () => {
    const authProvider = useKeycloakAuthProvider(getPermissions);
    return (
        <Admin
            authProvider={authProvider}
            loginPage={false}
            dataProvider={dataProvider}
        >
        <Resource ... />
        </Admin>
    );
};
 
const App = () => (
    <ReactKeycloakProvider
        authClient={keycloak}
        LoadingComponent={<div />}
        initOptions={initOptions}
    >
        <KeycloakAdmin />
    </ReactKeycloakProvider>
);
export default App;
```


## License

This data provider is licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).