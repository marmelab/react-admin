---
layout: default
title: "The Configurable Component"
---

# `<Configurable>`

This component makes another component configurable by the end user. When users enter the configuration mode, they can customize the component's settings via the inspector.

<video controls autoplay playsinline muted loop>
  <source src="./img/SimpleListConfigurable.webm" type="video/webm"/>
  <source src="./img/SimpleListConfigurable.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


Some react-admin components are already configurable - or rather they have a configurable counterpart:

- [`<DatagridConfigurable>`](./Datagrid.md#configurable)
- [`<SimpleListConfigurable>`](./SimpleList.md#configurable)
- [`<SimpleFormConfigurable>`](./SimpleForm.md#configurable)
- `<PageTitleConfigurable>` - used by [the `<Title>` component](./Title.md)

## Usage

Wrap any component with `<Configurable>` and define its editor component to let users customize it via a UI. Don't forget to pass down props to the inner component. Note that every configurable component needs a unique preference key, that is used to persist the user's preferences in the Store.

```jsx
import { Configurable } from 'react-admin';

const ConfigurableTextBlock = ({ preferenceKey = "textBlock", ...props }) => (
    <Configurable editor={<TextBlockEditor />} preferenceKey={preferenceKey}>
        <TextBlock {...props} />
    </Configurable>
);
```

`<Configurable>` creates a context for the `preferenceKey`, so that both the child component and the editor can access it.

The editor commponent lets users edit the preferences for the configurable compoonent. It does so using the `usePreference` hook, which is a namespaced version of [the `useStore` hook](./useStore.md) for the current `preferenceKey`:

```jsx
import { usePreference } from 'react-admin';

const TextBlockEditor = () => {
    const [color, setColor] = usePreference('color', '#ffffff');
    // equivalent to:
    // const [color, setColor] = useStore('textBlock.color', '#ffffff');
    return (
        <Box>
            <Typography>Configure the text block</Typography>
            <TextField
                label="Color"
                value={color}
                onChange={e => setColor(e.target.value)}
            />
        </Box>
    );
};
```
 
The inner component reads the preferences using the same `usePreference` hook:

```jsx
const TextBlock = ({ title, content }) => {
    const [color] = usePreference('color', '#ffffff');
    return (
        <Box bgcolor={color}>
            <Typography variant="h6">{title}</Typography>
            <Typography>{content}</Typography>
        </Box>
    );
};
```

Then, use the configurable component in your app:

```jsx
import { ConfigurableTextBlock } from './ConfigurableTextBlock';

export const Dashboard = () => (
    <ConfigurableTextBlock
        title="Welcome to the administration"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    />
);
```

## `children`

The wrapped component can be any component relying on `usePreference`. Configurable components let users customize their content, look and feel, and behavior.

For instance, the following `<TextBlock>` component lets end users change its foreground and background colors:

{% raw %}
```jsx
import { usePreference } from 'react-admin';

const TextBlock = ({ title, content }) => {
    const [color] = usePreference('color', 'primary.contrastTest');
    const [bgcolor] = usePreference('bgcolor', 'primary.main');
    return (
        <Box sx={{ color, bgcolor }}>
            <Typography variant="h6">{title}</Typography>
            <Typography>{content}</Typography>
        </Box>
    );
};
```
{% endraw %}

## `editor`

The `editor` component should let the user change the settings of the child component - usually via form controls. When the user enters configuration mode then selects the configurable component, react-admin renders the `editor` component in the inspector.

The editor component must also use `usePreference` to read and write a given preference.

For instance, here is a simple editor for the above `<TextBlock>` component, letting users customize the foreground and background colors:

```jsx
import { usePreference } from 'react-admin';

const TextBlockEditor = () => {
    const [color, setColor] = usePreference('color', 'primary.contrastTest');
    const [bgcolor, setBgcolor] = usePreference('bgcolor', 'primary.main');
    return (
        <Box>
            <Typography>Configure the text block</Typography>
            <TextField
                label="Color"
                value={color}
                onChange={e => setColor(e.target.value)}
            />
            <TextField
                label="Background Color"
                value={bgcolor}
                onChange={e => setBgcolor(e.target.value)}
            />
        </Box>
    );
};
```

In practice, instead of updating the preferences on change like in the above example, you should wait for the user to validate the input. Otherwise, the setting may temporarily have an invalid value (e.g., when entering the string 'primary.main', the value may temporarily be 'prim', which is invalid).

React-admin provides a `usePreferenceInput` hook to help you with that. It returns an object with the following properties: `{ value, onChange, onBlur, onKeyDown }`, and you can directly pass it to an input component:

```jsx
import { usePreferenceInput } from 'react-admin';

const TextBlockEditor = () => {
    const colorField = usePreferenceInput('color', 'primary.contrastTest');
    const bgcolorField = usePreferenceInput('bgcolor', 'primary.main');
    return (
        <Box>
            <Typography>Configure the text block</Typography>
            <TextField label="Color" {...colorField} />
            <TextField label="Background Color" {...bgcolorField} />
        </Box>
    );
};
```

`usePreferenceInput` changes the preference on blur, or when the user presses the Enter key. Just like `usePreference`, it uses the `preferenceKey` from the context to namespace the preference.

## `preferenceKey`

This parameter lets you specify the key used to store the configuration in the user's preferences. This allows you to have more than one configurable component of the same type per page. 

```jsx
import { Configurable } from 'react-admin';

const ConfigurableTextBlock = ({ preferenceKey, ...props }) => (
    <Configurable editor={<TextBlockInspector />} preferenceKey={preferenceKey}>
        <TextBlock {...props} />
    </Configurable>
);
```

Then in your application, set the `preferenceKey` prop to a unique value for each component:

```jsx
import { ConfigurableTextBlock } from './ConfigurableTextBlock';

export const Dashboard = () => (
    <>
        <ConfigurableTextBlock
            preferenceKey="textBlock1"
            title="Welcome to the administration"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <ConfigurableTextBlock
            preferenceKey="textBlock2"
            title="Security reminder"
            content="Nullam bibendum orci tortor, a posuere arcu sollicitudin ac"
        />
    </>
);
```

Users will be able to customize each component independently.

## `<InspectorButton>`

Add the `<InspectorButton>` to [the `<AppBar>` component](./AppBar.md) in order to let users enter the configuration mode and show the configuration editing panel.

```jsx
import { AppBar, TitlePortal, InspectorButton } from 'react-admin';

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <InspectorButton />
    </AppBar>
);
```

## `<Inspector>`

The `<Inspector>` is already included in the layouts provided by react-admin. If you are using a custom layout, you need to add the `<Inspector>` component to your layout.

{% raw %}
```jsx
// in src/MyLayout.js
import * as React from 'react';
import { Box } from '@mui/material';
import { AppBar, Menu, Sidebar, Inspector } from 'react-admin';

const MyLayout = ({ children, dashboard }) => (
    <Box 
        display="flex"
        flexDirection="column"
        zIndex={1}
        minHeight="100vh"
        backgroundColor="theme.palette.background.default"
        position="relative"
    >
        <Box
            display="flex"
            flexDirection="column"
            overflowX="auto"
        >
            <AppBar />
            <Box display="flex" flexGrow={1}>
                <Sidebar>
                    <Menu hasDashboard={!!dashboard} />
                </Sidebar>
                <Box
                    display="flex"
                    flexDirection="column"
                    flexGrow={2}
                    p={3}
                    marginTop="4em"
                    paddingLeft={5}
                >
                    {children}
                </Box>
            </Box>
        </Box>
        <Inspector />
    </Box>
);

export default MyLayout;
```
{% endraw %}