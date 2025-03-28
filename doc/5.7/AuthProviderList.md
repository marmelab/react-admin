---
layout: default
title: "Supported Auth Provider Backends"
---

# Supported Auth Provider Backends

It's very common that your auth logic is so specific that you'll need to write your own `authProvider`. However, the community has built a few open-source Auth Providers that may fit your need:

<div class="providers-list" markdown="1">
- ![auth0 Logo](./img/backend-logos/auth0.svg "auth0 Logo")**[Auth0 by Okta](https://auth0.com/)**: [marmelab/ra-auth-auth0](https://github.com/marmelab/ra-auth-auth0/blob/main/packages/ra-auth-auth0/Readme.md)
- ![amplify Logo](./img/backend-logos/amplify.svg "amplify Logo")**[AWS Amplify](https://docs.amplify.aws)**: [MrHertal/react-admin-amplify](https://github.com/MrHertal/react-admin-amplify)
- ![cognito Logo](./img/backend-logos/aws.png "cognito Logo")**[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/setting-up-the-javascript-sdk.html)**: [marmelab/ra-auth-cognito](https://github.com/marmelab/ra-auth-cognito/blob/main/packages/ra-auth-cognito/Readme.md)
- ![azure Logo](./img/backend-logos/microsoft.svg "azure Logo")**[Microsoft Entra ID (using MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)**: [marmelab/ra-auth-msal](https://github.com/marmelab/ra-auth-msal/blob/main/packages/ra-auth-msal/Readme.md) ([Tutorial](https://marmelab.com/blog/2023/09/13/active-directory-integration-tutorial.html))
- ![casdoor Logo](./img/backend-logos/casdoor.svg "casdoor Logo")**[Casdoor](https://casdoor.com/)**: [NMB-Lab/reactadmin-casdoor-authprovider](https://github.com/NMB-Lab/reactadmin-casdoor-authprovider)
- ![directus Logo](./img/backend-logos/directus.svg "directus Logo")**[Directus](https://directus.io/)**: [marmelab/ra-directus](https://github.com/marmelab/ra-directus/blob/main/packages/ra-directus/Readme.md)
- ![firebase Logo](./img/backend-logos/firebase.png "firebase Logo")**[Firebase Auth (Google, Facebook, GitHub, etc.)](https://firebase.google.com/docs/auth/web/firebaseui)**: [benwinding/react-admin-firebase](https://github.com/benwinding/react-admin-firebase#auth-provider)
- ![google Logo](./img/backend-logos/google.svg "google Logo")**[Google Identity & Google Workspace](https://developers.google.com/identity/gsi/web/guides/overview)**: [marmelab/ra-auth-google](https://github.com/marmelab/ra-auth-google/blob/main/packages/ra-auth-google/Readme.md)
- ![keycloak Logo](./img/backend-logos/keycloak.svg "keycloak Logo")**[Keycloak](https://www.keycloak.org/)**: [marmelab/ra-keycloak](https://github.com/marmelab/ra-keycloak/blob/main/packages/ra-keycloak/Readme.md)
- ![supabase Logo](./img/backend-logos/supabase.svg "supabase Logo")**[Supabase](https://supabase.io/)**: [marmelab/ra-supabase](https://github.com/marmelab/ra-supabase/blob/main/packages/ra-supabase/README.md)
- ![surrealdb Logo](./img/backend-logos/surrealdb.svg "surrealdb Logo")**[SurrealDB](https://surrealdb.com/)**: [djedi23/ra-surrealdb](https://github.com/djedi23/ra-surrealdb)
</div>

Beyond ready-to-use providers, you may find help in these third-party tutorials about integrating more authentication backends:

<div class="providers-list" markdown="1">
- ![loopback Logo](./img/backend-logos/loopback4.svg "loopback Logo")**[Loopback](https://loopback.io/doc/en/lb4/Authentication-overview.html)**: [appsmith dev.to tutorial](https://dev.to/appsmith/building-an-admin-dashboard-with-react-admin-86i#adding-authentication-to-reactadmin)
- ![openid Logo](./img/backend-logos/openid.svg "openid Logo")**[OpenID Connect (OIDC)](https://openid.net/connect/)**: [marmelab/ra-example-oauth](https://github.com/marmelab/ra-example-oauth)
</div>

If you have released a reusable `authProvider`, or a tutorial for another auth backend, please open a PR to add it to this list!
