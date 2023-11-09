---
layout: default
title: "useCheckForApplicationUpdate"
---

# `useCheckForApplicationUpdate`

[`<RecordRepresentation>`](./CheckForApplicationUpdate.md) internally uses this hook to check for updates periodically and displays update notification. The `<RecordRepresentation>` component version should be sufficient to satisfy most use cases.

For advanced users who wish to customize the handling function when a new version is available, they can leverage the `onNewVersionAvailable` parameter in this hook.

## Usage

```tsx
import { useCheckForApplicationUpdate, useNotify } from "react-admin";

export const MyCheckForApplicationUpdate = () => {
    const notify = useNotify();

    const onNewVersionAvailable = () => {
        // Perform backup of user preference in localStorage in case bad things happen
        const preference1 = localStorage.getItem("preference1");
        const preference2 = localStorage.getItem("preference2");
        const checkpointData = {
            preference1,
            preference2,
        };
        localStorage.setItem(
            `checkpoint_${new Date().toISOString()}`,
            JSON.stringify(checkpointData),
        );

        // Notify user
        notify("New Version Ready to Update");
    };

    useCheckForApplicationUpdate({ onNewVersionAvailable });
    return null;
};
```

## Props

`useCheckForApplicationUpdate` accepts the following props:

| Prop            | Required | Type     | Default            | Description                                                         |
| --------------- | -------- | -------- | ------------------ |-------------------------------------------------------------------- |
| `interval` | Optional | number   | `3600000` (1 hour) | The interval in milliseconds between two checks                     |
| `disabled`      | Optional | boolean  | `false` in `production` mode | Whether the automatic check is disabled                              |
| `onNewVersionAvailable`  | Required | Function |                    | Callback when an update is available |
| `url`           | Optional | string   | current URL        | The URL to download to check for code update        

See [`<CheckForApplicationUpdate>`](./CheckForApplicationUpdate.md) for detailed explanation of each prop that is shared with `useCheckForApplicationUpdate`.