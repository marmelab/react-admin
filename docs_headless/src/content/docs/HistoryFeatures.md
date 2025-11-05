---
title: History Setup
---

`@react-admin/ra-core-ee` contains hooks and components to help you track the changes made in your admin. See the history of revisions, compare differences between any two versions, and revert to a previous state if needed.

## Installation

The history features require a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription. Once subscribed, follow the [instructions to get access to the private npm repository](https://react-admin-ee.marmelab.com/setup).

You can then install the npm package providing the history features using your favorite package manager:

```sh
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Data Provider Requirements

`ra-core-ee` relies on the `dataProvider` to read, create and delete revisions. In order to use the history features, you must add 3 new methods to your data provider: `getRevisions`, `addRevision` and `deleteRevisions`.

```tsx
const dataProviderWithRevisions = {
    ...dataProvider,
    getRevisions: async (resource, params) => {
        const { recordId } = params;
        // ...
        return { data: revisions };
    },
    addRevision: async (resource, params) => {
        const { recordId, data, authorId, message, description } = params;
        // ...
        return { data: revision };
    },
    deleteRevisions: async resource => {
        const { recordId } = params;
        // ...
        return { data: deletedRevisionIds };
    },
};
```

**Tip**: Revisions are immutable, so you don't need to implement an `updateRevision` method.

A `revision` is an object with the following properties:

```js
{
    id: 123, // the revision id
    resource: 'products', // the resource name
    recordId: 456, // the id of the record
    data: {
        id: 456,
        title: 'Lorem ipsum',
        teaser: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    }, // the data of the record
    // metadata
    authorId: 789, // the id of the author
    date: '2021-10-01T00:00:00.000Z', // the date of the revision
    message: 'Updated title, teaser, body', // the commit message
    description: 'Added a teaser', // the commit description
}
```

You can read an example data provider implementation in the package source at `src/history/dataProvider/builder/addRevisionMethodsBasedOnSingleResource.ts`.

Instead of implementing these new methods yourself, you can use one of the provided builders to generate them:

- `addRevisionMethodsBasedOnSingleResource` stores the revisions for all resources in a single `revisions` resource:

```tsx
// in src/dataProvider.ts
import { addRevisionMethodsBasedOnSingleResource } from '@react-admin/ra-core-ee';
import baseDataProvider from './baseDataProvider';

export const dataProvider = addRevisionMethodsBasedOnSingleResource(
    baseDataProvider,
    { resourceName: 'revisions' }
);
```

- `addRevisionMethodsBasedOnRelatedResource` stores the revisions of each resource in a related resource (e.g. store the revisions of `products` in `products_history`):

```tsx
// in src/dataProvider.ts
import { addRevisionMethodsBasedOnRelatedResource } from '@react-admin/ra-core-ee';
import baseDataProvider from './baseDataProvider';

export const dataProvider = addRevisionMethodsBasedOnRelatedResource(
    baseDataProvider,
    { getRevisionResourceName: resource => `${resource}_history` }
);
```

Once your provider has the three revisions methods, pass it to the `<CoreAdmin>` component and you're ready to start using the history features of `ra-core-ee`.

```tsx
// in src/App.tsx
import { CoreAdmin } from 'ra-core';
import { dataProvider } from './dataProvider';

const App = () => (
    <CoreAdmin dataProvider={dataProvider}>{/* ... */}</CoreAdmin>
);
```
