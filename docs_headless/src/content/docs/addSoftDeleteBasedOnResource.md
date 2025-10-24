---
title: "addSoftDeleteBasedOnResource"
---

This helper function wraps an existing [`dataProvider`](./DataProviders.md) to add the soft delete capabilities, storing all deleted records in a single `deleted_records` (configurable) resource.

This feature requires a valid [Enterprise Edition](https://marmelab.com/ra-enterprise/) subscription.

## Installation

```bash
npm install --save @react-admin/ra-core-ee
# or
yarn add @react-admin/ra-core-ee
```

## Usage

```tsx
// in src/dataProvider.ts
import { addSoftDeleteBasedOnResource } from '@react-admin/ra-core-ee';
import baseDataProvider from './baseDataProvider';

export const dataProvider = addSoftDeleteBasedOnResource(
    baseDataProvider,
    { deletedRecordsResourceName: 'deleted_records' }
);
```

