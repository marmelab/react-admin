---
layout: default
title: "Ecosystem"
---

# Ecosystem

- [Inputs and Fields](#inputs-and-fields)
- [Translations](#translations)
- [Data Providers](#data-providers)
- [Miscellaneous](#miscellaneous)

## Inputs and Fields

- [vascofg/react-admin-color-input](https://github.com/vascofg/react-admin-color-input): a color input using [React Color](http://casesandberg.github.io/react-color/), a collection of color pickers
- [LoicMahieu/aor-tinymce-input](https://github.com/LoicMahieu/aor-tinymce-input): a TinyMCE component, useful for editing HTML
- [vascofg/react-admin-date-inputs](https://github.com/vascofg/react-admin-date-inputs): a collection of Date Inputs, based on [material-ui-pickers](https://material-ui-pickers.firebaseapp.com/)

## Translations

See the [translation](./Translation.md#available-locales) page.

## Authentication Providers

* **[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/setting-up-the-javascript-sdk.html)**: [thedistance/ra-cognito](https://github.com/thedistance/ra-cognito)

## Data Providers

* **[Django Rest Framework](https://www.django-rest-framework.org/)**: [synaptic-cl/ra-data-drf](https://github.com/synaptic-cl/ra-data-drf)
* **[Epilogue](https://github.com/dchester/epilogue)**: [dunghuynh/aor-epilogue-client](https://github.com/dunghuynh/aor-epilogue-client)
* **[Feathersjs](http://www.feathersjs.com/)**: [josx/ra-data-feathers](https://github.com/josx/ra-data-feathers)
* **[Firebase](https://firebase.google.com/docs/database)**: [aymendhaya/ra-data-firebase-client](https://github.com/aymendhaya/ra-data-firebase-client).
* **[Firestore](https://firebase.google.com/docs/firestore)**: [rafalzawadzki/ra-data-firestore-client](https://github.com/rafalzawadzki/ra-data-firestore-client).
* **[GraphCool](http://www.graph.cool/)**: [marmelab/ra-data-graphcool](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphcool) (uses [Apollo](http://www.apollodata.com/))
* **[GraphQL](http://graphql.org/)**: [marmelab/ra-data-graphql](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql) (uses [Apollo](http://www.apollodata.com/))
* **[HAL](http://stateless.co/hal_specification.html)**: [b-social/ra-data-hal](https://github.com/b-social/ra-data-hal)
* **[Hasura](https://github.com/hasura/graphql-engine)**: [hasura/ra-data-hasura](https://github.com/hasura/graphql-engine/tree/master/community/tools/ra-data-hasura)
* **[Hydra](http://www.hydra-cg.com/) / [JSON-LD](https://json-ld.org/)**: [api-platform/admin/hydra](https://github.com/api-platform/admin/blob/master/src/hydra/hydraClient.js)
* **[JSON API](http://jsonapi.org/)**: [henvo/ra-jsonapi-client](https://github.com/henvo/ra-jsonapi-client)
* **[JSON HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08)**: [ra-data-json-hal](https://www.npmjs.com/package/ra-data-json-hal)
* **[JSON server](https://github.com/typicode/json-server)**: [marmelab/ra-data-json-server](https://github.com/marmelab/ra-data-json-server).
* **[Loopback](http://loopback.io/)**: [kimkha/aor-loopback](https://github.com/kimkha/aor-loopback)
* **[NestJS CRUD](https://github.com/nestjsx/crud)**: [FusionWorks/react-admin-nestjsx-crud-dataprovider](https://github.com/FusionWorks/react-admin-nestjsx-crud-dataprovider)
* **[Parse Server](https://github.com/ParsePlatform/parse-server)**: [leperone/aor-parseserver-client](https://github.com/leperone/aor-parseserver-client)
* **[Parse](https://parseplatform.org/)**: [almahdi/ra-data-parse](https://github.com/almahdi/ra-data-parse)
* **[PostgREST](http://postgrest.com/en/v0.4/)**: [tomberek/aor-postgrest-client](https://github.com/tomberek/aor-postgrest-client)
* **[Prisma](https://github.com/weakky/ra-data-prisma)**: [weakky/ra-data-prisma](https://github.com/weakky/ra-data-prisma)
* **[REST-HAPI](https://github.com/JKHeadley/rest-hapi)**: [ra-data-rest-hapi](https://github.com/mkg20001/ra-data-rest-hapi)
* **[Sails.js](https://sailsjs.com/)**: [mpampin/ra-data-json-sails](https://github.com/mpampin/ra-data-json-sails)
* **[Spring Boot](https://spring.io/projects/spring-boot)**: [vishpat/ra-data-springboot-rest](https://github.com/vishpat/ra-data-springboot-rest) 
* **[Strapi](https://strapi.io/)**: [nazirov91/ra-strapi-rest](https://github.com/nazirov91/ra-strapi-rest)
* **[Xmysql](https://github.com/o1lab/xmysql)**: [soaserele/aor-xmysql](https://github.com/soaserele/aor-xmysql)
* Local JSON: [marmelab/ra-data-fakerest](https://github.com/marmelab/ra-data-fakerest)
* Simple REST: [marmelab/ra-data-simple-rest](https://github.com/marmelab/ra-data-simple-rest).

## UI

- [**Bootstrap**](https://getbootstrap.com/): [bootstrap-styled/react-admin](https://bootstrap-styled.github.io/react-admin)

## Miscellaneous

- [marmelab/ra-realtime](https://github.com/marmelab/react-admin/tree/master/packages/ra-realtime): enable realtime updates
- [marmelab/ra-tree-ui-materialui](https://github.com/marmelab/react-admin/blob/master/packages/ra-tree-ui-materialui/): Components to show data represented as a tree. This package is part of our [Labs](/Labs.md) experimentations. This means it misses some features and might not handle all corner cases. Use it at your own risks. Besides, we would really appreciate some feedback!
- [marmelab/ra-tree-core](https://github.com/marmelab/react-admin/blob/master/packages/ra-tree-core/): Components providing the logic but no UI to show data represented as a tree. This package is part of our [Labs](/Labs.md) experimentations. This means it misses some features and might not handle all corner cases. Use it at your own risks. Besides, we would really appreciate some feedback!
- [ra-customizable-datagrid](https://github.com/fizix-io/ra-customizable-datagrid): plugin that allows to hide / show columns dynamically.
- [api-platform/admin](https://api-platform.com/docs/admin): create a fully featured admin using React Admin for API supporting the [Hydra Core Vocabulary](http://www.hydra-cg.com/), including but not limited to APIs created using the [API Platform framework](https://api-platform.com)
- [zifnab87/ra-component-factory](https://github.com/zifnab87/ra-component-factory): centralized configuration of immutability/visibility of fields/menu-links/action buttons, easy re-ordering of fields/properties and tab reorganization based on permission roles
- [ctbucha/bs-react-admin](https://github.com/ctbucha/bs-react-admin): [BuckleScript](https://bucklescript.github.io/) bindings for React Admin.
