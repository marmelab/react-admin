# Inputs and Fields Types

An `Input` allows to edit a record property whereas a `Field` view is a read-only
display view of a record property.

All inputs and fields accept the following properties:

* **record:** object describing your entity as retrieved by your API,
* **source:** property name of your entity to view/edit.

In addition to these common `props`, you can also configure each field independently,
depending of their types.

### Rich Text Input

![RichTextInput](./img/rich-text-input.png)

`<RichTextInput />` is the ideal component if you want to allow your users to edit some HTML contents. It
is powered by [Quill](https://quilljs.com/).

*Tip*: `quill` is only specified as a peer dependency in the `package.json`. If you want to use the `<RichTextInput>` component in your app, you'll have to add `quill` to your app:

```sh
npm install --save-dev quill
```

The component usage is simple:

``` js
import { RichTextInput } from 'admin-on-rest/mui';

<RichTextInput
    record={record}
    source="body"
    toolbar={[
        ['bold', 'italic', 'underline', 'link'],
    ]}
/>
```

By default, the toolbar in above screenshot is displayed. However, you can override it using the `toolbar` prop and specifying it options, as described on the [Quill official toolbar documentation](https://quilljs.com/docs/modules/toolbar/).

### Rich Text Field

![RichTextInput](./img/rich-text-field.png)

Displaying some HTML content is as simple as using `RichTextField` component:

``` js
import { RichTextField } from 'admin-on-rest/mui';

<RichTextField
    record={record}
    source="body"
    stripTags={true}
/>
```
The `stripTags` option (whose value is `false` by default) allows you to remove
any HTML markup, preventing some display glitches (which is especially useful in
list views).
