---
layout: default
title: "Fields For Relationships"
---

# Fields For Relationships

React-admin provides numerous components, called 'Reference' components, to deal with relationships between records. In fact, react-admin and the `dataProvider` interface are actually designed to facilitate the implementation of relational features such as:

- showing the comments related to a post
- showing the author of a post
- choosing the author of a post
- adding tags to a post

React-admin handles relationships *regardless of the capacity of the API to manage relationships*. As long as you can provide a `dataProvider` for your API, all the relational features will work.

React-admin provides helpers to fetch related records, depending on the type of relationship, and how the API implements it.

<iframe src="https://www.youtube-nocookie.com/embed/UeM31-65Wc4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="aspect-ratio: 16 / 9;width:100%;margin-bottom:1em;"></iframe>

## One-To-Many

When one record has many related records, this is called a one-to-many relationship. For instance, if an author has written several books, `authors` has a one-to-many relationship with `books`. 

To fetch the books of an author with react-admin, you can use:

- [`<ReferenceManyField>`](#referencemanyfield) when the API uses a foreign key (e.g. each book has an `author_id` field)
- [`<ReferenceArrayField>`](#referencearrayfield) when the API uses an array of foreign keys (e.g. each author has a `book_ids` field)
- [`<ArrayField>`](#arrayfield) when the API embeds an array of records (e.g. each author has a `books` field)

## Many-To-One

On the other hand, **many-to-one relationships** are the opposite of one-to-many relationships (e.g. each book has one author). To fetch the author of a book, you can use:

- [`<ReferenceField>`](#referencefield) when the API uses a foreign key (e.g. each book has an `author_id` field)
- [Deep Field Source](#deep-field-source), when the API embeds the related record (e.g. each book has an `author` field containing an object)

Other kinds of relationships often reduce to one-to-many relationships. 

## One-To-One

For instance, **one-to-one relationships** (e.g. a book has one `book_detail`) are a special type of one-to-many relationship with a cardinality of 1. To fetch the details of a book, you can use:

- [`<ReferenceOneField>`](#referenceonefield) when the API uses a foreign key (e.g. each `book_detail` has a `book_id` field)
- [`<ReferenceField>`](#referencefield) when the API uses a reverse foreign key (e.g. each `book` has a `book_detail_id` field)
- Deep Field Source, when the API embeds the related record (e.g. each book has a `book_detail` field containing an object)

## Many-To-Many

Also, **many-to-many relationships** are often modeled as two successive one-to-many relationships. For instance, if a book is co-authored by several people, we can model this as a one-to-many relationship between the book and the book_authors, and a one-to-many relationship between the book_authors and the authors. To fetch the books of an author, use:

- [`<ReferenceManyToManyField>`](#referencemanytomanyfield) when the API uses a join table (e.g. a `book_authors` table with both `book_id` and `author_id` fields)
- [`<ReferenceArrayField>`](#referencearrayfield) when the API uses an array of foreign keys (e.g. each author has a `book_ids` field, and each book has an `author_ids` field)
- [`<ArrayField>`](#arrayfield), when the API embeds an array of records (e.g. each author has a `books` field, and each book has an `authors` field)

## Deep Field Source

When a many-to-one relationship (e.g. the author of a book) is materialized by an embedded object, then you don't need a Reference field - you can just use any regular field, and use a compound field name (e.g. "author.first_name").

```
┌──────────────────┐
│ books            │
│------------------│
│ id               │
│ author           │
│  └ first_name    │
│  └ last_name     │
│  └ date_of_birth │
│ title            │
│ published_at     │
└──────────────────┘
```

Here is an example usage:

```jsx
const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <DateField source="published_at" />
            <FunctionField 
                label="Author"
                render={record => `${record.author.first_name} ${record.author.last_name}`}
            />
            <DateField label="Author DOB" source="author.date_of_birth" />
        </SimpleShowLayout>
    </Show>
);
```


## `<ArrayField>`

This field fetches a one-to-many relationship, e.g. the books of an author, when using an array embedded objects.

```
┌───────────────────────────┐
│ author                    │
│---------------------------│
│ id                        │
│ first_name                │
│ last_name                 │
│ date_of_birth             │
│ books                     │
│  └ { title, published_at} │
│  └ { title, published_at} │
│  └ { title, published_at} │
└───────────────────────────┘
```

Here is an example usage:

```jsx
const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ArrayField source="books">
                <Datagrid>
                    <TextField source="title" />
                    <DateField source="published_at" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);
```

`<ArrayField>` creates a `ListContext` with the embedded records, so you can use any component relying on this context (`<Datagrid>`, `<SimpleList>`, etc.).

## `<ReferenceField>`

This field fetches a many-to-one relationship, e.g. the author of a book, when using a foreign key.

```
┌──────────────┐       ┌────────────────┐
│ books        │       │ authors        │
│--------------│       │----------------│
│ id           │   ┌───│ id             │
│ author_id    │╾──┘   │ first_name     │
│ title        │       │ last_name      │
│ published_at │       │ date_of_birth  │
└──────────────┘       └────────────────┘
```

Here is an example usage:

```jsx
const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceField label="Author" source="author_id" reference="authors">
                <FunctionField render={record => record && `${record.first_name} ${record.last_name}`} />
            </ReferenceField>
            <ReferenceField label="Author DOB" source="author_id" reference="authors">
                <DateField source="date_of_birth" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);
```

`<ReferenceField>` uses the current `record` (a book in this example) to read the id of the reference using the foreign key (`author_id`). Then, it uses `dataProvider.getOne('authors', { id })` fetch the related author.

`<ReferenceField>` creates a `RecordContext` with the reference record, so you can use any component relying on this context (`<TextField>`, `<SimpleShowLayout>`, etc.).

**Tip**: You don't need to worry about the fact that these components calls `<ReferenceField>` twice on the same table. React-admin will only make one call to the API.

This is fine, but what if you need to display the author details for a list of books?

```jsx
const BookList = () => (
    <List>
        <Datagrid>
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceField label="Author" source="author_id" reference="authors">
                <FunctionField render={record => `${record.first_name} ${record.last_name}`} />
            </ReferenceField>
            <ReferenceField label="Author DOB" source="author_id" reference="authors">
                <DateField source="date_of_birth" />
            </ReferenceField>
        </Datagrid>
    </List>
);
```

If each row of the book list triggers one call to `dataProvider.getOne('authors', { id })`, and if the list counts many rows (say, 25), the app will be very slow - and possibly blocked by the API for abusive usage. This is another version of the dreaded ["n+1 problem"](https://blog.appsignal.com/2020/06/09/n-plus-one-queries-explained.html).

Fortunately, `<ReferenceField>` aggregates and deduplicates all the renders made in a page, and creates an optimised request. In the example above, instead of n calls to `dataProvider.getOne('authors', { id })`, the book list will make one call to `dataProvider.getMany('authors', { ids })`.

## `<ReferenceManyField>`

This field fetches a one-to-many relationship, e.g. the books of an author, when using a foreign key.

```
┌────────────────┐       ┌──────────────┐
│ authors        │       │ books        │
│----------------│       │--------------│
│ id             │───┐   │ id           │
│ first_name     │   └──╼│ author_id    │
│ last_name      │       │ title        │
│ date_of_birth  │       │ published_at │
└────────────────┘       └──────────────┘
```

Here is an example usage:

```jsx
const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ReferenceManyField reference="books" target="author_id">
                <Datagrid>
                    <TextField source="title" />
                    <DateField source="published_at" />
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);
```

`<ReferenceManyField>` uses the current `record` (an author in this example) to build a filter for the list of books on the foreign key field (`author_id`). Then, it uses `dataProvider.getManyReference('books', { target: 'author_id', id: book.id })` fetch the related books.

`<ReferenceManyField>` creates a `ListContext` with the related records, so you can use any component relying on this context (`<Datagrid>`, `<SimpleList>`, etc.).

**Tip**: For many APIs, there is no difference between `dataProvider.getList()` and `dataProvider.getManyReference()`. The latter is a specialized version of the former, with a predefined `filter`. But some APIs expose related records as a sub-route, and therefore need a special method to fetch them. For instance, the books of an author can be exposed via the following endpoint: 

```
GET /authors/:id/books
```

That's why `<ReferenceManyField>` uses the `getManyReference()` method instead of `getList()`.

## `<ReferenceArrayField>`

This field fetches a one-to-many relationship, e.g. the books of an author, when using an array of foreign keys.

```
┌────────────────┐       ┌──────────────┐
│ authors        │       │ books        │
│----------------│       │--------------│
│ id             │   ┌───│ id           │
│ first_name     │   │   │ title        │
│ last_name      │   │   │ published_at │
│ date_of_birth  │   │   └──────────────┘
│ book_ids       │╾──┘   
└────────────────┘       
```

Here is an example usage:

```jsx
const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ReferenceArrayField reference="books" source="book_ids">
                <Datagrid>
                    <TextField source="title" />
                    <DateField source="published_at" />
                </Datagrid>
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);
```

`<ReferenceArrayField>` reads the list of `book_ids` in the current `record` (an author in this example). Then, it uses `dataProvider.getMany('books', { ids })` fetch the related books.

`<ReferenceArrayField>` creates a `ListContext` with the related records, so you can use any component relying on this context (`<Datagrid>`, `<SimpleList>`, etc.).

You can also use it in a List page:

```jsx
const AuthorList = () => (
    <List>
        <Datagrid>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ReferenceArrayField reference="books" source="book_ids">
                <SingleFieldList>
                    <TextField source="title" />
                </SingleFieldList>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
```

Just like for `<ReferenceField>`, `<ReferenceArrayField>` aggregates and deduplicates all the renders made in a page, and creates an optimised request. So for the entire list of authors, it will make only one call to `dataProvider.getMany('books', { ids })`.

## `<ReferenceManyToManyField>`

This [Enterprise Edition](https://react-admin-ee.marmelab.com)<img class="icon" src="./img/premium.svg" /> field displays a many-to-many relationship implemented with two one-to-many relationships and a join table. 

```
┌──────────────────┐       ┌──────────────┐      ┌───────────────┐
│ books            │       │ book_authors │      │ authors       │
│------------------│       │--------------│      │---------------│
│ id               │───┐   │ id           │      │ id            │
│ title            │   └──╼│ book_id      │   ┌──│ first_name    │
│ published_at     │       │ author_id    │╾──┘  │ last_name     │
└──────────────────┘       │ is_public    │      │ date_of_birth │
                           └──────────────┘      └───────────────┘
```

Here is how you would display the books of an author:

```jsx
const AuthorShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ReferenceManyToManyField 
                reference="books"
                through="book_authors"
                using="author_id,book_id"
            >
                <Datagrid>
                    <TextField source="title" />
                    <DateField source="published_at" />
                </Datagrid>
            </ReferenceManyToManyField>
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```

And here is how you would display the authors of a book:

```jsx
const BookShow = props => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceManyToManyField 
                reference="authors"
                through="book_authors"
                using="book_id,author_id"
            >
                <Datagrid>
                    <FunctionField 
                        label="Author"
                        render={record => `${record.first_name} ${record.last_name}`}
                    />
                    <DateField source="date_of_birth" />
                </Datagrid>
            </ReferenceManyToManyField>
            <EditButton />
        </SimpleShowLayout>
    </Show>
);
```

`<ReferenceManyToManyField>` creates a `ListContext` with the related records, so you can use any component relying on this context (`<Datagrid>`, `<SimpleList>`, etc.).

## `<ReferenceOneField>`

This field fetches a one-to-one relationship, e.g. the details of a book, when using a foreign key.

```
┌──────────────┐       ┌──────────────┐
│ books        │       │ book_details │
│--------------│       │--------------│
│ id           │───┐   │ id           │
│ title        │   └──╼│ book_id      │
│ published_at │       │ genre        │
└──────────────┘       │ ISBN         │
                       └──────────────┘
```

Here is how to use it:

```jsx
const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceOneField label="Genre" reference="book_details" target="book_id">
                <TextField source="genre" />
            </ReferenceOneField>
            <ReferenceOneField label="ISBN" reference="book_details" target="book_id">
                <TextField source="ISBN" />
            </ReferenceOneField>
        </SimpleShowLayout>
    </Show>
);
```

`<ReferenceOneField>` behaves like `<ReferenceManyField>`: it uses the current `record` (a book in this example) to build a filter for the book details with the foreign key (`book_id`). Then, it uses `dataProvider.getManyReference('book_details', { target: 'book_id', id: book.id })` to fetch the related details, and takes the first one.

`<ReferenceOneField>` creates a `RecordContext` with the reference record, so you can use any component relying on this context (`<TextField>`, `<SimpleShowLayout>`, etc.).

**Tip**: As with `<ReferenceField>`, you can call `<ReferenceOneField>` as many times as you need in the same component, react-admin will only make one call to `dataProvider.getManyReference()`.

For the inverse relationships (the author linked to a biography), you can use a `<ReferenceField>`.
