---
layout: default
title: "The ImageInput Component"
---

# `<ImageInput>`

`<ImageInput>` allows editing and uploading images (png, jpg, gif, etc.). It is powered by [react-dropzone](https://github.com/okonet/react-dropzone).

![ImageInput](./img/image-input.png)

## Usage

```jsx
import { ImageInput, ImageField } from 'react-admin';

<ImageInput source="pictures" label="Related pictures">
    <ImageField source="src" title="title" />
</ImageInput>
```

`<ImageInput>` uses its child component to give a preview of the files. `<ImageInput>` renders it child once per file, inside a `<RecordContext>`, so the child can be a Field component. The default [`<ImageField>`](./ImageField.md) renders a thumbnail for the current image(s).

The input value must be an object or an array of objects with a `title` and a `src` property, e.g.:

```js
{
    id: 123,
    attachments: [
        {
            title: 'cat.png',
            src: 'https://example.com/uploads/cat1234.png',
        },
        {
            title: 'dog.png',
            src: 'https://example.com/uploads/dog5678.png',
        },
    ],
}
```

After modification by the user, the value is stored as an array of objects with 3 properties: 

* `title`: the file name with extension, e.g. 'Invoice-2929-01-06.pdf',
* `src`: An [object URL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) for the `File`, e.g. 'blob:https://example.com/1e67e00e-860d-40a5-89ae-6ab0cbee6273'
* `rawFile`: [The `File` object](https://developer.mozilla.org/fr/docs/Web/API/File) itself

It is the responsibility of your `dataProvider` to send the file to the server (encoded in Base64, or using multipart upload) and to transform the `src` property. See [the Handling File Uploads](#handling-file-uploads) for an example.

Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.

## Props

| Prop                   | Required | Type                | Default    | Description                                                         |
|------------------------|----------|---------------------|------------|---------------------------------------------------------------------|
| `accept`               | Optional | `string | string[]` | -                                                                   | Accepted file type(s). When empty, all file types are accepted.     |
| `children`             | Optional | `ReactNode`         | -          | Element used to preview file(s)                                     |
| `minSize`              | Optional | `number`            | 0          | Minimum file size (in bytes), e.g. 5000 for 5KB                     |
| `maxSize`              | Optional | `number`            | `Infinity` | Maximum file size (in bytes), e.g. 5000000 for 5MB                  |
| `multiple`             | Optional | `boolean`           | `false`    | Whether the inputs can accept multiple files.                       |
| `options`              | Optional | `Object`            | `{}`       | Additional options passed to react-dropzone's `useDropzone()` hook. |
| `placeholder`          | Optional | `ReactNode`         | -          | Invite displayed in the drop zone                                   |
| `removeIcon`           | Optional | `ReactNode`         | [MUI's RemoveCircle icon](https://mui.com/material-ui/material-icons/?query=removeCir&selected=RemoveCircle) | The clickable icon for removing images                              |
| `validateFile Removal` | Optional | `function`          | -          | Allows to cancel the removal of files                               |

`<ImageInput>` also accepts the [common input props](./Inputs.md#common-input-props).

## `accept`

Equivalent of [the `accept` attribute of an `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept). `accept` must be a valid [MIME type](https://www.iana.org/assignments/media-types/media-types.xhtml), according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file).

```jsx
<ImageInput source="pictures" accept="image/*">
    <ImageField source="src" title="title" />
</ImageInput>
```

Examples of valid `accept` values:

- 'image/png,image/svg+xml,image/jpg,image/jpeg' 
- 'image/*'

If left empty, all file types are accepted (even non-image types).

## `children`

`<ImageInput>` delegates the preview of currently selected images to its child. `<ImageInput>` clones its child component once per file, inside a [`<RecordContext>`](./useRecordContext.md), so the child can be a [Field](./Fields.md) component. The default [`<ImageField>`](./ImageField.md) renders a thumbnail for the current image(s).

```jsx
<ImageInput source="pictures">
    <ImageField source="src" title="title" />
</ImageInput>
```

Writing a custom preview component is quite straightforward: it's a standard [field](./Fields.md#writing-your-own-field-component).

## `minSize`

Minimum file size (in bytes), e.g. 5000 for 5KB. Defaults to 0.

```jsx
<ImageInput source="pictures" minSize={5000}>
    <ImageField source="src" title="title" />
</ImageInput>
```

## `maxSize`

Maximum file size (in bytes), e.g. 5000000 for 5MB. Defaults to `Infinity`.

```jsx
<ImageInput source="pictures" maxSize={5000000}>
    <ImageField source="src" title="title" />
</ImageInput>
```

## `multiple`

Set to `true` if the input should accept a list of files, `false` if it should only accept one file. Defaults to `false`.

If `multiple` is set to `false` and additional files are dropped, all files besides the first will be rejected. Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.

```jsx
<ImageInput source="pictures" multiple>
    <ImageField source="src" title="title" />
</ImageInput>
```

## `options`

`<ImageInput>` accepts an `options` prop into which you can pass all the [react-dropzone properties](https://react-dropzone.netlify.com/#proptypes).

## `placeholder`

The default droppable area renders the following text:
              
- 'Drop a picture to upload, or click to select it.' for single file inputs
- 'Drop some pictures to upload, or click to select one.' for [multiple file inputs](#multiple)

You can customize these labels using the followinf translation keys:

- `ra.input.image.upload_single`
- `ra.input.image.upload_several` 

If that's not enough, you can pass a `placeholder` prop to overwrite it. The value can be anything React can render:

```jsx
<ImageInput source="files" placeholder={<p>Drop your file here</p>}>
    <ImageField source="src" title="title" />
</ImageInput>
```

## `removeIcon`

Use the `removeIcon` prop to change the icon displayed as the remove button:

```jsx
<ImageInput source="pictures" removeIcon={CustomSvgIcon}>
    <ImageField source="src" title="title" />
</ImageInput>
```

## `sx`: CSS API

The `<ImageInput>` component accepts the usual `className` prop. You can also override many styles of the inner components thanks to the `sx` property (see [the `sx` documentation](./SX.md) for syntax and examples). This property accepts the following subclasses:

| Rule name                       | Description                                         |
|---------------------------------|-----------------------------------------------------|
| `& .RaFileInput-dropZone`      | Styles pass to the underlying `FileInput` component |
| `& .RaFileInput-removeButton`  | Styles pass to the underlying `FileInput` component |

To override the style of all instances of `<ImageInput>` using the [application-wide style overrides](./AppTheme.md#theming-individual-components), use the `RaImageInput` key.

## Handling File Uploads

Handling file uploads in react-admin depends on how your server expects the file to be sent (e.g. as a Base64 string, as a multipart/form-data request, uploaded to a CDN via an AJAX request, etc.). When a user submits a form with a file input, the dataProvider method (`create` or `delete`) receives [a `File` object](https://developer.mozilla.org/en-US/docs/Web/API/File). It's the dataProvider's job to convert that `File`, e.g. using the `FileReader` API.

### How To Send File In Base64

The following Data Provider extends an existing data provider to convert images passed to `dataProvider.update('posts')` into Base64 strings. The example leverages [`withLifecycleCallbacks`](#adding-lifecycle-callbacks) to modify the `dataProvider.update()` method for the `posts` resource only.

```js
import { withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = withLifecycleCallbacks(simpleRestProvider('http://path.to.my.api/'), [
    {
        /**
         * For posts update only, convert uploaded images to base 64 and attach them to
         * the `picture` sent property, with `src` and `title` attributes.
         */
        resource: 'posts',
        beforeUpdate: async (params, dataProvider) => {
            // Freshly dropped pictures are File objects and must be converted to base64 strings
            const newPictures = params.data.pictures.filter(
                p => p.rawFile instanceof File
            );
            const formerPictures = params.data.pictures.filter(
                p => !(p.rawFile instanceof File)
            );

            const base64Pictures = await Promise.all(
                newPictures.map(convertFileToBase64)
            )
            const pictures = [
                ...base64Pictures.map((dataUrl, index) => ({
                    src: dataUrl,
                    title: newPictures[index].name,
                })),
                ...formerPictures,
            ];
            return dataProvider.update(
                resource,
                { data: { ...params.data, pictures } }
            );  
        }
    }
]);

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file.rawFile);
    });

export default myDataProvider;
```

**Tip**: Use `beforeSave` instead of `beforeUpdate` to do the same for both create and update calls.

### How To Send File Using FormData

In case you need to upload files to your API, as you would with an HTML form, you can use [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) API that uses the same format a form would use if the encoding type were set to `multipart/form-data`.

The following Data Provider extends an existing one and leverages [`withLifecycleCallbacks`](#adding-lifecycle-callbacks) to modify the `dataProvider.create()` and `dataProvider.update()` methods for the `posts` resource only with the [`beforeSave`](./withLifecycleCallbacks.md#beforesave) methods. 

It creates a new `FormData` object with the file received from the form and sends this file to the API. It is the role of your API to negotiate the request and process the image.

Then it waits for the API response and fills the `params.picture` object with the image source and title sent by the API. The `params` object is finally returned to allow the parent DataProvider to carry out its processes.

```ts
import { DataProvider, withLifecycleCallbacks } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const dataProvider = withLifecycleCallbacks(simpleRestProvider('http://path.to.my.api/'), [
  {
    resource: "posts",
    beforeSave: async (params: any, dataProvider: DataProvider) => {
      const formData = new FormData();
      formData.append("file", params.picture.rawFile);
  
      const imageResponse = await fetch(`http://path.to.my.api/posts`, {
        method: "POST",
        body: formData,
      });
  
      const image = await imageResponse.json();
  
      params.picture = {
        src: image.src,
        title: image.title,
      };
  
      return params;
    },
  }
]);
```

### How To Send File To A CDN

If the CDN you use allow this, you can upload files via [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) like the previous way.

Lets see an example with [https://cloudinary.com/](Cloudinary) service, by adapting the Data Provider according to [their "Authenticated requests" example](hhttps://cloudinary.com/documentation/upload_images#authenticated_requests). This example show how to upload a file with "Authenticated upload requests".

To do that, you need an API that serves a [`signature`](https://cloudinary.com/documentation/upload_images#generating_authentication_signatures) the format that Cloudinary expect it. To make it easier, you can install the [`cloudinary package` ](https://cloudinary.com/documentation/node_integration#installation_and_setup).

The following code example live in a Remix application. It generate and serve the signature needed to send files to Cloudinary:

```ts
// negotiates the "http://path.to.my.api/get-cloudinary-signature" request and should be secured
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import cloudinary from "cloudinary";

export const loader = ({ request }: LoaderFunctionArgs) => {
  cloudinary.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    secure: false,
  });

  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return json({
    timestamp,
    signature,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
};
```

Then, you can adapt the Data Provider as follows.

```ts
import { DataProvider, withLifecycleCallbacks } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

type CloudinaryImage = {
  asset_id: string;
  secure_url: string;
};

type SignData = {
  api_key: string;
  timestamp: string;
  signature: string;
  cloud_name: string;
};

const dataProvider = withLifecycleCallbacks(
  simpleRestProvider("http://path.to.my.api/"),
  [
    {
      resource: "posts",
      beforeSave: async (params: any, dataProvider: DataProvider) => {
        const response = await fetch(
          "http://path.to.my.api/get-cloudinary-signature",
          {
            method: "GET",
          }
          // should send headers with right authentications
        );
        const signData: SignData = await response.json();

        const url = `https://api.cloudinary.com/v1_1/${signData.cloud_name}/auto/upload`;

        const formData = new FormData();
        formData.append("file", params.picture.rawFile);
        formData.append("api_key", signData.api_key);
        formData.append("timestamp", signData.timestamp);
        formData.append("signature", signData.signature);

        const imageResponse = await fetch(url, {
          method: "POST",
          body: formData,
        });

        const image: CloudinaryImage = await imageResponse.json();

        params.picture = {
          src: image.secure_url,
          title: image.asset_id,
        };

        return params;
      },
    },
  ]
);
```

Thus Data Provider extends an existing one and leverages [`withLifecycleCallbacks`](#adding-lifecycle-callbacks) to modify the `dataProvider.create()` and `dataProvider.update()` methods for the `posts` resource only with the [`beforeSave`](./withLifecycleCallbacks.md#beforesave) methods. 

It creates a new `FormData` object with the file received from the form and sends this file to the Cloudinary API.

Then it waits for the API response and fills the `params.picture` object with the image source and title sent by the Cloudinary API. The `params` object is finally returned to allow the parent DataProvider to carry out its processes.