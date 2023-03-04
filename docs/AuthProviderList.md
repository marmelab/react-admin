---
layout: default
title: "Supported Auth Provider Backends"
---

# Supported Auth Provider Backends

It's very common that your auth logic is so specific that you'll need to write your own `authProvider`. However, the community has built a few open-source Auth Providers that may fit your need:

- **[Auth0](https://auth0.com/)**: [ra-auth-auth0](https://github.com/marmelab/ra-auth-auth0)
- **[AWS Amplify](https://docs.amplify.aws)**: [MrHertal/react-admin-amplify](https://github.com/MrHertal/react-admin-amplify)
- **[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/setting-up-the-javascript-sdk.html)**: [ra-auth-cognito](https://github.com/marmelab/ra-auth-cognito)
- **[Firebase Auth (Google, Facebook, GitHub, etc.)](https://firebase.google.com/docs/auth/web/firebaseui)**: [benwinding/react-admin-firebase](https://github.com/benwinding/react-admin-firebase#auth-provider)
- **[Supabase](https://supabase.io/)**: [marmelab/ra-supabase](https://github.com/marmelab/ra-supabase)
- **[Keycloak](https://www.keycloak.org/)**: [marmelab/ra-keycloak](https://github.com/marmelab/ra-keycloak)
- **[Azure Active Directory (using MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)**: [marmelab/ra-auth-msal](https://github.com/marmelab/ra-auth-msal)

Beyond ready-to-use providers, you may find help in these third-party tutorials about integrating more authentication backends:

- **[Loopback](https://loopback.io/doc/en/lb4/Authentication-overview.html)**: [appsmith dev.to tutorial](https://dev.to/appsmith/building-an-admin-dashboard-with-react-admin-86i#adding-authentication-to-reactadmin)
- **[OpenID Connect (OIDC)](https://openid.net/connect/)**: [marmelab/ra-example-oauth](https://github.com/marmelab/ra-example-oauth)

If you have released a reusable `authProvider`, or a tutorial for another auth backend, please open a PR to add it to this list!
