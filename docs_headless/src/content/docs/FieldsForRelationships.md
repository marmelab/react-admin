---
title: "Fields For Relationships"
---

React-admin headless provides several base components to deal with relationships between records. These components are designed to work with any UI library, as they only handle the data fetching part. The `dataProvider` interface facilitates the implementation of relational features such as:

- showing the comments related to a post
- showing the author of a post
- choosing the author of a post
- adding tags to a post

React-admin handles relationships *regardless of the capacity of the API to manage relationships*. As long as you can provide a `dataProvider` for your API, all the relational features will work.

The ra-core package provides helpers to fetch related records, depending on the type of relationship, and how the API implements it.

## One-To-Many

When one record has many related records, this is called a one-to-many relationship. For instance, if an author has written several books, `authors` has a one-to-many relationship with `books`. 

To fetch the books of an author with ra-core, you can use:

- [`<ReferenceManyFieldBase>`](#referencemanyfieldbase) when the API uses a foreign key (e.g. each book has an `author_id` field)
- [`<ReferenceArrayFieldBase>`](#referencearrayfieldbase) when the API uses an array of foreign keys (e.g. each author has a `book_ids` field)

## Many-To-One

On the other hand, **many-to-one relationships** are the opposite of one-to-many relationships (e.g. each book has one author). To fetch the author of a book, you can use:

- [`<ReferenceFieldBase>`](#referencefieldbase) when the API uses a foreign key (e.g. each book has an `author_id` field)
- [Deep Field Source](#deep-field-source), when the API embeds the related record (e.g. each book has an `author` field containing an object)

Other kinds of relationships often reduce to one-to-many relationships. 

## One-To-One

For instance, **one-to-one relationships** (e.g. a book has one `book_detail`) are a special type of one-to-many relationship with a cardinality of 1. To fetch the details of a book, you can use:

- [`<ReferenceOneFieldBase>`](#referenceonefieldbase) when the API uses a foreign key (e.g. each `book_detail` has a `book_id` field)
- [`<ReferenceFieldBase>`](#referencefieldbase) when the API uses a reverse foreign key (e.g. each `book` has a `book_detail_id` field)
- Deep Field Source, when the API embeds the related record (e.g. each book has a `book_detail` field containing an object)

## Many-To-Many

Also, **many-to-many relationships** are often modeled as two successive one-to-many relationships. For instance, if a book is co-authored by several people, we can model this as a one-to-many relationship between the book and the book_authors, and a one-to-many relationship between the book_authors and the authors. To fetch the books of an author, use:

- [`<ReferenceArrayFieldBase>`](#referencearrayfieldbase) when the API uses an array of foreign keys (e.g. each author has a `book_ids` field, and each book has an `author_ids` field)

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
import { ShowBase } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';
import { FunctionField } from './FunctionField';

const BookShow = () => (
    <ShowBase>
        <div>
            <TextField source="title" />
            <DateField source="published_at" />
            <FunctionField 
                label="Author"
                render={record => `${record.author.first_name} ${record.author.last_name}`}
            />
            <DateField label="Author DOB" source="author.date_of_birth" />
        </div>
    </ShowBase>
);
```

## `<ReferenceFieldBase>`

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
import { ShowBase, ReferenceFieldBase } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';
import { FunctionField } from './FunctionField';

const BookShow = () => (
    <ShowBase>
        <div>
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceFieldBase label="Author" source="author_id" reference="authors">
                <FunctionField render={record => record && `${record.first_name} ${record.last_name}`} />
            </ReferenceFieldBase>
            <ReferenceFieldBase label="Author DOB" source="author_id" reference="authors">
                <DateField source="date_of_birth" />
            </ReferenceFieldBase>
        </div>
    </ShowBase>
);
```

`<ReferenceFieldBase>` uses the current `record` (a book in this example) to read the id of the reference using the foreign key (`author_id`). Then, it uses `dataProvider.getOne('authors', { id })` fetch the related author.

`<ReferenceFieldBase>` creates a `RecordContext` with the reference record, so you can use any component relying on this context (`<TextField>`, etc.).

**Tip**: You don't need to worry about the fact that these components calls `<ReferenceFieldBase>` twice on the same table. React-admin will only make one call to the API.

This is fine, but what if you need to display the author details for a list of books?

```jsx
import { ListBase, ReferenceFieldBase, ListIterator } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';
import { FunctionField } from './FunctionField';

const BookList = () => (
    <ListBase>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Published</th>
                        <th>Author</th>
                        <th>Author DOB</th>
                    </tr>
                </thead>
                <tbody>
                    <ListIterator>
                        <tr>
                            <td><TextField source="title" /></td>
                            <td><DateField source="published_at" /></td>
                            <td>
                                <ReferenceFieldBase source="author_id" reference="authors">
                                    <FunctionField render={record => `${record.first_name} ${record.last_name}`} />
                                </ReferenceFieldBase>
                            </td>
                            <td>
                                <ReferenceFieldBase source="author_id" reference="authors">
                                    <DateField source="date_of_birth" />
                                </ReferenceFieldBase>
                            </td>
                        </tr>
                    </ListIterator>
                </tbody>
            </table>
        </div>
    </ListBase>
);
```

If each row of the book list triggers one call to `dataProvider.getOne('authors', { id })`, and if the list counts many rows (say, 25), the app will be very slow - and possibly blocked by the API for abusive usage. This is another version of the dreaded ["n+1 problem"](https://blog.appsignal.com/2020/06/09/n-plus-one-queries-explained.html).

Fortunately, `<ReferenceFieldBase>` aggregates and deduplicates all the renders made in a page, and creates an optimised request. In the example above, instead of n calls to `dataProvider.getOne('authors', { id })`, the book list will make one call to `dataProvider.getMany('authors', { ids })`.

## `<ReferenceManyFieldBase>`

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
import { ShowBase, ReferenceManyFieldBase, ListIterator } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';

const AuthorShow = () => (
    <ShowBase>
        <div>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ReferenceManyFieldBase reference="books" target="author_id">
                <ul>
                    <ListIterator>
                        <li>
                            <TextField source="title" />
                            <DateField source="published_at" />
                        </li>
                    </ListIterator>
                </ul>
            </ReferenceManyFieldBase>
        </div>
    </ShowBase>
);
```

`<ReferenceManyFieldBase>` uses the current `record` (an author in this example) to build a filter for the list of books on the foreign key field (`author_id`). Then, it uses `dataProvider.getManyReference('books', { target: 'author_id', id: book.id })` fetch the related books.

`<ReferenceManyFieldBase>` creates a `ListContext` with the related records, so you can use any list component or iterator.

**Tip**: For many APIs, there is no difference between `dataProvider.getList()` and `dataProvider.getManyReference()`. The latter is a specialized version of the former, with a predefined `filter`. But some APIs expose related records as a sub-route, and therefore need a special method to fetch them. For instance, the books of an author can be exposed via the following endpoint: 

```
GET /authors/:id/books
```

That's why `<ReferenceManyFieldBase>` uses the `getManyReference()` method instead of `getList()`.

## `<ReferenceArrayFieldBase>`

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
import { ShowBase, ReferenceArrayFieldBase, ListIterator } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';

const AuthorShow = () => (
    <ShowBase>
        <div>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <DateField source="date_of_birth" />
            <ReferenceArrayFieldBase reference="books" source="book_ids">
                <ul>
                    <ListIterator>
                        <li>
                            <TextField source="title" />
                            <DateField source="published_at" />
                        </li>
                    </ListIterator>
                </ul>
            </ReferenceArrayFieldBase>
        </div>
    </ShowBase>
);
```

`<ReferenceArrayFieldBase>` reads the list of `book_ids` in the current `record` (an author in this example). Then, it uses `dataProvider.getMany('books', { ids })` fetch the related books.

`<ReferenceArrayFieldBase>` creates a `ListContext` with the related records, so you can use any list component or iterator.

You can also use it in a List page:

```jsx
import { ListBase, ReferenceArrayFieldBase, ListIterator } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';

const AuthorList = () => (
    <ListBase>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Books</th>
                    </tr>
                </thead>
                <tbody>
                    <ListIterator>
                        <tr>
                            <td><TextField source="first_name" /></td>
                            <td><TextField source="last_name" /></td>
                            <td><DateField source="date_of_birth" /></td>
                            <td>
                                <ReferenceArrayFieldBase reference="books" source="book_ids">
                                    <ul>
                                        <ListIterator>
                                            <li>
                                                <TextField source="title" />
                                            </li>
                                        </ListIterator>
                                    </ul>
                                </ReferenceArrayFieldBase>
                            </td>
                        </tr>
                    </ListIterator>
                </tbody>
            </table>
        </div>
    </ListBase>
);
```

Just like for `<ReferenceFieldBase>`, `<ReferenceArrayFieldBase>` aggregates and deduplicates all the renders made in a page, and creates an optimised request. So for the entire list of authors, it will make only one call to `dataProvider.getMany('books', { ids })`.

## `<ReferenceOneFieldBase>`

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
import { ShowBase, ReferenceOneFieldBase } from 'ra-core';
import { TextField } from './TextField';
import { DateField } from './DateField';

const BookShow = () => (
    <ShowBase>
        <div>
            <TextField source="title" />
            <DateField source="published_at" />
            <ReferenceOneFieldBase label="Genre" reference="book_details" target="book_id">
                <TextField source="genre" />
            </ReferenceOneFieldBase>
            <ReferenceOneFieldBase label="ISBN" reference="book_details" target="book_id">
                <TextField source="ISBN" />
            </ReferenceOneFieldBase>
        </div>
    </ShowBase>
);
```

`<ReferenceOneFieldBase>` behaves like `<ReferenceManyFieldBase>`: it uses the current `record` (a book in this example) to build a filter for the book details with the foreign key (`book_id`). Then, it uses `dataProvider.getManyReference('book_details', { target: 'book_id', id: book.id })` to fetch the related details, and takes the first one.

`<ReferenceOneFieldBase>` creates a `RecordContext` with the reference record, so you can use any component relying on this context (`<TextField>`, etc.).

**Tip**: As with `<ReferenceFieldBase>`, you can call `<ReferenceOneFieldBase>` as many times as you need in the same component, react-admin will only make one call to `dataProvider.getManyReference()`.

For the inverse relationships (the author linked to a biography), you can use a `<ReferenceFieldBase>`.
