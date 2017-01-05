# Changelog

## Next

* Add `<AutocompleteInput>` field
* [BC Break] Add a limit to the fetching of `<ReferenceInput>` (set to 25 by default)
* Add a `perPage` prop to `<ReferenceInput>` to allow fetching more or less options
* Add a `sort` prop to `<ReferenceInput>` to allow sorting of options
* [BC Break] Remove `GET_MATCHING` REST verb (and merge with `GET_LIST`)
* `optionText` accepts a function in `<SelectInput>`, `<RadioButtonGroupInput>`, and `<AutocompleteInput>`
* `optionText` accepts an element in `<SelectInput>`, and `<RadioButtonGroupInput>`
* Fix bad setup of `ReferenceInput` value in filters
* Set `allowEmpty` to true by default in `Filter` form (was breaking `<ReferenceInput>` in filters by default)
* Add `<NumberInput>` field
* Add support for locales and options in `<DateField>`
* [BC Break] Custom input elements are not decorated by `<Field>` by default
* Add support for `includesField` prop in input components to automate decoration by `<Field>`
* Add support for Field components in `<Edit>` and `<Create>` views
* Use Json REST client (http-less client) in example
* Add support for special chars like "/" in id ([dunglas](https://github.com/dunglas))
* Add support for actions in `<Create>` and `<Edit>` components
* Add support for defaultValue in `<Create>` and `<Edit>` components
* Add support for defaultValue in `<Input>` components
* Add Refresh button in `<Edit>` view
* Add double submission protection in `<SaveButton>`
* Add animation on click in `<SaveButton>`

## V0.6.2

* Fix bad `_end` argument for `jsonServer` REST client
* Clarify CORS headers documentation and exception message
* Fix wrong table cell wrap in `<Datagrid>`
* Add custom layout documentation to Theming chapter
* Fix `<NumberField>` when record has no value for the source
* Fix `<DateField>` for null values

## V0.6.1

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
