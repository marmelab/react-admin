---
layout: default
title: "Theming"
---

# Theming

Whether you need to adjust a CSS rule for a single component, or change the color of the labels in the entire app, you're covered!

## Overriding A Component Style

Admin-on-rest uses Material UI, which uses [inline styles](http://www.material-ui.com/#/customization/styles). All admin-on-rest components support the `style` attribute. It expects a style object:

{% raw %}
```js
import { DateField } from 'admin-on-rest/mui';

<DateField source="publication_date" style={{
    fontWeight: 'bold',
}} />
```
{% endraw %}

Some components support additional props to style their own elements. For instance, when using a `<Datagrid>`, you can specify how a `<Field>` renders header and cells with the `headerStyle` and `cellStyle` props. Here is how to use these props to make a column right aligned:

{% raw %}
```js
export const ProductList = (props) => (
    <List {...props} filter={VisitorFilter}>
        <Datagrid>
            <TextField source="sku" />
            <TextField
                source="price"
                cellStyle={{ td: { textAlign: 'right' } }}
                headerStyle={{ th: { textAlign: 'right' } }}
            />
            <EditButton />
        </Datagrid>
    </List>
);
```
{% endraw %}

If you need more control over the HTML code, you can also create your own [Field](./Fields.html#writing-your-own-field-component) and [Input](./Inputs.html#writing-your-own-input-component) components.

## Conditional Formatting

Sometimes you want the format to depend on the value. Admin-on-rest doesn't provide any special way to do it, because React already has all that's necessary - in particular, Higher-Order Components (HOCs).

For instance, if you want to highlight a `<TextField>` in red if the value is higher than 100, just wrap the field into a HOC:

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
