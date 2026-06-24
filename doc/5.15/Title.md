---
layout: default
title: "The Title Component"
---

# `<Title>`

Set the page title (the text displayed in the app bar) from within a react-admin component.

![Title](./img/Title.png)

## Usage

Use `<Title>` from anywhere in the page to set the page title. 

```jsx
import { Title } from 'react-admin';

const CustomPage = () => (
    <>
        <Title title="My Custom Page" />
        <div>Content</div>
    </>
);
```

`<Title>` uses a [React Portal](https://react.dev/reference/react-dom/createPortal) to render the title outside of the current component. It works because the default [`<AppBar>`](./AppBar.md) component contains a placeholder for the title called `<TitlePortal>`.

CRUD page components ([`<List>`](./List.md), [`<Edit>`](./Edit.md), [`<Create>`](./Create.md), [`<Show>`](./Show.md)) already use a `<Title>` component. To set the page title for these components, use the `title` prop.

```jsx
import { List } from 'react-admin';

const PostList = () => (
    <List title="All posts">
        ...
    </List>
);
```

## Props

| Prop                | Required | Type                  | Default  | Description                                                                 |
| ------------------- | -------- | --------------------- | -------- | --------------------------------------------------------------------------- |
| `title`             | Optional | `string|ReactElement` | -        | What to display in the central part of the app bar                          |
| `defaultTitle`      | Optional | `string`              | `''`     | What to display in the central part of the app bar when `title` is not set  |
| `preferenceKey`     | Optional | `string`              | ``${pathname}.title`` | The key to use in the user preferences to store a custom title |

## `title`

The `title` prop can be a string or a React element.

If it's a string, it will be passed to [the `translate` function](./useTranslate.md), so you can use a title or a message id.

```jsx
import { Title } from 'react-admin';

const CustomPage = () => (
    <>
        <Title title="my.custom.page.title" />
        <div>Content</div>
    </>
);
```

If it's a React element, it will be rendered as is. If the element contains some text, it's your responsibliity to translate it.

```jsx
import { Title } from 'react-admin';
import ArticleIcon from '@mui/icons-material/Article';

const ArticlePage = () => (
    <>
        <Title title={
            <>
                <ArticleIcon />
                My Custom Page
            </>
        } />
        <div>My Custom Content</div>
    </>
);
```

## `defaultTitle`

It often happens that the title is empty while the component fetches the data to display. To avoid a flicker, you can pass a default title to the `<Title>` component.

```jsx
import { Title, useGetOne } from 'react-admin';
import ArticleIcon from '@mui/icons-material/Article';

const ArticlePage = ({ id }) => {
    const { data, loading } = useGetOne('articles', { id });
    return (
        <>
            <Title
                title={data && <><ArticleIcon />{data.title}</>} 
                defaultTitle={<ArticleIcon />}
            />
            {!loading && <div>{data.body}</div>}
        </>
    );
};
```

## `preferenceKey`

In [Configurable mode](./AppBar.md#configurable), users can customize the page title via the inspector. To avoid conflicts, the `<Title>` component uses a preference key based on the current pathname. For example, the `<Title>` component in the `posts` list page will use the `posts.title` preference key.

If you want to use a custom preference key, pass it to the `<Title>` component.

```jsx
import { Title } from 'react-admin';

const CustomPage = () => (
    <>
        <Title title="My Custom Page" preferenceKey="my.custom.page.title" />
        <div>Content</div>
    </>
);
```

If you want to disable configuring the page title even while in [Configurable mode](./AppBar.md#configurable), you can pass `preferenceKey=false`.

```jsx
import { Title } from 'react-admin';

const CustomPageWithNonConfigurableTitle = () => (
    <>
        <Title title="My Custom Page" preferenceKey={false} />
        <div>Content</div>
    </>
);
```
