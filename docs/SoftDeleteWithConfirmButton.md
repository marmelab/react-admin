---
layout: default
title: "The SoftDeleteWithConfirmButton Component"
---

# `<SoftDeleteWithConfirmButton>`

Soft-deletes the current record after a confirm dialog has been accepted.

## Usage

{% raw %}
```tsx
import * as React from 'react';
import { Toolbar, Edit, SaveButton, useRecordContext } from 'react-admin';
import { SoftDeleteWithConfirmButton } from '@react-admin/ra-soft-delete';

const EditToolbar = () => {
    const record = useRecordContext();

    return (
        <Toolbar>
            <SaveButton/>
            <SoftDeleteWithConfirmButton
                confirmContent="You will be able to recover this record from the trash."
                confirmColor="warning"
                contentTranslateOptions={{ name: record.name }}
                titleTranslateOptions={{ name: record.name }}
            />
        </Toolbar>
    );
};

const MyEdit = () => (
    <Edit>
        <SimpleForm toolbar={<EditToolbar />}>
            ...
        </SimpleForm>        
    </Edit>    
);
```
{% endraw %}

##  Props

| Prop                      | Required | Type                                             | Default                                      | Description                                                             |
|-------------------------- |----------|--------------------------------------------------|----------------------------------------------|-------------------------------------------------------------------------|
| `className`               | Optional | `string`                                         | -                                            | Class name to customize the look and feel of the button element itself  |
| `confirmTitle`            | Optional | `ReactNode`                                      | 'ra-soft-delete.message.soft_delete_title'   | Title of the confirm dialog                                             |
| `confirmContent`          | Optional | `ReactNode`                                      | 'ra-soft-delete.message.soft_delete_content' | Message or React component to be used as the body of the confirm dialog |
| `confirmColor`            | Optional | <code>'primary' &#124; 'warning'</code>          | 'primary'                                    | The color of the confirm dialog's "Confirm" button                      |
| `contentTranslateOptions` | Optional | `Object`                                         | {}                                           | Custom id, name and record representation to be used in the confirm dialog's content |
| `icon`                    | Optional | `ReactElement`                                   | `<DeleteIcon>`                               | iconElement, e.g. `<CommentIcon />`                                     |
| `label`                   | Optional | `string`                                         | 'ra-soft-delete.action.soft_delete'          | label or translation message to use                                     |
| `mutationOptions`         | Optional |                                                  | null                                         | options for react-query `useMutation` hook                              |
| `redirect`                | Optional | <code>string &#124; false &#124; Function</code> | 'list'                                       | Custom redirection after success side effect                            |
| `titleTranslateOptions`   | Optional | `Object`                                         | {}                                           | Custom id, name and record representation to be used in the confirm dialog's title |
| `successMessage`          | Optional | `string`                                         | 'ra-soft-delete.notification.soft_deleted'   | Lets you customize the success notification message.                    |

