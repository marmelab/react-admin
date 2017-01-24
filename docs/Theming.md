---
layout: default
title: "Theming"
---

# Theming

Whether you need to adjust a CSS rule for a single component, or change the color of the labels in the entire app, you're covered!

## Overriding A Component Style

Most admin-on-rest components support two style props to set inline styles:

* `style`: A style object to customize the look and feel of the component container (e.g. the `<td>` in a datagrid). Most of the time, that's where you'll want to put your custom styles.
* `elStyle`: A style object to customize the look and feel of the component element itself, usually a material ui component. Use this prop when you want to fine tune the display of a material ui component, according to [their styling documentation]((http://www.material-ui.com/#/customization/styles)).

These props accept a style object:

{% raw %}
```js
import { EmailField } from 'admin-on-rest/mui';

<EmailField source="email" style={{ backgroundColor: 'lightgrey' }} elStyle={{ textDecoration: 'none' }} />
// renders in the datagrid as
<td style="background-color:lightgrey">
    <a style="text-decoration:none" href="mailto:foo@example.com">
        foo@example.com
    </a>
</td>
```
{% endraw %}

Some components support additional props to style their own elements. For instance, when using a `<Datagrid>`, you can specify how a `<Field>` renders headers with the `headerStyle` prop. Here is how to make a column right aligned:

{% raw %}
```js
export const ProductList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="sku" />
            <TextField
                source="price"
                style={{ textAlign: 'right' }}
                headerStyle={{ textAlign: 'right' }}
            />
            <EditButton />
        </Datagrid>
    </List>
);
```
{% endraw %}

Refer to each component documentation for a list of supported style props.

If you need more control over the HTML code, you can also create your own [Field](./Fields.html#writing-your-own-field-component) and [Input](./Inputs.html#writing-your-own-input-component) components.

## Conditional Formatting

Sometimes you want the format to depend on the value. Admin-on-rest doesn't provide any special way to do it, because React already has all that's necessary - in particular, Higher-Order Components (HOCs).

For instance, if you want to highlight a `<TextField>` in red if the value is higher than 100, just wrap the field into a HOC:

{% raw %}
```js
const colored = WrappedComponent => props => props.record[props.source] > 100 ?
    <span style={{ color: 'red' }}><WrappedComponent {...props} /></span> :
    <WrappedComponent {...props} />;

const ColoredTextField = colored(TextField);

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            ...
            <ColoredTextField source="nb_views" />
            <EditButton />
        </Datagrid>
    </List>
);
```
{% endraw %}

If you want to read more about higher-order components, check out this SitePoint tutorial: [Higher Order Components: A React Application Design Pattern](https://www.sitepoint.com/react-higher-order-components/)

## Using a Predefined Theme

Material UI also supports [complete theming](http://www.material-ui.com/#/customization/themes) out of the box. Material UI ships two base themes: light and dark. Admin-on-rest uses the light one by default. To use the dark one, pass it to the `<Admin>` component, in the `theme` prop (along with `getMuiTheme()`).

```js
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const App = () => (
    <Admin theme={getMuiTheme(darkBaseTheme)} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

![Dark theme](./img/dark-theme.png)

## Writing a Custom Theme

If you need more fine tuning, you'll need to write your own `theme` object, following [Material UI themes documentation](http://www.material-ui.com/#/customization/themes). Material UI merges custom theme objects with the `light` theme.

```js
import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const myTheme = {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
      primary1Color: cyan500,
      primary2Color: cyan700,
      primary3Color: grey400,
      accent1Color: pinkA200,
      accent2Color: grey100,
      accent3Color: grey500,
      textColor: darkBlack,
      alternateTextColor: white,
      canvasColor: white,
      borderColor: grey300,
      disabledColor: fade(darkBlack, 0.3),
      pickerHeaderColor: cyan500,
      clockCircleColor: fade(darkBlack, 0.07),
      shadowColor: fullBlack,
    },
};
```

The `muiTheme` object contains the following keys:

* `spacing` can be used to change the spacing of components.
* `fontFamily` can be used to change the default font family.
* `palette` can be used to change the color of components.
* `zIndex` can be used to change the level of each component.
* `isRtl` can be used to enable the right to left mode.
* There is also one key for each component so you can use to customize them individually:
  * `appBar`
  * `avatar`
  * ...

**Tip**: Check [Material UI custom colors documentation](http://www.material-ui.com/#/customization/colors) to see pre-defined colors available for customizing your theme.

Once your theme is defined, pass it to the `<Admin>` component, in the `theme` prop (along with `getMuiTheme()`).

```js
const App = () => (
    <Admin theme={getMuiTheme(myTheme)} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

## Using a Custom Layout

Instead of the default layout, you can use your own component as the admin layout. Just use the `appLayout` prop of the `<Admin>` component:

```js
// in src/App.js
import MyLayout from './MyLayout';

const App = () => (
    <Admin appLayout={MyLayout} restClient={simpleRestClient('http://path.to.my.api')}>
        // ...
    </Admin>
);
```

Refer to [the `<Admin>` component documentation](./AdminResource.html#applayout) for more details.
