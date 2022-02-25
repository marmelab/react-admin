---
layout: default
title: "The Confirm Component"
---

# `<Confirm>`

`<Confirm>` leverages MUI's [`<Dialog>` component](https://mui.com/components/dialogs) to implement a confirmation popup.


![Confirm dialog](./img/confirm-dialog.png)

```jsx
import { useState } from 'react';
import {
    Button,
    Confirm,
    useListContext,
    useUpdateMany,
} from 'react-admin';

const CustomUpdatePostsButton = () => {
    const { selectedIds } = useListContext();
    const [open, setOpen] = useState(false);

    const [updateMany, { isLoading }] = useUpdateMany(
        'posts',
        { ids: selectedIds, data: { views: 0 } }
    );

    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const handleConfirm = () => {
        updateMany();
        setOpen(false);
    };

    return (
        <>
            <Button label="Update Posts" onClick={handleClick} />
            <Confirm
                isOpen={open}
                loading={isLoading}
                title="Update View Count"
                content="Are you sure you want to update these posts?"
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </>
    );
};
```

`<EditButton>` is based on react-admin's base `<Button>`, so it's responsive, accessible, and the label is translatable.

| Prop               | Required | Type           | Default               | Description                                      |
|--------------------|----------|----------------|-----------------------|--------------------------------------------------|
| `className`        | Optional | `string`       | -                     | Resource to link to, e.g. 'posts'                |
| `isOpen`           | Optional | `boolean`      | `false`               | Record to link to, e.g. `{ id: 12, foo: 'bar' }` |
| `loading`          | Optional | `boolean`      | `false`               | Label or translation message to use              |
| `content`          | Optional | `ReactElement` | -                     | Icon element, e.g. `<CommentIcon />`             |
| `cancel`           | Optional | `string`       | 'ra.action.cancel'    | Scroll to top after link                         |
| `confirm`          | Optional | `string`       | 'ra.action.confirm'   | Scroll to top after link                         |
| `confirmColor`     | Optional | `string`       | `primary`             | Scroll to top after link                         |
| `ConfirmIcon`      | Optional | `boolean`      | `<CheckCircle/>`      | Scroll to top after link                         |
| `CancelIcon`       | Optional | `boolean`      | `<ErrorOutlineIcon/>` | Scroll to top after link                         |
| `onClose`          | Optional | `boolean`      | ``                    | Scroll to top after link                         |
| `onConfirm`        | Optional | `boolean`      | `true`                | Scroll to top after link                         |
| `translateOptions` | Optional | `boolean`      | {}                    | Scroll to top after link                         |

Text props such as `title`, `content`, `cancel` and `confirm` are translatable. You can pass translation keys in these props. Note: `content` is only translatable when value is `string`, otherwise it renders the content as a `ReactNode`.
