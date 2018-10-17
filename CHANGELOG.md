# Changelog

## v2.4.0

* Bootstrap TypeScript migration ([#2426](https://github.com/marmelab/react-admin/pull/2426)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<ListGuesser>`, `<EditGuesser>`, and `<ShowGuesser>` to facilitate CRUD bootstrap and prototyping ([#2376](https://github.com/marmelab/react-admin/pull/2376)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to use custom icon in `<UserMenu>`  ([#2391](https://github.com/marmelab/react-admin/pull/2391)) ([Luwangel](https://github.com/Luwangel))
* Add `id` attribute on input if not specified and other accessibility fixes ([#2351](https://github.com/marmelab/react-admin/pull/2351)) ([djhi](https://github.com/djhi))
* Add `aside` support in `List`, `Edit`, and `Show` views ([#2304](https://github.com/marmelab/react-admin/pull/2304)) ([fzaninotto](https://github.com/fzaninotto))
* Add warning when the `translate()` higher-order component is used directly to translate a string ([#2318](https://github.com/marmelab/react-admin/pull/2318)) ([djhi](https://github.com/djhi))
* Add `Datagrid` `rowClick` attribute to avoid adding an `<EditButton>`([#2341](https://github.com/marmelab/react-admin/pull/2341)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<DateTimeInput>` ([#2332](https://github.com/marmelab/react-admin/pull/2332)) ([fzaninotto](https://github.com/fzaninotto))
* Add easier `<Toolbar>` customization for `<Edit>` (small breaking change) ([#2340](https://github.com/marmelab/react-admin/pull/2340)) ([fzaninotto](https://github.com/fzaninotto))
* Add documentation on the data returned from create requests ([#2262](https://github.com/marmelab/react-admin/pull/2262)) ([cuococarlos](https://github.com/cuococarlos))
* Fix error formatting on `<RichTextInput>`, `<CheckboxGroupInput>`, `<RadioButtonGroupInput>`, and `<SelectArrayInput>` ([#2335](https://github.com/marmelab/react-admin/pull/2335)) ([natrim](https://github.com/natrim))
* Fix empty label appears on mobile when using a `<Button>` with no label ([#2409](https://github.com/marmelab/react-admin/pull/2409)) ([natrim](https://github.com/natrim))
* Fix autosuggest toggle problem ([#2436](https://github.com/marmelab/react-admin/pull/2436)) ([oksuz](https://github.com/oksuz))
* Fix typo in `exporter` example ([#2434](https://github.com/marmelab/react-admin/pull/2434)) ([jarradsl](https://github.com/jarradsl))
* Fix Validation issues on `<RichTextInput>` ([#2423](https://github.com/marmelab/react-admin/pull/2423)) ([TomJannes](https://github.com/TomJannes))
* Fix typo reference to FileInput instead of FileField ([#2419](https://github.com/marmelab/react-admin/pull/2419)) ([daytonn](https://github.com/daytonn))

## v2.3.4

* Fix double asterix on required RadioButtonGroupInput  ([2417](https://github.com/marmelab/react-admin/pull/2417)) ([fzaninotto](https://github.com/fzaninotto))
* Fix autocomplete content overflow not visible ([2415](https://github.com/marmelab/react-admin/pull/2415)) ([fzaninotto](https://github.com/fzaninotto))
* Fix GraphQL introspection issue with Apollo cache ([2411](https://github.com/marmelab/react-admin/pull/2411)) ([audunhalland](https://github.com/audunhalland))
* Fixed typo for aria attribute in `<Button>` components ([2408](https://github.com/marmelab/react-admin/pull/2408)) ([pastparty](https://github.com/pastparty))
* Fix and translate `<AutocompleteArrayInput>` label ([2392](https://github.com/marmelab/react-admin/pull/2392)) ([djhi](https://github.com/djhi))
* Fix missing index for `<AutocompleteArrayInput>` documentation ([2393](https://github.com/marmelab/react-admin/pull/2393)) ([djhi](https://github.com/djhi))
* Fix various documentation spelling & grammar errors ([2390](https://github.com/marmelab/react-admin/pull/2390)) ([civilizedgorilla](https://github.com/civilizedgorilla))
* Add mention of `ra-jsonapi-client` Data Provider in documentation ([2386](https://github.com/marmelab/react-admin/pull/2386)) ([henvo](https://github.com/henvo))
* Fix `<SelectArrayInput>` error style ([2377](https://github.com/marmelab/react-admin/pull/2377)) ([djhi](https://github.com/djhi))

## v2.3.3

* Fix query-string parsing for array values in `Create` ([#2373](https://github.com/marmelab/react-admin/pull/2373)) ([djhi](https://github.com/djhi))
* Fix out of boundaries pagination does not allow pagination ([#2365](https://github.com/marmelab/react-admin/pull/2365)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `SimpleFormIterator` does not iterate on sub records ([#2364](https://github.com/marmelab/react-admin/pull/2364)) ([fzaninotto](https://github.com/fzaninotto))
* Fix triling whitespaces in documentation ([#2359](https://github.com/marmelab/react-admin/pull/2359)) ([josx](https://github.com/josx))
* Fix Feathers dataProvidr package name to `ra-data-feathers` ([#2358](https://github.com/marmelab/react-admin/pull/2358)) ([josx](https://github.com/josx))
* Fix small typo in `List` doc ([#2355](https://github.com/marmelab/react-admin/pull/2355)) ([ArnaudD](https://github.com/ArnaudD))
* Fix `fetchRelatedRecords` should ignore nullable relationships in `exporter` ([#2354](https://github.com/marmelab/react-admin/pull/2354)) ([Luwangel](https://github.com/Luwangel))
* Fix `AppBar` sometimes doesn't appear when scrolling up ([#2348](https://github.com/marmelab/react-admin/pull/2348)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated reference to `DeleteButton` in `EditActions` documentation ([#2347](https://github.com/marmelab/react-admin/pull/2347)) ([swrobel](https://github.com/swrobel))
* Add new Turkish translation ([#2349](https://github.com/marmelab/react-admin/pull/2349)) ([KamilGunduz](https://github.com/KamilGunduz))

## v2.3.2

* Fix `<RichTextInput>` link tooltip z-index ([#2345](https://github.com/marmelab/react-admin/pull/2345)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RichTextInput>` unordered list rendering ([#2330](https://github.com/marmelab/react-admin/pull/2330)) ([neomusic](https://github.com/neomusic))
* Fix `<Edit>` form empty after creation ([#2339](https://github.com/marmelab/react-admin/pull/2339)) ([djhi](https://github.com/djhi))
* Fix example schema for delete in simple GraphQL adapter ([#2342](https://github.com/marmelab/react-admin/pull/2342)) ([kpollich](https://github.com/kpollich))
* Fix `<List>` showing incorrect number of selected ids after deletion ([#2336](https://github.com/marmelab/react-admin/pull/2336)) ([fzaninotto](https://github.com/fzaninotto))
* Fix form reset in Save and Add scenarios ([#2332](https://github.com/marmelab/react-admin/pull/2332)) ([djhi](https://github.com/djhi))
* Fix type warning in `<List>` when setting `bulkActions` props to `false` ([#2327](https://github.com/marmelab/react-admin/pull/2327)) ([fzaninotto](https://github.com/fzaninotto))
* Fix incorrect `<Resource>` prop in GraphQL readme usage instructions ([#2325](https://github.com/marmelab/react-admin/pull/2325)) ([hips1](https://github.com/hips1))
* Fix `<ReferenceInput>` fails to load choices when multiple instances reference the same resource ([#2321](https://github.com/marmelab/react-admin/pull/2321)) ([djhi](https://github.com/djhi))
* Add a section about production build UI bug in FAQ ([#2215](https://github.com/marmelab/react-admin/pull/2215)) ([edouardmenayde](https://github.com/edouardmenayde))
* Add mention of `ra-data-firebase-client` dataProvider ([#2334](https://github.com/marmelab/react-admin/pull/2334)) ([aymendhaya](https://github.com/aymendhaya))

## v2.3.1

* Fix Delete button for record of id zero ([fzaninotto](https://github.com/fzaninotto))
* Fix typos in French translations ([despatates](https://github.com/despatates))
* Fix keyboard handling in `<DateInput>` ([fzaninotto](https://github.com/fzaninotto))
* Remove deprecated Data Providers from the documentation ([Kmaschta](https://github.com/Kmaschta))
* Update CodeSandbox link to 2.3 in issue template ([Kmaschta](https://github.com/Kmaschta))
* Fix `rowsPerPageOptions` not transmitted to pagination ([antonversal](https://github.com/antonversal))
* Fix Webpack compilation of projects using GraphQL data providers ([Kmaschta](https://github.com/Kmaschta))

## v2.3.0

For highlights about this version, read [the 2.3 release announcement post](https://marmelab.com/blog/2018/09/07/react-admin-2-3.html) on the marmelab blog.


* [`Actions`] Move `<Refresh>` to `<AppBar>` ([fzaninotto](https://github.com/fzaninotto))
* [`Actions`] Remove the `<ListButton>` ([fzaninotto](https://github.com/fzaninotto))
* [`Actions`] Update `<Button>` to adapt the icon size to the button size ([fzaninotto](https://github.com/fzaninotto))
* [`AppBar`] Add `<UserMenu>` to group user-related actions (and `<Logout>`) ([fzaninotto](https://github.com/fzaninotto))
* [`AppBar`] Add Headroom effect (show/hide on scroll) ([zyhou](https://github.com/zyhou))
* [`ArrayInput`] Add debounce to `crudGetMatching` calls ([djhi](https://github.com/djhi))
* [`ArrayInput`] Allow the `<FormDataConsumer>` to be used inside an `ArrayInput` ([djhi](https://github.com/djhi))
* [`AutocompleteArrayInput`] Fix select on click ([djhi](https://github.com/djhi))
* [`Datagrid`] Add padding right to the last column ([fzaninotto](https://github.com/fzaninotto))
* [`Datagrid`] Hide the sort icons when the column is not active ([fzaninotto](https://github.com/fzaninotto))
* [`Edit`] Add the `<TitleForRecord>` component (replacement for `<RecordTitle>`) ([fzaninotto](https://github.com/fzaninotto))
* [`Edit`] Move the `<Delete>` button down to the Toolbar ([fzaninotto](https://github.com/fzaninotto))
* [`Edit`] Use material design recommended margin for content ([fzaninotto](https://github.com/fzaninotto))
* [`FormDataConsumer`] Fix wrong warning ([djhi](https://github.com/djhi))
* [`FormInput`] Add the component to the export ([pedrohh](https://github.com/pedrohh))
* [`Input`] Add `<AutocompleteArrayInput>` for editing one-to-many relationships with a large number of options ([djhi](https://github.com/djhi))
* [`List`] Add `<BulkActionToolbar>` as a replacement for the `<BulkActions>` ([fzaninotto](https://github.com/fzaninotto))
* [`List`] Display the `Filter` on the top left of the content ([fzaninotto](https://github.com/fzaninotto))
* [`Login`] Replace the lock icon to allow forward compatibility with `@material-ui/icons` 2.0 ([djhi](https://github.com/djhi))
* [`Pagination`] Add the ability to set the number of rows per page ([fzaninotto](https://github.com/fzaninotto))
* [`RichTextInput`] Add support for `fullWidth` prop ([natrim](https://github.com/natrim))
* [`Sidebar`] Add the ability to change the width ([fzaninotto](https://github.com/fzaninotto))
* [`TabbedLayout`, `TabbedForm`] Let large forms extend horizontally, remove overflow scroll ([djhi](https://github.com/djhi))
* [`Title`] Move the content to the `AppBar` ([fzaninotto](https://github.com/fzaninotto))
* [`tree`] Introduce `ra-tree-core` and `ra-tree-ui-materialui` to display and edit tress structures in a List view (Labs) ([djhi](https://github.com/djhi))
* [console] Add deprecation warnings (when not in production mode) ([djhi](https://github.com/djhi))
* [Demo] Fix and upgrade GraphQL and Graphcool demos ([djhi](https://github.com/djhi))
* [Demo] Improve fake data to have real avatars, consistent emails, and better looking reviews ([fzaninotto](https://github.com/fzaninotto))
* [GraphQL] Add 'How does it work' section to the `ra-data-graphql` README ([Weakky](https://github.com/Weakky))
* [GraphQL] Add a link to a Prisma `dataProvider` ([Weakky](https://github.com/Weakky))
* [GraphQL] Allow easier per-query override ([djhi](https://github.com/djhi))
* [npm] Expose `esm` modules to enable tree shaking (and smaller bundle size) ([Kmaschta](https://github.com/Kmaschta))
* [npm] Remove babel `stage-0` preset and use `preset-env` instead ([Kmaschta](https://github.com/Kmaschta))
* [redux] Allow to use <Admin> inside an external <Provider> ([fzaninotto](https://github.com/fzaninotto))

Deprecations:

* `<Admin>` `menu` prop. To override the menu component, use a [custom layout](#appLayout) instead.
* `<AppBarMobile>`. The `<AppBar>` component is now responsive.
* `<BulkActions>`. Use `<BulkActionToolbar>` instead.
* `<Header>`. Use `<Title>` instead.
* `<RecordTitle>`. Use `<TitleForRecord>` instead.
* `<ViewTitle>`. Use `<Title>` instead.
* GraphQL provides `override` prop. Use `buildQuery` instead.

## v2.2.4

* Fix `<SaveButton>` misaligned `<CircularProgress>` ([natrim](https://github.com/natrim))
* Fix typo in List documentation ([jbeurel](https://github.com/jbeurel))
* Fix code snippets in `ra-data-graphql` readme ([nicgirault](https://github.com/nicgirault))
* Add link to Hungarian translation ([phelion](https://github.com/phelion))
* Add link to `bs-react-admin` (BuckleScript) to the Ecosystem documentation ([ctbucha](https://github.com/ctbucha))
* Update the CodeSandbox link in issue template ([Kmaschta](https://github.com/Kmaschta))

## v2.2.3

* Fix form reset with navigation (again) ([djhi](https://github.com/djhi))
* Fix `ReferenceArrayInputController` error on undefined record ([natrim](https://github.com/natrim))
* Fix `<AutoCompleteInput>` updates its choices after blur ([djhi](https://github.com/djhi))
* Fix `<AutoCompleteInput>` does not automatically select a choice when there are still multiple matches ([djhi](https://github.com/djhi))
* Fix `<FileField>` warnings about unknown props ([djhi](https://github.com/djhi))
* Fix `<FileInput>` `multiple` prop documentation ([djhi](https://github.com/djhi))
* Fix `<SelectInput>` when used inside a `<ReferenceInput>` with `allowEmpty` ([djhi](https://github.com/djhi))
* Fix list documentation for `bulkActions` ([djhi](https://github.com/djhi))
* Fix typo in `error` side effect comment ([Kmaschta](https://github.com/Kmaschta))
* Fix doc mentions obsolete translation packages ([fzaninotto](https://github.com/fzaninotto))
* Add link to Danish translation ([nikri](https://github.com/nikri))
* Add an Advanced Tutorials section to the documentation ([djhi](https://github.com/djhi))
* Fix `handleSubmit` should not be overriden in `<Toolbar>` children ([djhi](https://github.com/djhi))
* Fix `<ReferenceField>` does not respect its child's `className` ([fzaninotto](https://github.com/fzaninotto))
* Fix typo on `ra-language-french` French translations ([Kmaschta](https://github.com/Kmaschta))

## v2.2.2

* Fix `<SelectInput>` and `<SelectArrayInput>` validation ([djhi](https://github.com/djhi))

## v2.2.1

* Fix `<AutocompleteInput>` when suggestions are numbers ([djhi](https://github.com/djhi))
* Fix `ra-realtime` documentation to add an example of `createRealtimeSaga` factory function ([djhi](https://github.com/djhi))
* Fix `ListController` props cannot be changed from outside ([djhi](https://github.com/djhi))
* Fix Autocomplete list is cut off by content area ([djhi](https://github.com/djhi))
* Fix form reset on navigation ([djhi](https://github.com/djhi))
* Fix `ra-data-fakerest` package name in readme ([mexitalian](https://github.com/mexitalian))
* Fix `ra-data-graphql-simple` example usage ([kfern](https://github.com/kfern))
* Fix typo in `<ArrayInput>` documentation ([igneel64](https://github.com/igneel64))
* Fix documentation links not working work when browsing the doc via Github ([fzaninotto](https://github.com/fzaninotto))
* Fix link in `CreateEdit` dicumentation ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix error when using `<ReferenceInput>` in `<SimpleFormIterator>` ([blasic](https://github.com/blasic))
* Fix Field with `sortBy` and no `source` is not sortable ([Luwangel](https://github.com/Luwangel))
* Fix `<label>` and `<input>` not bounded correctly in login form ([josx](https://github.com/josx))
* Fix fetch alert when response contains falsy data ([fzaninotto](https://github.com/fzaninotto))
* Fix Tutorial documentation missing `prop-types` package ([igneel64](https://github.com/igneel64))
* Fix Quill autofocus in `<RichTextInput>` ([floo51](https://github.com/floo51))
* Fix missing `$options` prop in `<FileInput>` documentation ([djhi](https://github.com/djhi))
* Fix mobile layout ([fzaninotto](https://github.com/fzaninotto))
* Fix Reference components do not update from their props ([djhi](https://github.com/djhi))
* Add link to Farsi translations ([hamidfzm](https://github.com/hamidfzm))
* Add link to Finnish translations ([Aikain](https://github.com/Aikain))

## v2.2.0

For highlights about this version, read [the 2.2 release announcement post](https://marmelab.com/blog/2018/08/16/react-admin-2-2.html) on the marmelab blog.

* Add Export feature ([fzaninotto](https://github.com/fzaninotto))
* Add the `callback` side effect ([fzaninotto](https://github.com/fzaninotto))
* Add Error Page ([fzaninotto](https://github.com/fzaninotto))
* Add clear button on inputs ([djhi](https://github.com/djhi))
* Add ability to clone a record ([fzaninotto](https://github.com/fzaninotto))
* Add validation for `dataProvider` response format ([djhi](https://github.com/djhi), [fzaninotto](https://github.com/fzaninotto))
* Add Tooltips To Icon Buttons ([fzaninotto](https://github.com/fzaninotto))
* Add ability to alter values after submission and before saving them ([djhi](https://github.com/djhi))
* Add support for forms in lists ([djhi](https://github.com/djhi))
* Add support for `asyncBlurFields` in forms ([fzaninotto](https://github.com/fzaninotto))
* Add redirection to the previous page when a `FETCH_ERROR` occurs ([djhi](https://github.com/djhi))
* Add `<CreateActions>` and `<RecordTitle>` components ([djhi](https://github.com/djhi))
* Update the UI to make the `<AppBar>` dense ([fzaninotto](https://github.com/fzaninotto))
* Update the UI to make the page heading smaller ([fzaninotto](https://github.com/fzaninotto))
* Update the `<ListView>` implementation to make it easier to override ([fzaninotto](https://github.com/fzaninotto))
* Fix bug with `defaultValues` and `<TabbedForm>` ([djhi](https://github.com/djhi))
* Fix bug with `defaultValues` and `<FormDataConsumer>` ([djhi](https://github.com/djhi))
* Fix bug with Form state being persisted between resources ([djhi](https://github.com/djhi))
* Fix `defaultValue` for `<ArrayInput>` ([djhi](https://github.com/djhi))

## v2.1.5

* Fix `NumberField` style regression in Show views ([djhi](https://github.com/djhi))
* Add `ra-customizable-datagrid` to Ecosystem documentation ([AkselsLedins](https://github.com/AkselsLedins))
* Fix e2e tests failing on chrome 68 ([djhi](https://github.com/djhi))
* Add Vietnamese translation ([hieunguyendut](https://github.com/hieunguyendut))
* Fix `<ReferenceInput>` when used inside `<ArrayInput>` ([djhi](https://github.com/djhi))
* Fix broken link in Actions documentation ([djhi](https://github.com/djhi))

## v2.1.4

* Fix link color in `<ReferenceField>` ([fzaninotto](https://github.com/fzaninotto))
* Fix form does not display data when coming from another form ([fzaninotto](https://github.com/fzaninotto))
* Revert Fix form resetting when a input with defaultValue is dynamically added ([fzaninotto](https://github.com/fzaninotto))
* Add link to related post from Comment edit view in Simple example ([fzaninotto](https://github.com/fzaninotto))

## v2.1.3

* Fix `<ArrayInput>` documentation mentions non-existing `UrlInput` component ([AkselsLedins](https://github.com/AkselsLedins))
* Fix `<ReferenceInput>` infinite loop on missing reference ([djhi](https://github.com/djhi))
* Fix `Reference` inputs do not update when their props change from outside ([djhi](https://github.com/djhi))
* Fix makefile does not build `ra-data-fakerest` package ([djhi](https://github.com/djhi))
* Fix `record` prop value in `<SimpleFormIterator>` children ([fzaninotto](https://github.com/fzaninotto))
* Fix `fetchJson` util `undefined Buffer` error ([fzaninotto](https://github.com/fzaninotto))
* Fix form keeps values after navigation ([djhi](https://github.com/djhi))
* Fix Theme doesn't apply to `Fields` ([djhi](https://github.com/djhi)) 
* Fix optimistic delete in `<List>` ([djhi](https://github.com/djhi))
* Fix `filterDefaultValues` is shared accross resources ([djhi](https://github.com/djhi))
* Make contributions easier for Windows users by moving most scripting logic from `make` to `npm` ([djhi](https://github.com/djhi))

## v2.1.2

* Fix duplicated block in `CreateEdit` doc ([fzaninotto](https://github.com/fzaninotto))
* Fix submit on enter when `submitOnEnter` is false ([djhi](https://github.com/djhi))
* Fix form resetting when a input with `defaultValue` is dynamically added ([djhi](https://github.com/djhi))
* Fix validators memoization ([Bnaya](https://github.com/Bnaya))
* Add Chinese translation ([chen4w](https://github.com/chen4w))
* Add API Platform Admin and the JSON-LD Data Provider to the `Ecosystem` doc ([dunglas](https://github.com/dunglas))

## v2.1.1

* Fix FormInput not passing `resource` to `Labeled` inputs ([djhi](https://github.com/djhi))
* Add documentaton on how to prefill a `<Create>` form based on another record ([fzaninotto](https://github.com/fzaninotto))
* Add polish translations ([tskorupka](https://github.com/tskorupka))
* Add documentation on tabs routing ([djhi](https://github.com/djhi))

## v2.1.0

For highlights about this version, read [the 2.1 release announcement post](https://marmelab.com/blog/2018/07/02/react-admin-2-1.html) on the marmelab blog.

* [`TabbedForm`, `TabbedShowLayout`] Add routing support for tab navigation ([djhi](https://github.com/djhi))
* [`SimpleForm`, `TabbedForm`] Add ability to customize the redux form ([djhi](https://github.com/djhi))
* [`ReferenceField`] Add optional `sortBy` prop to allow sorting by another field than `id` ([ArneZsng](https://github.com/ArneZsng))
* [`SaveButton`, `SimpleForm`, `Tabbedform`] Add support for function as `redirect` value ([fzaninotto](https://github.com/fzaninotto))
* [`RichTextInput`] Add validation support ([fzaninotto](https://github.com/fzaninotto))
* [`ReferenceInput`] Inject `sort`, `pagination`, and `filters` props to the child component ([fzaninotto](https://github.com/fzaninotto))
* [`Layout`] Add ability to customize sub components (menu, appbar, notification) ([fzaninotto](https://github.com/fzaninotto))
* [`ArrayInput`] Add `allowAdd` & `allowRemove` attribute, to hide + and - buttons ([ashim](https://github.com/ashim))
* [`ra-data-graphql-simple`] Fix documentation ([djhi](https://github.com/djhi))
* [`LongTextInput`] Fix UI when used inside a `<TabbedForm>` ([fzaninotto](https://github.com/fzaninotto))
* [Refactoring] Remove necessity to use CSS loader in `ra-input-rich-text` ([fzaninotto](https://github.com/fzaninotto))
* [Refactoring] Manage form saving state inside Form components ([djhi](https://github.com/djhi))
* [Refactoring] Migrate e2e tests to Cypress ([djhi](https://github.com/djhi))
* [Refactoring] Move the URL parsing responsibility from View controllers to `<Resource>` ([djhi](https://github.com/djhi))
* [Dependencies] Upgrade to `material-ui` ^1.0.0, upgrade examples to `material-ui` 1.2.1 ([fzaninotto](https://github.com/fzaninotto))
* [Dependencies] Upgrade to `prettier` 1.13 ([fzaninotto](https://github.com/fzaninotto))

## v2.0.4

* Add documentation for icon format restriction in `<MenuItemLink>` ([fzaninotto](https://github.com/fzaninotto))
* Add `required` to the `currenSort` propType in `<Datagrid>`, to avoid unexpected errors ([alexicum](https://github.com/alexicum))
* Add Portuguese translation ([marquesgabriel](https://github.com/marquesgabriel))
* Add Ukrainian translation ([koresar](https://github.com/koresar))
* Add documentation about custom path as the `redirect` prop on Create/Edit ([djhi](https://github.com/djhi))
* Add mention of `react-admin-color-input` and `react-admin-date-inputs` in Ecosystem doc ([vascofg](https://github.com/vascofg))
* Fix style overriding documentation for `<Datagrid>` ([fzaninotto](https://github.com/fzaninotto))
* Fix broken link in `<Admin>` documentation ([fzaninotto](https://github.com/fzaninotto))
* Fix refresh in pessimistic mode prevents server-side validation ([fzaninotto](https://github.com/fzaninotto))
* Fix `fullWidth` warning when using `<Labeled>` ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` when used in standalone ([fzaninotto](https://github.com/fzaninotto))
* Fix custom route action in simple example ([alexicum](https://github.com/alexicum))
* Fix warning in Demo, in `<Link>` to filtered list ([fzaninotto](https://github.com/fzaninotto))
* Fix edit icon in Demo, in product gridlist on smaller screens ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated `import` in Custom Theme documentation ([AkselsLedins](https://github.com/AkselsLedins))
* Fix `WithPermissions` calling `setState` in async function ([djhi](https://github.com/djhi))
* Fix error in `jsonserver` provider on Windows ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated theming doc ([fzaninotto](https://github.com/fzaninotto))
* Fix multiple broken links in DataProviders doc ([alireza](https://github.com/alireza)-ahmadi)
* Fix missing resource in ArrayInput iterator ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated mention of `aor-embedded-array` in Ecosystem doc ([vascofg](https://github.com/vascofg))

## v2.0.3

* Add Russian translation package to the docs ([fzaninotto](https://github.com/fzaninotto))
* Add Indonesian translation package to the docs ([ronadi](https://github.com/ronadi))
* Add media to demo dashboard to make it better-looking ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Labeled>` to correctly passe `<FormControl>` props for full width and validation ([djhi](https://github.com/djhi))
* Fix `<ReferenceArrayInput>` and `<ReferenceInput>` so that the label correctly adds the * when required ([djhi](https://github.com/djhi))
* Fix AutocompleteInput documentation refers to outdated mui doc ([fzaninotto](https://github.com/fzaninotto))
* Fix mentions of REST client in the documentation ([fzaninotto](https://github.com/fzaninotto))
* Fix logout button icon padding ([fzaninotto](https://github.com/fzaninotto))
* Fix Bulk Actions button was clickable even with no row selected ([fzaninotto](https://github.com/fzaninotto))
* Fix global validation on TabbedForm ([fzaninotto](https://github.com/fzaninotto))
* Fix link for Saga debouncing doc ([dunglas](https://github.com/dunglas))
* Fix warning in GraphQL data provider with `<ReferenceField>` ([byymster](https://github.com/byymster))

## v2.0.2

* Fix bad lerna packaging ([fzaninotto](https://github.com/fzaninotto))

## v2.0.1

* Add Spanish translation package to the docs ([JonatanSalas](https://github.com/JonatanSalas))
* Fix `SelectArrayInput` `Chip` label should render same as selected menu item option ([jeromemacias](https://github.com/jeromemacias))
* Fix warnings when using `CheckboxGroupInput` into `ReferenceArrayInput` ([jeromemacias](https://github.com/jeromemacias))
* Fix proptype warning in custom `Login` form ([fzaninotto](https://github.com/fzaninotto))
* Fix override of link and cache parameter in `ra-data-graphql` ([terkiterje](https://github.com/terkiterje))
* Fix checkbox ripple height in `Datagrid` ([cherniavskii](https://github.com/cherniavskii))
* Fix infinite renders on forms due to validators not using memoization ([jpetitcolas](https://github.com/jpetitcolas))
* Fix warning in `SingleFieldList` ([fzaninotto](https://github.com/fzaninotto))
* Fix yarn.lock to match `packages.json` ([fzaninotto](https://github.com/fzaninotto))
* Fix select all checkbox selects rows twice ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in Inputs documentation ([afilp](https://github.com/afilp))
* Fix custom datagrid style fonction example ([afilp](https://github.com/afilp))

## v2.0.0

After 7 months of refactoring for better performance and easier overrides, we finally released the new major version of react-admin 🎉.

Thanks to all the contributors who made that possible!

Here are some hilghlights ✨:

* Upgrade to material-ui 1.0, react-router 4, React 16.3
* Use CSS-in-JS (JSS) for styling
* Undo button for edits and deletes
* Bulk actions
* Render props
* GraphQL as a first class citizen
* Embedded arrays
* Improved permissions handling
* Side effect support in custom actions
* Easier custom inputs
* Easier dependent inputs
* Asynchronous i18n
* Extra props passed transparently
* More implementation examples

For more details, read [the 2.0 release announcement blog post](https://marmelab.com/blog/2018/05/18/react-admin-2-0.html) on the marmelab blog.

There are many more features in 2.0, as well as all bug fixes from 1.x.

This new release is not backwards compatible with 1.x. Please refer to [the Upgrade guide](https://github.com/marmelab/react-admin/blob/master/UPGRADE.md) for directions on upgrading your code.

## v1.4.0

* Documentation: change extraction of status for AUTH_ERROR ([zifnab87](https://github.com/zifnab87))
* Add Slovak translation ([zavadpe](https://github.com/zavadpe))
* Documentation: Use standard es6 in docs and example ([djhi](https://github.com/djhi))
* Fix: Ensure validation custom messages without translation don't add warnings ([djhi](https://github.com/djhi))
* Fix: Ensure children are filtered when mapping on them ([djhi](https://github.com/djhi))
* Fix: Redirect to correct page after Delete ([alexisjanvier](https://github.com/alexisjanvier))
* Fix warnings in React 16 ([djhi](https://github.com/djhi))
* Documentation: Update CreateEdit.md for 'number' validation ([afilp](https://github.com/afilp))
* Fix Edit view refresh does not cancel changes ([djhi](https://github.com/djhi))
* Fix form default values can't be changed once mounted ([djhi](https://github.com/djhi))
* Documentation: Add a FAQ entry about unique child key in datagrid ([djhi](https://github.com/djhi))
* Documentation: Add explanation about dateInput and timezone ([alexisjanvier](https://github.com/alexisjanvier))
* Fix link color in reference field ([djhi](https://github.com/djhi))
* Fix: Cleanup example app code ([djhi](https://github.com/djhi))
* Fix default value for filter when source is a path with dot ([djhi](https://github.com/djhi))
* Fix WithPermissionsFilteredChildren should not put regular children in state ([djhi](https://github.com/djhi))
* Fix SimpleShowLayout should handle null children ([afilp](https://github.com/afilp))
* Fix Handle element cannot be fetched error ([alexisjanvier](https://github.com/alexisjanvier))
* Add 'options' to DisabledInput too ([afilp](https://github.com/afilp))
* Documentation: update example about addUploadCapabilities ([alexisjanvier](https://github.com/alexisjanvier))
* Fix List default pagination to avoid displaying NaN ([afilp](https://github.com/afilp))
* Fix SelectArrayInput ([djhi](https://github.com/djhi))
* Fix setState typo in SelectArrayInput ([natrim](https://github.com/natrim))
* Fix Example validation ([alauper](https://github.com/alauper))
* Documentation: update RefreshButton usage ([alexisjanvier](https://github.com/alexisjanvier))
* Fix - Refactor resources handling so that they are available for custom routes ([djhi](https://github.com/djhi))
* Documentation: Fix typo in example ([clementtalleu](https://github.com/clementtalleu))

## v1.3.4

* Add Croatian translation ([ariskemper](https://github.com/ariskemper))
* Add Indonesian translation ([ronadi](https://github.com/ronadi))
* Add Arabic translation ([aymendhaya](https://github.com/aymendhaya))
* Add Finnish translation ([Joni-Aaltonen](https://github.com/Joni-Aaltonen))
* Fix spelling of Labeled in documentation ([jyash97](https://github.com/jyash97))
* Fix documentation for Writing Actions ([danyalaytekin](https://github.com/danyalaytekin))
* Fix check that window exists before checking for devToolsExtension ([twDuke](https://github.com/twDuke))
* Fix missing key warning for SaveButton ([MadalenaGoncalves](https://github.com/MadalenaGoncalves))
* Fix RestClient example in documentation ([alexanderankin](https://github.com/alexanderankin))
* Fix documentation menu on mobile ([djhi](https://github.com/djhi))
* Add shadow under doc menu bar on mobile ([djhi](https://github.com/djhi))
* Fix SelectArrayInput by upgrade material-ui-chip-input ([djhi](https://github.com/djhi))
* Fix Bottom Toolbars on mobile ([djhi](https://github.com/djhi))
* Fix documentation, Prop name is validate not validation ([alauper](https://github.com/alauper))
* Fix AutocompleteInput does not render text for existing value on initial render ([hasghari](https://github.com/hasghari))
* Fix BooleanInput warning about uncontrolled to controlled component ([djhi](https://github.com/djhi))
* Fix title is not updated when record changes ([djhi](https://github.com/djhi))
* Fix vertical scroll issue on page on IE11 ([activist](https://github.com/activist))


## v1.3.3

* Add `aor-xmysql` to the list of REST clients ([soaserele](https://github.com/soaserele))
* Add Slovenian translation ([ariskemper](https://github.com/ariskemper))
* Fix wrong code sample in Translations docs ([fzaninotto](https://github.com/fzaninotto))
* Add `getResources` function to allow ressource injection in custom components ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in Actions documentation ([xiaomingplus](https://github.com/xiaomingplus))
* Add mention of `ra-component-factory` to the list of related packages ([zifnab87](https://github.com/zifnab87))
* Fix exception when using React 16 and hot reloading ([natrim](https://github.com/natrim))
* Fix custom menu documentation ([fzaninotto](https://github.com/fzaninotto))
* Fix installation documentation ([faviouz](https://github.com/faviouz))
* Fix typo in English translations ([netsgnut](https://github.com/netsgnut))
* Add a link to the updated Hebrew translations ([motro](https://github.com/motro))
* Fix linting problems ([fzaninotto](https://github.com/fzaninotto))
* Fix missing import in `<List>` documentation ([clementtalleu](https://github.com/clementtalleu))
* Fix Refresh button does not refresh data in `<ReferenceManyField>` ([fzaninotto](https://github.com/fzaninotto))
* Fix `refreshView` is undefined when using custom actions in list ([natrim](https://github.com/natrim))

## v1.3.2

* Fix JS error on `<WithPermission>` ([fzaninotto](https://github.com/fzaninotto))
* Fix tag filter in example post list ([ThieryMichel](https://github.com/ThieryMichel))
* Fix bad links to `Authorization` documentation sections ([djhi](https://github.com/djhi))
* Fix mention about a `<ReferenceManyInput>` ([djhi](https://github.com/djhi))
* Fix multiple `<ReferenceManyField>` on same resource with different filter ([ThieryMichel](https://github.com/ThieryMichel))
* Fix trailing slash in `<EditButton>` link ([ThieryMichel](https://github.com/ThieryMichel))
* Fix Optimistic rendering of List may create errors due to outdated data ([ThieryMichel](https://github.com/ThieryMichel))
* Fix documentation about `onTouchTap`, replaced by `onClick` ([djhi](https://github.com/djhi))
* Fix List button displayed in show view even when no List component defined ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `<AutocompleteInput>` can not be changed once a value is selected ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `<DateInput>` Filter first passed as `String`, then as `Date` ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `<FilterForm>` is not themable ([djhi](https://github.com/djhi))
* Fix typo in `<Admin>` component documentation ([than](https://github.com/than))
* Fix `<FileInputPreview>` is not themable ([djhi](https://github.com/djhi))
* Fix Custom App documentation ([kopax](https://github.com/kopax))
* Fix missing refresh of `<RadioButtonGroupInput>` ([michaelluk](https://github.com/michaelluk))
* Remove mention of `aor-permissions` from documentation ([djhi](https://github.com/djhi))
* Fix performance optimization in `<CreateButton>` ([natrim](https://github.com/natrim))
* Add mentions of `aor-embedded-array` and `aor-rest-client-router` packages to the doc ([MhdSyrwan](https://github.com/MhdSyrwan))

## v1.3.1

* Fix Delete actions fails on IE11 ([fzaninotto](https://github.com/fzaninotto))
* Fix npm package contains files from previous builds ([ArnaudD](https://github.com/ArnaudD))
* Fix default values handling for deep paths with dot notation ([djhi](https://github.com/djhi))
* Fix alwaysOn filters defaultValue being ignored ([djhi](https://github.com/djhi))
* Fix missing import in Authorization documentation ([Phocea](https://github.com/Phocea))
* Fix `<BooleanInput>` `onChange` with false value ([djhi](https://github.com/djhi))
* Fix missing `refresh` prop in `<List>` component ([djhi](https://github.com/djhi))
* Fix date filters ([djhi](https://github.com/djhi))
* Fix typo in custom actions documentation ([RWOverdijk](https://github.com/RWOverdijk))

## v.1.3.0

* Add permissions handling ([djhi](https://github.com/djhi))
* Add Not Found page ([fzaninotto](https://github.com/fzaninotto))
* Add support for layoutless custom routes ([marcw](https://github.com/marcw))
* Add support for custom validator messages ([fzaninotto](https://github.com/fzaninotto))
* Add support for nested filter object ([mtakayuki](https://github.com/mtakayuki))
* Add response body to HttpError ([marcw](https://github.com/marcw))
* Add ability to refresh views using a redux action ([djhi](https://github.com/djhi))
* Add `previousData` to `crudDelete` payload ([grahamlyus](https://github.com/grahamlyus))
* Add greek translation ([zifnab87](https://github.com/zifnab87))
* Add Ukrainian translation ([vitivs](https://github.com/vitivs))
* Upgrade dependencies (MUI 0.19, react in peer dependencies) ([djhi](https://github.com/djhi))
* Update the redux state structure to avoid name conflicts ([lutangar](https://github.com/lutangar))
* Update code formatting standard (prettier) ([fzaninotto](https://github.com/fzaninotto))
* Fix query string builder in REST clients ([mtakayuki](https://github.com/mtakayuki))
* Fix webpack file present in root directory ([fzaninotto](https://github.com/fzaninotto))
* Fix forms default values handling ([djhi](https://github.com/djhi))
* Fix `<SelectInput>` with `allowEmpty` throws key-warning ([fab1an](https://github.com/fab1an))
* Fix `onMenuTap` warning on medium and larger devices ([jf248](https://github.com/jf248))
* Fix links in documentation ([Phocea](https://github.com/Phocea))

## v1.2.3

* Add Epilogue REST client ([dunghuynh](https://github.com/dunghuynh))
* Fix `SelectInput` selection via keyboard ([djhi](https://github.com/djhi))
* Fix `fetchJson` to allow custom content type ([sGy1980de](https://github.com/sGy1980de))
* Fix `TabbedForm` errors being hidden for inactive tabs ([djhi](https://github.com/djhi))
* Fix `FileInput` handling when allowing only a single file ([djhi](https://github.com/djhi))
* Fix numeric validators for sero value ([djhi](https://github.com/djhi))
* Fix colors used for pagination chevrons ([djhi](https://github.com/djhi))
* Fix `SelectInput` Bidirectional binding ([djhi](https://github.com/djhi))
* Fix `FileInput` does not display error on validation error ([djhi](https://github.com/djhi))
* Add Danish translation ([SSA111](https://github.com/SSA111))
* Fix typo in tutorial ([melaniedavila](https://github.com/melaniedavila))
* Add Norwegian translation ([zeusbaba](https://github.com/zeusbaba))
* Fix checkboxes getting reordered when used with `ReferenceArrayInput` ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in Translation documentation ([dimitrovs](https://github.com/dimitrovs))

## v1.2.2

* Add yarn support ([dervos](https://github.com/dervos))
* Fix login form lock and loader ([teldosas](https://github.com/teldosas))
* Fix custom headers documentation ([fzaninotto](https://github.com/fzaninotto))
* Add support for numeric value in NumberInput step prop ([fzaninotto](https://github.com/fzaninotto))
* Add documentation for admin history prop ([fzaninotto](https://github.com/fzaninotto))
* Fix doc for ISO date input ([leesei](https://github.com/leesei))
* Fix wrong use of the 'Edition' word across the documentation ([cornhundred](https://github.com/cornhundred))
* Fix typo in tutorial ([cornhundred](https://github.com/cornhundred))
* Fix typo in RestClients documentation ([arlair](https://github.com/arlair))
* Add farsi translation package ([hamidfzm](https://github.com/hamidfzm))
* Fix translation warning on `TabbedShowLayout`'s tab names ([freeznet](https://github.com/freeznet))
* Fix typo in Authentication documentation ([RWOverdijk](https://github.com/RWOverdijk))
* Fix typo in CreateEdit documentation ([RWOverdijk](https://github.com/RWOverdijk))
* Add Turkish translation package ([ismailbaskin](https://github.com/ismailbaskin))

## v1.2.1

* Fix multi select in `FileInput` ([doananh234](https://github.com/doananh234))
* Fix `RadioButtonGroupInput` label translation ([lucasfevi](https://github.com/lucasfevi))
* Fix `TabbedForm` `initialValues` gathering ([djhi](https://github.com/djhi))
* Fix `ReferenceFields` label hidden on the top of field ([philippe-cleany](https://github.com/philippe-cleany))
* Fix `ReferenceArrayField` used with `Datagrid` child ([fzaninotto](https://github.com/fzaninotto))
* Fix custom saga documentation ([fzaninotto](https://github.com/fzaninotto))
* Add Code of conduct ([fzaninotto](https://github.com/fzaninotto))
* Fix documentation on `ReferenceArrayList` ([vmattos](https://github.com/vmattos))

## v1.2.0

Read the [v1.1 and v1.2 announcement on the marmelab blog](https://marmelab.com/blog/2017/06/29/admin-on-rest-1-2.html).

* Add ability to override redirect behavior on save for `<Create>` and `<Edit>` views ([wesley6j](https://github.com/wesley6j))
* Add refresh button to `<Show>` view ([djhi](https://github.com/djhi))
* Add asterisk to label on required `Input` ([djhi](https://github.com/djhi))
* Add `<FileInput>` ([djhi](https://github.com/djhi))
* Add sort feature to `<ReferenceManyField>` ([wesley6j](https://github.com/wesley6j))
* Add ability to use custom history in `<Admin>` ([fzaninotto](https://github.com/fzaninotto))
* Add `<TabbedShowLayout>` to mirror `<TabbedForm>` ([remi13131](https://github.com/remi13131))
* Add `options` prop to `<BooleanInput>` and pass them to mui `<Toggle>` ([djhi](https://github.com/djhi))
* Add `AOR/` prefix to Redux actions ([ThieryMichel](https://github.com/ThieryMichel))
* Add deep path support for `optionText` and `optionValue` props the `Input` components used as `Reference` children ([mtakayuki](https://github.com/mtakayuki))
* Add ability to override `<SimpleShowLayout>` container styles ([djhi](https://github.com/djhi))
* Add `<MenuItemLink>` to fix bad click handling of menu on mobile ([djhi](https://github.com/djhi))
* Add `aor-firebase-client` to the list of REST clients ([sidferreira](https://github.com/sidferreira))
* Update redux-saga to 0.15.3 ([dervos](https://github.com/dervos))
* Fix filter in `<ReferenceInput>` not taken into account when `<AutocompleteInput>` is filled ([djhi](https://github.com/djhi))
* Fix `<ReferenceArrayField>` when ids is null ([wesley6j](https://github.com/wesley6j))
* Fix missing translation helper in `<Show>` view ([djhi](https://github.com/djhi))
* Fix code highlighting on REAMDE ([diegohaz](https://github.com/diegohaz))
* Fix custom REST client list format for better readability ([fzaninotto](https://github.com/fzaninotto))

## v1.1.2

* Fix a typo in tutorial ([calebhaye](https://github.com/calebhaye))
* Add Polish translation ([KamilDzierbicki](https://github.com/KamilDzierbicki))
* Fix a typo in tutorial ([ferhatelmas](https://github.com/ferhatelmas))
* Fix `<SelectArrayInput>` default value for filters ([djhi](https://github.com/djhi))
* Add Thai translation ([liverbool](https://github.com/liverbool))
* Fix duplicate `resource` propType in `<FilterButton>` ([thiagoterleski](https://github.com/thiagoterleski))
* Fix `<SelectArrayInput>` example usage in tags for post ([wesley6j](https://github.com/wesley6j))
* Fix `<List>` layout on mobile ([sebastien-cleany](https://github.com/sebastien-cleany))

## v1.1.1

* Add Show view documentation ([djhi](https://github.com/djhi))
* Split Admin and Resource docs for better readability ([fzaninotto](https://github.com/fzaninotto))
* Fix flaky end-to-end tests ([dervos](https://github.com/dervos))
* Fix `<DisabledInput>` not showing default value ([wesley6j](https://github.com/wesley6j))
* Fix `<SelectArrayInput>` prop types ([floo51](https://github.com/floo51))
* Fix `<DateInput>` for some locales ([wesley6j](https://github.com/wesley6j))
* Fix support for null and false value in `<SelectInput>` options ([wesley6j](https://github.com/wesley6j))
* Fix missing `<FileInput>` mention in documentation reference ([djhi](https://github.com/djhi))
* Fix duplicate documentation in Ecosystem ([djhi](https://github.com/djhi))
* Fix typos on Theming documentation ([martjanz](https://github.com/martjanz))

## v1.1.0

* Add `<ReferenceArrayInput>` and `<SelectArrayInput>` ([kimkha](https://github.com/kimkha) and [fzaninotto](https://github.com/fzaninotto))
* Add `<ReferenceArrayField>` ([leesei](https://github.com/leesei) and [fzaninotto](https://github.com/fzaninotto))
* Add payload to `USER_LOGIN_SUCCESS` action, using the `AUTH_LOGIN` response from the authClient ([SidFerreira](https://github.com/SidFerreira))
* Add reset state after logout ([bodo22](https://github.com/bodo22))
* Add ability to disable submit on enter in `<SimpleForm>` and `<TabbedForm>` ([jkrnak](https://github.com/jkrnak))
* Add integer casting to pagination params ([grahamlyus](https://github.com/grahamlyus))
* Add `elStyle` prop to `<DisabledInput>` ([wesley6j](https://github.com/wesley6j))
* Add Frequently Asked Questions (FAQ) to the documentation ([djhi](https://github.com/djhi))
* Add Ecosystem to the documentation ([djhi](https://github.com/djhi))
* Add Swedish translation ([StefanWallin](https://github.com/StefanWallin))
* Fix filters with dot notation not properly cleared ([djhi](https://github.com/djhi))
* Fix show (edit) button in Edit (Show) page on initial load ([wesley6j](https://github.com/wesley6j))
* Fix defaultValue typo in blog example ([wesley6j](https://github.com/wesley6j))

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

Read the [v1.0 announcement on the marmelab blog](https://marmelab.com/blog/2017/04/26/admin-on-rest-1-0.html).

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

Read the [v0.9 announcement on the marmelab blog](https://marmelab.com/blog/2017/03/10/admin-on-rest-0-9.html)

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
