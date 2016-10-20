---
layout: default
title: "Theming"
---

# Theming

Admin theming is handled by [Material UI](http://www.material-ui.com/#/customization/themes). [See these docs](http://www.material-ui.com/#/customization/themes) for more information.

### Customization

Customization can be done via a ["theme"](http://www.material-ui.com/#/customization/themes), or via [inline styles](http://www.material-ui.com/#/customization/styles).

Pre-defined colors available for customizing or creating your own theme can be also found [here in Material UI's docs](http://www.material-ui.com/#/customization/colors)

### Example

To customize your theme, start by creating a new `theme` object. All custom theme objects are based on the `light` theme, and any attributes defined in your `theme` object will override the defaults. Once your theme is defined, pass it to the `theme` prop (along with `getMuiTheme()`) that gets passed to the `Admin` component.

_Example:_
```js
const myTheme = {
    fontFamily: 'Roboto, sans-serif'
    , palette: {
        primary1Color: colors.orange2
        , primary2Color: darkBlack
        , primary3Color: colors.grey
        , accent1Color: colors.orange2
        , accent2Color: colors.ltGrey
        , accent3Color: colors.grey
        , textColor: darkBlack
        , secondaryTextColor: fade( darkBlack, 0.54 )
        , alternateTextColor: white
        , canvasColor: white
        , borderColor: colors.ltGrey
        , disabledColor: fade( darkBlack, 0.3 )
        , pickerHeaderColor: colors.orange2
        , clockCircleColor: fade( darkBlack, 0.07 )
        , shadowColor: fullBlack
    }
    , appBar: {
        backgroundColor: colors.orange2
        , color: darkBlack
    }
};

...

class App extends Component {
    render() {
        return (
            <Admin
                restClient={ RestClient }
                title="MyTitle"
                theme={ getMuiTheme( myTheme ) }
            >
                ...
            </Admin>
        );
    }
}
```
