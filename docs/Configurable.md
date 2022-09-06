---
layout: default
title: "The Configurable Component"
---

# `<Configurable>`

This component makes another component configurable by the end user. When they enter the configuration mode, users can customize the component's settings via the inspector.

![SimpleListConfigurable](./img/SimpleListConfigurable.gif)

Some react-admin components are already configurable - or rather they have a configurable counterpart:

- [`<SimpleListConfigurable>`](./SimpleList.md#configurable)

## Usage

Wrap any component with `<Configurable>` and define its editor to let users customize it via a UI. Don't forget to pass down props to the inner component.

```jsx
import { Configurable } from 'react-admin';

const ConfigurableTextBlock = (props) => (
    <Configurable editor={<TextBlockEditor />}>
        <TextBlock {...props} />
    </Configurable>
);
```

Then, use this component in your app:

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

The wrapped component must forward refs. It must also use [`useStore`](./useStore.md) to access the configuration.

```jsx
import { useStore } from 'react-admin';

const TextBlock = React.forwardRef((props, ref) => {
    const { title, content } = props;
    const [color] = useStore(`textBlock.color`, '#ffffff');
    return (
        <Box bgcolor={color} ref={ref}>
            <Typography variant="h6">{title}</Typography>
            <Typography>{content}</Typography>
        </Box>
    );
});
```

## `editor`

The editor component must also use [`useStore`](./useStore.md) to read and write the configuration. React-admin renders it in the inspector when the user selects the component.

```jsx
import { useStore } from 'react-admin';

const TextBlockEditor = () => {
    const [color, setColor] = useStore(`textBlock.color`, '#ffffff');
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

## `preferencesKey`

This optional parameter lets you specify the key used to store the configuration in the user's preferences. This allows you to have more than one configurable component of the same type per page. 

```jsx
import { Configurable } from 'react-admin';

const ConfigurableTextBlock = ({ preferencesKey, ...props }) => (
    <Configurable editor={<TextBlockInspector />} preferencesKey={preferencesKey}>
        <TextBlock {...props} />
    </Configurable>
);
```

Then in your application, set the `preferencesKey` prop to a unique value for each component:

```jsx
import { ConfigurableTextBlock } from './ConfigurableTextBlock';

export const Dashboard = () => (
    <>
        <ConfigurableTextBlock
            preferencesKey="textBlock1"
            title="Welcome to the administration"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <ConfigurableTextBlock
            preferencesKey="textBlock2"
            title="Security reminder"
            content="Nullam bibendum orci tortor, a posuere arcu sollicitudin ac"
        />
    </>
);
```

Users will be able to customize each component independently.

