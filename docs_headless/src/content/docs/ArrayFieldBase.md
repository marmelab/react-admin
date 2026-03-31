---
layout: default
title: "<ArrayFieldBase>"
---

Use `<ArrayFieldBase>` to display an embedded array of objects from the current record.

`<ArrayFieldBase>` reads the array field value from the current [`RecordContext`](./useRecordContext.md), creates a [`ListContext`](./useListContext.md) from it, and renders its children. This component is headless, so its children need to use that list context to render the desired UI.

**Tip**: Use [`<ReferenceArrayFieldBase>`](./ReferenceArrayFieldBase.md) when the array contains foreign keys to another resource. Use `<ArrayFieldBase>` when the array already contains the embedded objects to display.

## Usage

`<ArrayFieldBase>` is ideal for collections of embedded objects, like `tags` and `backlinks` in the following `post` record:

```js
{
    id: 123,
    title: 'Lorem Ipsum Sit Amet',
    tags: [{ name: 'dolor' }, { name: 'sit' }, { name: 'amet' }],
    backlinks: [
        {
            uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
            date: '2012-08-10T00:00:00.000Z',
            url: 'https://example.com/foo/bar.html',
        },
        {
            uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
            date: '2012-08-14T00:00:00.000Z',
            url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
        },
    ],
}
```

You can use `<ArrayFieldBase>` in a show view and render the embedded records with any component reading the list context:

```jsx
import { ArrayFieldBase, RecordsIterator, ShowBase } from 'ra-core';

const PostShow = () => (
    <ShowBase>
        <div>
            <ArrayFieldBase source="tags">
                <ul>
                    <RecordsIterator render={tag => <li>{tag.name}</li>} />
                </ul>
            </ArrayFieldBase>
            <ArrayFieldBase source="backlinks">
                <ul>
                    <RecordsIterator
                        render={backlink => (
                            <li>
                                <a href={backlink.url}>{backlink.url}</a>
                            </li>
                        )}
                    />
                </ul>
            </ArrayFieldBase>
        </div>
    </ShowBase>
);
```

## Props

| Prop       | Required | Type                 | Default | Description                                                                          |
| ---------- | -------- | -------------------- | ------- | ------------------------------------------------------------------------------------ |
| `children` | Required | `ReactNode`         | -       | The UI rendered inside the `ListContext`.                                   |
| `exporter` | Optional | `function \| false` | -       | The exporter function exposed through the list context for export actions.  |
| `filter`   | Optional | `object`            | -       | A permanent filter applied client-side to the embedded array.               |
| `perPage`  | Optional | `number`            | `1000`  | The number of records to display per page.                                  |
| `sort`     | Optional | `{ field, order }`  | -       | The sort applied client-side to the embedded array.                         |

`<ArrayFieldBase>` also accepts the base field props `source`, `record`, and `resource`.

Because it relies on [`useList`](./useList.md), `<ArrayFieldBase>` supports the same local filtering, sorting, pagination, and export behavior as other list-context-based components.

## `children`

`<ArrayFieldBase>` renders its `children` inside a [`ListContext`](./useListContext.md). Common choices are [`<RecordsIterator>`](./RecordsIterator.md), [`<WithListContext>`](./WithListContext.md), or any custom component using `useListContext()`.

```jsx
import { ArrayFieldBase, WithListContext } from 'ra-core';

const BacklinksField = () => (
    <ArrayFieldBase source="backlinks">
        <WithListContext
            render={({ data }) => (
                <ul>
                    {data?.map(backlink => (
                        <li key={backlink.uuid}>{backlink.url}</li>
                    ))}
                </ul>
            )}
        />
    </ArrayFieldBase>
);
```

## `exporter`

If one of the children exposes an export action through the list context, you can customize the export behavior with the `exporter` prop, or disable it entirely by passing `false`.

For instance, you can expose a custom export button for the embedded array:

```jsx
import { ArrayFieldBase, downloadCSV, useListContext } from 'ra-core';
import jsonExport from 'jsonexport/dist';

const exporter = backlinks => {
    const backlinksForExport = backlinks.map(({ uuid, url }) => ({
        uuid,
        url,
    }));
    jsonExport(backlinksForExport, (err, csv) => {
        downloadCSV(csv, 'backlinks');
    });
};

const ExportBacklinksButton = () => {
    const { data, exporter } = useListContext();

    if (!data || data.length === 0 || !exporter) {
        return null;
    }

    return <button onClick={() => exporter(data)}>Export backlinks</button>;
};

const PostBacklinks = () => (
    <ArrayFieldBase source="backlinks" exporter={exporter}>
        <ExportBacklinksButton />
    </ArrayFieldBase>
);
```

## `filter`

By default, `<ArrayFieldBase>` displays all records from the embedded array. Use the `filter` prop to keep only matching items. Filtering happens client-side, after reading the array value from the record.

```jsx
<ArrayFieldBase
    source="backlinks"
    filter={{ date: '2012-08-10T00:00:00.000Z' }}
>
    <WithListContext
        render={({ data }) => (
            <ul>
                {data?.map(backlink => (
                    <li key={backlink.uuid}>{backlink.url}</li>
                ))}
            </ul>
        )}
    />
</ArrayFieldBase>
```

## `perPage`

Because `<ArrayFieldBase>` creates a [`ListContext`](./useListContext.md), you can paginate the embedded array with any pagination UI wired to that context.

## `sort`

By default, `<ArrayFieldBase>` displays items in the order they appear in the array. Use the `sort` prop to apply a client-side sort.

```jsx
<ArrayFieldBase source="tags" sort={{ field: 'name', order: 'ASC' }}>
    <ul>
        <RecordsIterator render={tag => <li>{tag.name}</li>} />
    </ul>
</ArrayFieldBase>
```
