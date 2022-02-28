---
layout: default
title: "The ImageInput Component"
---

# `<ImageInput>`

`<ImageInput>` allows to upload some pictures using [react-dropzone](https://github.com/okonet/react-dropzone).

![ImageInput](./img/image-input.png)

## Properties

| Prop            | Required | Type                        | Default                          | Description                                                                                                                                                                                                                                                         |
| --------------- | -------- | --------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accept`        | Optional | `string | string[]`         | -                                | Accepted file type(s), e. g. 'image/*,.pdf'. If left empty, all file types are accepted. Equivalent of the `accept` attribute of an `<input type="file">`. See [MDN input docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) for syntax and examples. |
| `children`      | Optional | `ReactNode`                 | -                                | Element used to display the preview of an image (cloned several times if the select accepts multiple files).                                                                                                                                                        |
| `minSize`       | Optional | `number`                    | 0                                | Minimum image size (in bytes), e.g. 5000 for 5KB                                                                                                                                                                                                                   |
| `maxSize`       | Optional | `number`                    | `Infinity`                       | Maximum image size (in bytes), e.g. 5000000 for 5MB                                                                                                                                                                                                                 |
| `multiple`      | Optional | `boolean`                   | `false`                          | Set to true if the input should accept a list of images, false if it should only accept one image                                                                                                                                                                   |
| `labelSingle`   | Optional | `string`                    | 'ra.input.image. upload_single'  | Invite displayed in the drop zone if the input accepts one image                                                                                                                                                                                                    |
| `labelMultiple` | Optional | `string`                    | 'ra.input.file. upload_multiple' | Invite displayed in the drop zone if the input accepts several images                                                                                                                                                                                               |
| `placeholder`   | Optional | `string` &#124; `ReactNode` | -                                | Invite displayed in the drop zone, overrides `labelSingle` and `labelMultiple`                                                                                                                                                                                      |
| `options`       | Optional | `Object`                    | `{}`                             | Additional options passed to react-dropzone's `useDropzone()` hook. See [the react-dropzone source](https://github.com/react-dropzone/react-dropzone/blob/master/src/index.js)  for details .                                                                       |

`<ImageInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## Usage

Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props. `accept` must be a valid [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension. If `multiple` is set to false and additional files are dropped, all files besides the first will be rejected. Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.

`<ImageInput>` delegates the preview of currently selected images to its child. `<ImageInput>` clones its child as many times as there are selected images, passing the image as the `record` prop. To preview a simple list of image thumbnails, you can use `<ImageField>` as child, as follows:

```jsx
<ImageInput source="pictures" label="Related pictures" accept="image/*">
    <ImageField source="src" title="title" />
</ImageInput>
```

Writing a custom preview component is quite straightforward: it's a standard [field](./Fields.md#writing-your-own-field-component).

When receiving **new** images, `ImageInput` will add a `rawFile` property to the object passed as the `record` prop of children. This `rawFile` is the [File](https://developer.mozilla.org/en-US/docs/Web/API/File) instance of the newly added file. This can be useful to display information about size or MIME type inside a custom field.

The `ImageInput` component accepts an `options` prop, allowing to set the [react-dropzone properties](https://react-dropzone.netlify.com/#proptypes).

If the default Dropzone label doesn't fit with your need, you can pass a `placeholder` prop to overwrite it. The value can be anything React can render (`PropTypes.node`):

```jsx
<ImageInput source="pictures" label="Related pictures" accept="image/*" placeholder={<p>Drop your file here</p>}>
    <ImageField source="src" title="title" />
</ImageInput>
```

Note that the image upload returns a [File](https://developer.mozilla.org/en/docs/Web/API/File) object. It is your responsibility to handle it depending on your API behavior. You can for instance encode it in base64, or send it as a multi-part form data. Check [this example](./DataProviders.md#handling-file-uploads) for base64 encoding data by extending the REST Client.

## `sx`: CSS API

The `<ImageInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (as most MUI components, see their [documentation about it](https://mui.com/customization/how-to-customize/#overriding-nested-component-styles)). This property accepts the following subclasses:

| Rule name                       | Description                                         |
|---------------------------------|-----------------------------------------------------|
| `& .RaImageInput-dropZone`      | Styles pass to the underlying `FileInput` component |
| `& .RaImageInput-preview`       | Styles pass to the underlying `FileInput` component |
| `& .RaImageInput-removeButton`  | Styles pass to the underlying `FileInput` component |

To override the style of all instances of `<ImageInput>` using the [MUI style overrides](https://mui.com/customization/globals/#css), use the `RaImageInput` key.
