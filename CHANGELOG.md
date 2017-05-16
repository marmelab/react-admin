# Changelog

## v1.0.2

* Fix typo in Login page instructions in tutorial ([DjLeChuck](https://github.com/DjLeChuck))
* Fix clear filter breaks filters on subsequent refreshes ([djhi](https://github.com/djhi))
* Add ability to customize sidebar width ([djhi](https://github.com/djhi))
* Add example about using auth action creators ([djhi](https://github.com/djhi))
* Fix `<ReferenceField>` should not fetch null values ([djhi](https://github.com/djhi))
* Fix typo in `<FilterForm>` styles ([djhi](https://github.com/djhi))
* Fix Edit View not being updated when fields get changed ([djhi](https://github.com/djhi))
* Fix DateField tests on all timezones ([djhi](https://github.com/djhi))
* Add instructions to run the example app in README ([juanda99](https://github.com/juanda99))
* Fix edge case in `<RichTextField>` when string is falsey value ([faviouz](https://github.com/faviouz))

## v1.0.1

* Fix filters on refresh ([djhi](https://github.com/djhi))
* Fix `<CheckboxGroupInput>` on IE ([djhi](https://github.com/djhi))
* Fix warning when using non-string `title` prop in `<Admin>` ([JulienDemangeon](https://github.com/JulienDemangeon))
* Fix id parameter not decoded in URL ([abarani](https://github.com/abarani))
* Fix Auth error message not displayed ([tacoo](https://github.com/tacoo))
* Fix `<Logout>` button not redrawn on theme change ([zyhou](https://github.com/zyhou))
* Fix validation documentation (`validation` prop renamed to `validate`) ([tacoo](https://github.com/tacoo))
* Fix JSX syntax highlighting in documentation ([fzaninotto](https://github.com/fzaninotto))
* Add mention of obligation to declare a `Resource` for `ReferenceInput` to work ([fzaninotto](https://github.com/fzaninotto))
* Add a missing link in the doc Table of Contents ([leesei](https://github.com/leesei))
* Add link to Chinese (Traditional) (`cht`) translation ([leesei](https://github.com/leesei))
* Add link to sandbox in the Contributing documentation ([fzaninotto](https://github.com/fzaninotto))

## v1.0.0

* [BC Break] Switch validation system to redux-form native validation (breaks all input validation)
* [BC Break] Move error mapping (HTTP to REST) to `authClient` (breaks HTTP 401 and 403 error handling)
* [BC Break] Upgrade react-router to v4 (breaks custom routes)
* [BC Break] Refactor Auth side effects to Saga (breaks custom app and custom layout)
* Add ability to require all components from the `admin-on-rest` package (no more `admin-on-rest/lib/mui`)
* Add `<SelectField>` component
* Add `<Restricted>` component
* Add `LOGIN`, `LOGOUT`, `CHECK`, and `ERROR` actions
* Add translation of options in `<SelectInput>`, `<AutocompleteInput>`, `<RadioButtonGroupInput>`, and `<CheckboxGroupInput>`
* Add `linkType` prop to `<ReferenceField>` to allow customization or removal of hyperlink on references
* Add ability to override the `<Filter>` component by using redux-form's new `onChange` method
* Add message in `<List>` when the REST API returns no result ([mantis](https://github.com/mantis))
* Add ability to remove images in `<ImageInput>`
* Add error when an erroneous REST response does not contain the `error` key
* Add the ability to pass an initial state to `createStore` ([thedersen](https://github.com/thedersen))
* Add link from `ImageInput` documentation to REST Client decoration documentation ([leesei](https://github.com/leesei))
* Add documentation for `parse()` and `format()` in Inputs reference ([leesei](https://github.com/leesei))
* Add warning in documentation about `<Resource>` required for `ReferenceManyField` usage
* Add Czech translation ([magikMaker](https://github.com/magikMaker))
* Add Japanese translation ([valueshimoda](https://github.com/valueshimoda))
* Add Dutch translation ([pimschaaf](https://github.com/pimschaaf))
* Add aor-jsonapi-client to the list of REST clients ([maxschridde1494](https://github.com/maxschridde1494))
* Add e2e tests for post creation ([demougin2u](https://github.com/demougin2u))
* Upgrade dependencies (including React 15.5.4, redux-form 6.6.3, material-ui 0.17.4)
* Fix error messages translation
* Fix ability to disable sort for a field
* Fix translation warning on tab names
* Fix Admin component crash while rendering if first resource isn't loaded yet ([lutangar](https://github.com/lutangar))
* Fix missing menu dock for dashboard
* Update tutorial screenshots

## v0.9.4

* Fix `<ReferenceManyField>` documentation by adding a warning about required `<Resource>`
* Fix custom dashboard documentation for `<ViewTitle>`
* Fix custom List actions documentation ([remi13131](https://github.com/remi13131))
* Fix `restClient` documentation by simplifying example code ([kulakowka](https://github.com/kulakowka))
* Fix refresh on Edit clears data
* Fix bad "unauthorized" notification after login
* Fix typo on authentication documentation ([faviouz](https://github.com/faviouz))
* Fix custom style component documentation ([vysakh0](https://github.com/vysakh0))
* Fix Custom HTTP Client documentation ([remi13131](https://github.com/remi13131))
* Explain branches in README
* Fix `<NullableBooleanInput>` bug on undefined `meta` prop

## v0.9.3

* Fix list layout breaking when there are more than 3 filters
* Fix documentation about API endpoint and aor URL mapping
* Fix typos in Actions documentation ([leesei](https://github.com/leesei))
* Fix hyperlink to JSON API route in Tutorial ([damiansimonpeter](https://github.com/damiansimonpeter))
* Add a `dropAreaLabel` prop to `<ImageInput>` to let developers customize label of drop area ([DjLeChuck](https://github.com/DjLeChuck))

## v0.9.2

* Fix IE11/Edge flexbox issue ([LoicMahieu](https://github.com/LoicMahieu))
* Fix custom sagas can't reliably watch router actions
* Fix image input previews on drop
* Fix pagination on mobile
* Fix SelectInput error text position
* Add mention of Hungarian translations ([s33m4nn](https://github.com/s33m4nn))
* Add mention of `aor-parseserver-client`
* Add contribution guidelines

## v0.9.1

* Fix redirection after creation
* Fix `jsonServer` `GET_MANY` implementation ([wadjeroudi](https://github.com/wadjeroudi))
* Add Loopback-like REST client ([kimkha](https://github.com/kimkha))
* Update Webpack example config ([velociwabbit](https://github.com/velociwabbit))

## v0.9.0

* [BC Break] Update REST response format to always expect a `data` key
* Add mobile UI (Sidebar, AppBar, Datagrid, actions, form action)
* Add `<Responsive>` component
* Add `<ViewTitle>` component (to be used instead of `<CardTitle>` for responsive views)
* Add ability to hide sidebar using hamburger menu
* Add `<Sidebar>` component
* Add `menu` prop to `<Admin>`, to customize the menu without overriding the layout
* Add dashboard MenuItem on top of Menu when relevant
* Add ability to execute crud actions without redirect ([thedersen](https://github.com/thedersen))
* Add support for custom `onBlur`, `onChange`, and `onFocus` props to `<NumberInput>` and `<TextInput>`
* Add support for image preview change via dispatches form value in `<ImageInput />`
* Add support for custom redirect path when auth check fails ([thedersen](https://github.com/thedersen))
* Add support for non-cancelable fetch in `crudGetList` action ([thedersen](https://github.com/thedersen))
* Add support for default locale in `resolveBrowserLocale`
* Add ability to translate `CRUD_UPDATE` to HTTP `PATCH` method
* Add ability to hide fields
* Add Spanish translations ([JonatanSalas](https://github.com/JonatanSalas))
* Add Vietnamese translations ([kimkha](https://github.com/kimkha))
* Improve Login page UX with form lock and loader ([Natsuke](https://github.com/Natsuke))
* Improve `<Datagrid>` rendering options by using material-ui `<Table>` element
* Improve loader and button components rendering speed
* Remove link to dashboard in the top bar
* Remove CSS copy step from build
* Fix notification for server error even when the response body is empty

## v0.8.4

* Fix `defaultValue` assignment for nested resource attributes ([cytomich](https://github.com/cytomich))
* Fix typo in Inputs documentation ([FallDi](https://github.com/FallDi))
* Fix Custom App install instructions
* Add Hebrew translation link ([mstmustisnt](https://github.com/mstmustisnt))
* Add link to Feathers `restClient` ([josx](https://github.com/josx))


## v0.8.3

* Fix Edit view shows stale data
* Fix anchor typo on documentation index ([szappacosta](https://github.com/szappacosta))
* Fix missing import in the Getting Started tutorial ([SilentKernel](https://github.com/SilentKernel))
* Add demo video in doc and GitHub homepage
* Add Russian translation link ([cytomich](https://github.com/cytomich))

## v0.8.2

* Fix scroll to top during navigation when auth is disabled
* Fix fetch saga to avoid mutating actions
* Fix custom app documentation
* Fix SelectInput arrow click hides input
* Fix missing status in fetch when error is thrown ([wadjeroudi](https://github.com/wadjeroudi))
* Remove documentation images from package
* Add Chinese translation link ([downup2u](https://github.com/downup2u))
* Add German translation link ([der-On](https://github.com/der-On))
* Add link to powershell script for building ([mantis](https://github.com/mantis))

## v0.8.1

* Fix custom title in view and custom label in resource
* Fix quick filter in example demo
* Add link to GraphQl rest client in the docs
* Add link to `<ColorInput>` component in the docs
* Add link to Italian translation in the docs ([stefsava](https://github.com/stefsava))

## v0.8.0

See the [v0.8.0 announcement in the marmelab blog](https://marmelab.com/blog/2017/02/14/admin-on-rest-0-8.html).

* [BC Break] Rename `defaultSort` prop to `sort` in `<List>` component, to make it consistent with the props of `<ReferenceInput>` and `<ReferenceManyField>`
* [BC Break] Rename `filter` props (the one accepting a `<Filter>` element) to `filters` in `<List>` component
* Add I18n
* Add Authentication
* Add `<ImageField>` and `<ImageInput>` to upload images
* Add `<CheckboxGroupInput>` component
* Add the ability to hook up custom sagas in `<Admin>`
* Add the ability to hook up custom reducers in `<Admin>`
* Add `filter` prop to `<List>` component for permanent filters
* Add support for `defaultValue` in filters
* Add support for functions as value for the `defaultValue` prop
* Add ability to disable sorting on datagrid headers
* Add `perPage`, `sort`, and `filter` props to ``<ReferenceManyField>`
* Add `label` prop to all buttons
* Add Custom Actions documentation
* Add CSS prefix to flex-box elements ([yshing](https://github.com/yshing))
* Improve Delete button labels
* Update optimistic rendering to also work with custom fetch actions
* Speed up `<Datagrid>` rendering
* Refactor response side effects to a normal saga
* Upgrade `redux-saga` to v0.14.2
* Fix disconnection on dashboard
* Fix edge case where list filter isn't shown
* Fix validation for `<AutocompleteInput>`, `<ReferenceInput>`, and `<SelectInput>` ([AkselsLedins](https://github.com/AkselsLedins))

## v0.7.2

* Fix code snippets disappearing from documentation
* Add mention of aor-postgrest-client in REST clients documentation
* Fix missed refresh in example due to aor-json-rest-client not cloning the objects
* Fix Refresh button doesn't refresh References
* Fix pagination error in console during load

## v0.7.1

* Fix validation on nested fields
* Fix validation when passed as `<Input>` prop in `<TabbedForm>` component
* Fix endless spinning `<SaveButton>` upon error

## v0.7.0

See the [v0.7.0 announcement in the marmelab blog](https://marmelab.com/blog/2017/01/13/admin-on-rest-0-7.html).

* [BC Break] Remove `<RichTextInput>` from core, use `aor-rich-text-input` instead
* [BC Break] Introduce `<SimpleForm>` component between `<Edit>/<Create>` and input components
* [BC Break] Introduce `<SimpleShowLayout>` component between `<Show>` and field components
* [BC Break] Remove `GET_MATCHING` REST verb (and merge with `GET_LIST`)
* [BC Break] Add a limit to the fetching of `<ReferenceInput>` (set to 25 by default)
* [BC Break] Custom input elements are not decorated by `<Field>` by default, set `addField: true` to get it
* [BC Break] Custom input elements are not decorated by `<Labeled>` by default, set `addLabel: true` to get it
* [BC Break] Rename `includesField: true` to `addField: false` for Input components
* [BC Break] Rename `includesLabel: true` to `addLabel: false` for Input components
* [BC Break] All Redux action creators are now exported at the root level
* Introduce `<TabbedForm>` component as an example of alternative form layout
* Add `<AutocompleteInput>` field
* Add `<NumberInput>` field
* Add ability to use any React component (including Fields) as `Edit` or `Create` element
* Add support for locales and options in `<DateField>`
* Add animation on click in `<SaveButton>`
* Add Refresh button in `<Edit>` view
* Add support for defaultValue in `<Create>` and `<Edit>` components
* Add support for defaultValue in `<Input>` components
* Add support for actions in `<Create>` and `<Edit>` components
* Add a `perPage` prop to `<ReferenceInput>` to allow fetching more or less options
* Add a `sort` prop to `<ReferenceInput>` to allow sorting of options
* Add support for function as `optionText` value in `<SelectInput>`, `<RadioButtonGroupInput>`, and `<AutocompleteInput>`
* Add support for element as `optionText` value in `<SelectInput>`, and `<RadioButtonGroupInput>`
* Add double submission protection in `<SaveButton>`
* Add trigger to hide `<Edit>` view title until record is loaded
* Add support for special chars like "/" in id ([dunglas](https://github.com/dunglas))
* Add `<FormField>` component to allow reuse of the `addLabel/addField` decoration logic
* Use Json REST client (http-less client) in example
* Set `allowEmpty` to true by default in `Filter` form (was breaking `<ReferenceInput>` in filters by default)
* Fix bad setup of `ReferenceInput` value in filters
* Fix `<SavedButton>` in case of invalid form (was spinning forever)

## v0.6.2

* Fix bad `_end` argument for `jsonServer` REST client
* Clarify CORS headers documentation and exception message
* Fix wrong table cell wrap in `<Datagrid>`
* Add custom layout documentation to Theming chapter
* Fix `<NumberField>` when record has no value for the source
* Fix `<DateField>` for null values

## v0.6.1

* Fix notification background colors to use mui theme
* Fix missing `lodash.defaultdeep` not mentioned as dependency

## v0.6.0

* [BC Break] The `filter` prop of the <List> component now expects an element rather than a component (`<List filter={<MyFilter/>} >` rather than `<List filter={MyFilter} >`)
* [BC Break] The `title` prop of all view components now expect an element rather than a component (`<List title={<MyTitle/>`} > rather than `<List title={MyTitle} >`)
* [BC Break] Rename `style` to `elStyle` and let style override container element
* Add special design for non-sortable columns in datagrid
* Add `style`, `elStyle` to all components
* Add `headerStyle` to Field components (ability to style `<th>`)
* Add `rowStyle` to `<Datagrid>` (ability to style `<tr>` according to the value)
* Add `defaultSort` to `<Datagrid>` (ability to set default sort order on list)
* Add `actions`, `perPage`, and `pagination` props to the `<List>` component
* Add List view documentation
* Add `<BooleanField>` component
* Add `<BooleanInput>` component
* Add `<NullableBooleanInput>` component
* Add `<NumberField>` component
* Add `<FunctionField>` component
* Align datagrid first column to the page title
* Hide resources in the Menu when they don't have a list view
* Fix warning for fields with no source and no label
* Fix FilterButton for fields without label

## v0.5.4

* Document conditional formatting
* Fix node incompatibility error caused by `quill` when installing with `yarn` ([tinhnguyen-ea](https://github.com/tinhnguyen-ea))
* Fix pagination when the number of pages exceeds 8
* Fix React 14.4 compatibility by updating `react-tap-event` dependency ([petetnt](https://github.com/petetnt))
* Fix regression in material UI Popover
* Update dependencies (`react`, `material-ui`, `redux-form`, `redux-saga`)

## v0.5.3

* Fix `jsonServer` `GET_MANY` when overriding `htpClient` ([aceofspades](https://github.com/aceofspades))
* Fix bad refresh of list after create, update, and delete
* Fix unstable state after create, update, and delete

## v0.5.2

* Fix `<SelectInput>` subcomponent key in case of duplicate value ([rweindl](https://github.com/rweindl))
* Fix `make test-watch` command
* Fix  datagrid margins to accomodate more content
* Fix cannot set empty value on `<ReferenceInput/>`
* Fix bad error message in `restClient` when no count header is found
* Fix Infinite loop when two menu clicked quickly
* Fix Warning when Datagrid contains two action buttons
* Add ability to intercept HTTP request and add custom headers

## v0.5.1

Fix bad built files

## v0.5.0

See the [v0.5.0 announcement in the marmelab blog](http://marmelab.com/blog/2016/11/10/admin-on-rest-0-5.html).

* [BC Break] Remove `credentials: include` HTTP option enabled by default
* Add `<Show>` View
* Add custom headers support
* Add support for the `style` attribute in all components
* Add Theming Documentation (by [MattWilliamsDev](https://github.com/MattWilliamsDev))
* Update the `<Datagrid>` to use real tables (and auto-size columns)
* Upgrade to material-ui 0.16
* Update package to bundle quill
* Export more components and functions to ease customization
* Fix multiple ReferenceFields in a list incorrectly loads data
* Fix spinner not stopping after delete
* Fix Router now scrolls to top
* Fix `<RadioButtonGroupInput>`
* Fix datagrid layout to make columns adapt width to content
* Fix doc on reducers in CustomApp (by [ArnaudD](https://github.com/ArnaudD))
* Fix custom app docs now that redux form is required
* Fix RadioButtonGroupInput
* Fix Pagination when list has no filter
* Fix clearing text filter doesn't fetch the unfiltered list
* Fix Warning when Datagrid contains two action buttons

## v0.4.0

* [BC Break] Pass Headers object to `restClient`
* Add loads of documentation
* Use `source` as implicit `label` in fields and input components
* Add `<RichTextField>` and `<RichTextInput>` components (powered by [quill](http://quilljs.com/))
* Add `<UrlField>` component
* Add Form Validation in `<Edit>` and `<Create>` views (powered by [redux-form](http://redux-form.com/))
* Add material-ui theme support in the `<Admin>` component (by [fnberta](https://github.com/fnberta))
* Add option to show date with time (by [fnberta](https://github.com/fnberta))
* Add UUID support (by [bjet007](https://github.com/bjet007))
* Add deep field selection
* Add unit tests
* Fix form display issue when single or no fields
* Fix and speedup filters
* Fix create form
* Fix filter value reset when filter is removed

## V0.3.0

See the [v0.3.0 announcement in the marmelab blog](http://marmelab.com/blog/2016/09/02/admin-on-rest-react-admin-framework.html).

* [BC Break] `<List>` takes an iterator child (like `<Datagrid>`)
* [BC Break] `<ReferenceField>` replaces `referenceSource` by a child field
* [BC Break] `<ReferenceInput>` replaces `referenceSource` by a child input
* [BC Break] Rename `fetchJSON` to `fetchJson`
* Switch FakeRest as an external dependency
* Add ability to customize admin title
* Add `<Labeled>` component, and introduce the `includesLabel` prop on inputs
* Add `<SingleFieldList>` and `<ChipField>` components
* Add `<ReferenceManyField>` component and related reducer logic
* Add `<RadioButtonGroupInput>` component
* Add `<SelectInput>` component
* Add notifications
* Add Custom App doc

## v0.2.0

* Fix redirect breaks loader
* Move list params state from redux to router (allows usage of back button in the list)
* Fix filters bug (did not reset the page number)
* Add ability to define a custom dashboard component
* Rename Datagrid to List, and introduce Datagrid component
* Export REST types constants
* Add tutorial

## v0.1.0 - Initial release
