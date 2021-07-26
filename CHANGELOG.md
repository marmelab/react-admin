# Changelog

## v3.17.0

* Add support for image path value in `<SimpleList leftAvatar>` ([6418](https://github.com/marmelab/react-admin/pull/6418)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to hide Input labels with `label={false}` ([6381](https://github.com/marmelab/react-admin/pull/6381)) ([VikrantShirvankar](https://github.com/VikrantShirvankar))
* Add links to the `<Error>` page to help troubleshooting ([6367](https://github.com/marmelab/react-admin/pull/6367)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to redirect to a custom page on logout ([6326](https://github.com/marmelab/react-admin/pull/6326)) ([andrico1234](https://github.com/andrico1234))
* Add `useList`, a way to reuse the list pagination/sorting/filtering client-side logic ([6321](https://github.com/marmelab/react-admin/pull/6321)) ([6378](https://github.com/marmelab/react-admin/pull/6378)) ([djhi](https://github.com/djhi))
* Add `<SimpleFormIterator>` label function ([6305](https://github.com/marmelab/react-admin/pull/6305)) ([iamstiil](https://github.com/iamstiil))

## v3.16.6

* Fix `<Empty>` component isn't properly exported ([6419](https://github.com/marmelab/react-admin/pull/6419)) ([djhi](https://github.com/djhi))

## v3.16.5

* Fix "Deprecated findDOMNode" warning in StrictMode ([6398](https://github.com/marmelab/react-admin/pull/6398)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DateTimeInput>` does not include timezone for initialValue ([6401](https://github.com/marmelab/react-admin/pull/6401)) ([djhi](https://github.com/djhi))
* Fix `<TranslatableInputs>` ignores child input label ([6415](https://github.com/marmelab/react-admin/pull/6415)) ([mjomble](https://github.com/mjomble))
* Fix `<Empty>` component isn't exported ([6416](https://github.com/marmelab/react-admin/pull/6416)) ([djhi](https://github.com/djhi))
* [Demo] Improve dataProvider logging in GraphQL demo ([6405](https://github.com/marmelab/react-admin/pull/6405)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add mention of `<RichTextInput>` display bug and userland fix ([6403](https://github.com/marmelab/react-admin/pull/6403)) ([fzaninotto](https://github.com/fzaninotto))

## v3.16.4

* [Demo] Optimize data loading in e-commerce demo ([6392](https://github.com/marmelab/react-admin/pull/6392)) ([djhi](https://github.com/djhi))
* [Demo] Fix CRM demo points to bad source file ([6389](https://github.com/marmelab/react-admin/pull/6389)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix a typo in main Readme ([6390](https://github.com/marmelab/react-admin/pull/6390)) ([aminetakha](https://github.com/aminetakha))
* [Doc] Fix incomplete side effect hooks documentation ([6388](https://github.com/marmelab/react-admin/pull/6388)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix misleading explanation of `<List syncWithLocation>` prop ([6385](https://github.com/marmelab/react-admin/pull/6385)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ListBase>` snippet doesn't explain how to override the title ([6383](https://github.com/marmelab/react-admin/pull/6383)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix wrong ending tags in Actions documentation  ([6382](https://github.com/marmelab/react-admin/pull/6382)) ([Cornul11](https://github.com/Cornul11))

## v3.16.3

* Fix `useInput` incorrectly sets default value for numbers ([6374](https://github.com/marmelab/react-admin/pull/6374)) ([djhi](https://github.com/djhi))
* [Doc] Fix `<Show aside>` prop format is component instead of element ([6376](https://github.com/marmelab/react-admin/pull/6376)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Improve ListActions override ([6218](https://github.com/marmelab/react-admin/pull/6218)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix code snippet in custom field example ([6365](https://github.com/marmelab/react-admin/pull/6365)) ([neps-in](https://github.com/neps-in))
* [Doc] Add ra-data-eve to DataProviders chapter ([6362](https://github.com/marmelab/react-admin/pull/6362)) ([smeng9](https://github.com/smeng9))

## v3.16.2

* Fix window title is replaced by page title  ([6357](https://github.com/marmelab/react-admin/pull/6357)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add architecture decisions chapter ([6356](https://github.com/marmelab/react-admin/pull/6356)) ([fzaninotto](https://github.com/fzaninotto))

## v3.16.1

* Fix `<Filter>` calls `getList` on change even when input is invalid ([6339](https://github.com/marmelab/react-admin/pull/6339)) ([fzaninotto](https://github.com/fzaninotto))
* Fix filter with default value false is not working ([6338](https://github.com/marmelab/react-admin/pull/6338)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix type mismatch error on `title` prop for page components ([6351](https://github.com/marmelab/react-admin/pull/6351)) ([megantaylor](https://github.com/megantaylor))
* [TypeScript] Fix `<Toolbar width>` prop type ([6343](https://github.com/marmelab/react-admin/pull/6343)) ([djhi](https://github.com/djhi))
* [TypeScript] Add generic support for `usePermissions` hook ([6329](https://github.com/marmelab/react-admin/pull/6329)) ([andrei9669](https://github.com/andrei9669))
* [Doc] Fix `ra-test` docs test case label ([6354](https://github.com/marmelab/react-admin/pull/6354)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* [Doc] Fix missing `import` in `CreateEdit` tutorial ([6349](https://github.com/marmelab/react-admin/pull/6349)) ([AlessandroMinoccheri](https://github.com/AlessandroMinoccheri))
* [Doc] Add demos page ([6334](https://github.com/marmelab/react-admin/pull/6334)) ([fzaninotto](https://github.com/fzaninotto))

## v3.16.0

* Update window title on page change ([6119](https://github.com/marmelab/react-admin/pull/6119)) ([andrico1234](https://github.com/andrico1234))
* Expose `refetch` in hooks and components ([6237](https://github.com/marmelab/react-admin/pull/6237)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to set location state via `useRedirect` ([6293](https://github.com/marmelab/react-admin/pull/6293)) ([despatates](https://github.com/despatates))
* Disable `<SaveButton/>` while Inputs are being validated asynchronously ([6288](https://github.com/marmelab/react-admin/pull/6288)) ([WiXSL](https://github.com/WiXSL))
* Thrown an error when using a Reference field without the associated Resource ([6266](https://github.com/marmelab/react-admin/pull/6266)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<BulkUpdateButton>` component ([6072](https://github.com/marmelab/react-admin/pull/6072)) ([WiXSL](https://github.com/WiXSL))
* Fix logout button appears in two different menus ([6230](https://github.com/marmelab/react-admin/pull/6230)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` choice creation support ([6328](https://github.com/marmelab/react-admin/pull/6328)) ([djhi](https://github.com/djhi))
* Fix `useGetMany` loaded state ([6319](https://github.com/marmelab/react-admin/pull/6319)) ([djhi](https://github.com/djhi))
* Fix `<DatagridRow>` nb columns computation occurs too often ([6307](https://github.com/marmelab/react-admin/pull/6307)) ([WiXSL](https://github.com/WiXSL))
* Fix errors and warnings in tests ([6299](https://github.com/marmelab/react-admin/pull/6299)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Add `UserMenuProps` type ([6320](https://github.com/marmelab/react-admin/pull/6320)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `TabbedShowLayoutProps`'s `tabs` should be optional ([6310](https://github.com/marmelab/react-admin/pull/6310)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Add the ability to type `<SimpleList>` callbacks ([6254](https://github.com/marmelab/react-admin/pull/6254)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix wrong link in Fields documentation ([6325](https://github.com/marmelab/react-admin/pull/6325)) ([Cornul11](https://github.com/Cornul11))
* [Doc] Fix CHANGELOG glitches ([6311](https://github.com/marmelab/react-admin/pull/6311)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Update Polish translation maintainer ([6297](https://github.com/marmelab/react-admin/pull/6297)) ([Tymek](https://github.com/Tymek))
* [Doc] Fix mention of non-existent `fullWith` attribute in `<SelectArrayInput>` ([6291](https://github.com/marmelab/react-admin/pull/6291)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add data example for ra-simple-rest ([6278](https://github.com/marmelab/react-admin/pull/6278)) ([karltaylor](https://github.com/karltaylor))
* [Lab] ra-no-code - Introduce Resource Configuration ([6217](https://github.com/marmelab/react-admin/pull/6217)) ([djhi](https://github.com/djhi))
* [Lab] ra-no-code - Introduce ApplicationsDashboard ([6221](https://github.com/marmelab/react-admin/pull/6221)) ([djhi](https://github.com/djhi))
* [Lab] ra-no-code - Add support for simple references ([6246](https://github.com/marmelab/react-admin/pull/6246)) ([djhi](https://github.com/djhi))

## v3.15.2

* Fix performance regression causing unnecessary redraws ([6285](https://github.com/marmelab/react-admin/pull/6285)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing `margin` prop in several Labeled components ([6282](https://github.com/marmelab/react-admin/pull/6282)) ([WiXSL](https://github.com/WiXSL))
* Fix `defaultValue` and `initialValue` props don't work in Edit views ([6272](https://github.com/marmelab/react-admin/pull/6272)) ([djhi](https://github.com/djhi))
* Fix performance of `<Layout>` rerenders ([6264](https://github.com/marmelab/react-admin/pull/6264)) ([WiXSL](https://github.com/WiXSL))
* Fix `useQueryWithStore` outputs incorrect `loaded` field when `enabled` is false ([6262](https://github.com/marmelab/react-admin/pull/6262)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix wrong return value in custom validator example ([6296](https://github.com/marmelab/react-admin/pull/6296)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix hook name in on-the-fly choice creation examples for `<SelectInput>` and `<AutocompleteInput>` ([6286](https://github.com/marmelab/react-admin/pull/6286)) ([andrico1234](https://github.com/andrico1234))
* [Doc] Fix bad readability of `<ReferenceInput>` examples ([6281](https://github.com/marmelab/react-admin/pull/6281)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<TestContext>` JSDoc ([6276](https://github.com/marmelab/react-admin/pull/6276)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing reference to `success` notification type in `useNotify()` hook documentation ([6273](https://github.com/marmelab/react-admin/pull/6273)) ([WiXSL](https://github.com/WiXSL))

## v3.15.1

* Add CRM example ([6242](https://github.com/marmelab/react-admin/pull/6242)) ([fzaninotto](https://github.com/fzaninotto))
* Fix logout button appears in two different menus ([6230](https://github.com/marmelab/react-admin/pull/6230)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SkipNavigationButton>` component isn't exported ([6263](https://github.com/marmelab/react-admin/pull/6263)) ([WiXSL](https://github.com/WiXSL))
* Fix `useMutation` internal test syntax ([6261](https://github.com/marmelab/react-admin/pull/6261)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AutocompleteArrayInput optionText>` when used with a function value ([6256](https://github.com/marmelab/react-admin/pull/6256)) ([djhi](https://github.com/djhi))
* Fix `useQueryWithStore` returns `loading=true` when `enabled` is `false` ([6249](https://github.com/marmelab/react-admin/pull/6249)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `<SelectField>` doesn't accept `<Typography>` props ([6253](https://github.com/marmelab/react-admin/pull/6253)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix missing translation item `create_item` ([6248](https://github.com/marmelab/react-admin/pull/6248)) ([Aikain](https://github.com/Aikain))
* [Doc] Fix typos in `useDelete` and `useDeleteMany` JsDocs examples ([6260](https://github.com/marmelab/react-admin/pull/6260)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `useDelete` and `useUpdate` JsDocs examples ([6238](https://github.com/marmelab/react-admin/pull/6238)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `dataProvider` hooks incorrectly document error state as `loaded=true` instead of `false` ([6252](https://github.com/marmelab/react-admin/pull/6252)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix minor typos in `<FileInput>` and `<ImageInput>` props description ([6243](https://github.com/marmelab/react-admin/pull/6243)) ([olliebennett](https://github.com/olliebennett))

## v3.15.0

* Add support for quick choice creation in `<SelectInput>`, `<AutocompleteInput>`, `<SelectArrayInput>`, and `<AutocompleteArrayInput>` ([6215](https://github.com/marmelab/react-admin/pull/6215)) ([djhi](https://github.com/djhi))
* Add ability to call specialized `dataProvider` hooks with specialized parameters ([6168](https://github.com/marmelab/react-admin/pull/6168)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to `refetch` a query in `useQuery` and `useQueryWithStore` ([6130](https://github.com/marmelab/react-admin/pull/6130)) ([djhi](https://github.com/djhi))
* Add `<Datagrid empty>` prop to display column headers even on empty lists ([6164](https://github.com/marmelab/react-admin/pull/6164)) ([andrico1234](https://github.com/andrico1234))
* Add `<AppBar container>` props to override the root App Bar element ([6178](https://github.com/marmelab/react-admin/pull/6178)) ([WiXSL](https://github.com/WiXSL))
* Add `<RouteWithoutLayout>` component to enable TS-compatible custom routes with `noLayout` ([6158](https://github.com/marmelab/react-admin/pull/6158)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for truthy/falsy values in `<BooleanField>` ([6027](https://github.com/marmelab/react-admin/pull/6027)) ([WiXSL](https://github.com/WiXSL))
* Add `customReducers` to `<TestContext>` ([6067](https://github.com/marmelab/react-admin/pull/6067)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* Fix custom mutators crash `<SimpleForm>` and `<TabbedForm>` ([6209](https://github.com/marmelab/react-admin/pull/6209)) ([WiXSL](https://github.com/WiXSL))
* Fix `hideFilter` called repeatedly only registers the last call ([6226](https://github.com/marmelab/react-admin/pull/6226)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning in `<UrlField>` when value is nullish and `emptyText` is empty ([6176](https://github.com/marmelab/react-admin/pull/6176)) ([OoDeLally](https://github.com/OoDeLally))
* [Doc] Fix typo in example of `<SaveButton disabled>` handling ([6232](https://github.com/marmelab/react-admin/pull/6232)) ([SleepWalker](https://github.com/SleepWalker))
* Fix `undoable` prop behavior ([6153](https://github.com/marmelab/react-admin/pull/6153)) ([ThieryMichel](https://github.com/ThieryMichel))
* [Doc] Fix custom `<DatagridRow>` example ([6223](https://github.com/marmelab/react-admin/pull/6223)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Export `PublicFieldProps` and `InjectedFieldProps` types (so devs can use them to define their own field components) ([6219](https://github.com/marmelab/react-admin/pull/6219)) ([jtomaszewski](https://github.com/jtomaszewski))
* [TypeScript] Fix `useMutation` requires payload argument ([6182](https://github.com/marmelab/react-admin/pull/6182)) ([jtomaszewski](https://github.com/jtomaszewski))
* [Lab] Bootstrap `ra-no-code` package ([6211](https://github.com/marmelab/react-admin/pull/6211)) ([djhi](https://github.com/djhi))

## v3.14.5

* Fix `<DateIpnut>` and `<DateTimeInput>` are broken on Safari ([6199](https://github.com/marmelab/react-admin/pull/6199)) ([djhi](https://github.com/djhi))
* Fix `<Notification>` undo button's color on success type ([6193](https://github.com/marmelab/react-admin/pull/6193)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Publish `data-generator typings` ([6204](https://github.com/marmelab/react-admin/pull/6204)) ([floo51](https://github.com/floo51))
* [TypeScript] Fix `ra-data-local-storage` types ([6203](https://github.com/marmelab/react-admin/pull/6203)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix view action component types aren't exported ([6200](https://github.com/marmelab/react-admin/pull/6200)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix sidebar width type in application theme ([6197](https://github.com/marmelab/react-admin/pull/6197)) ([jtomaszewski](https://github.com/jtomaszewski))
* [Doc] Add OData data provider ([6206](https://github.com/marmelab/react-admin/pull/6206)) ([jvert](https://github.com/jvert))
* [Doc] Update tutorial images ([6205](https://github.com/marmelab/react-admin/pull/6205)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix custom fields documentation doesn't use `useRecordContext` ([6201](https://github.com/marmelab/react-admin/pull/6201)) ([djhi](https://github.com/djhi))

## v3.14.4

* Fix `useGetMany` does not respect the `enabled` option ([6188](https://github.com/marmelab/react-admin/pull/6188)) ([djhi](https://github.com/djhi))
* Fix 'Cannot set property validating of undefined' error when conditionally rendering a form component ([6186](https://github.com/marmelab/react-admin/pull/6186)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `useWarnWhenUsavedChanges` fails on nested fields ([6185](https://github.com/marmelab/react-admin/pull/6185)) ([djhi](https://github.com/djhi))
* Fix warning when using `<BulkDeleteButton>` without props ([6165](https://github.com/marmelab/react-admin/pull/6165)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Menu icon isn't aligned with the sidebar icons ([6161](https://github.com/marmelab/react-admin/pull/6161)) ([JayKaku](https://github.com/JayKaku))
* Fix missing query string after successful login ([6129](https://github.com/marmelab/react-admin/pull/6129)) ([makbol](https://github.com/makbol))
* [Doc] Add link to Google Sheet data provider ([6187](https://github.com/marmelab/react-admin/pull/6187)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix missing documentation about the ResourceContext ([6183](https://github.com/marmelab/react-admin/pull/6183)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix broken link to source in Testing Permissions documentation ([6181](https://github.com/marmelab/react-admin/pull/6181)) ([YashJipkate](https://github.com/YashJipkate))
* [Doc] Fix typo in `<FormDataConsumer>` usage JSDoc ([6169](https://github.com/marmelab/react-admin/pull/6169)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `withDataProvider` hook example ([6160](https://github.com/marmelab/react-admin/pull/6160)) ([f-jost](https://github.com/f-jost))
* [Doc] Fix outdated link for Swedish translation ([6156](https://github.com/marmelab/react-admin/pull/6156)) ([kolben](https://github.com/kolben))

## v3.14.3

* Fix `<Field textAlign>` prop doesn't accept value `center` ([6152](https://github.com/marmelab/react-admin/pull/6152)) ([WiXSL](https://github.com/WiXSL))
* Fix runtime warnings when `<SimpleList>` displays skeleton while loading ([6146](https://github.com/marmelab/react-admin/pull/6146)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useRedirect` does not handle query strings ([6145](https://github.com/marmelab/react-admin/pull/6145)) ([fzaninotto](https://github.com/fzaninotto))
* Fix logout notification may appear more than once ([6144](https://github.com/marmelab/react-admin/pull/6144)) ([fzaninotto](https://github.com/fzaninotto))
* Fix submit errors cannot have translation arguments ([6140](https://github.com/marmelab/react-admin/pull/6140)) ([djhi](https://github.com/djhi))
* Fix `<RadioButtonGroupInput>` emits runtime warnings ([6139](https://github.com/marmelab/react-admin/pull/6139)) ([djhi](https://github.com/djhi))
* Fix `<ArrayInput>` validation ([6136](https://github.com/marmelab/react-admin/pull/6136)) ([djhi](https://github.com/djhi))
* Fix `<Datagrid>` logs a warning about invalid prop `hasBulkActions` of type `array` ([6122](https://github.com/marmelab/react-admin/pull/6122)) ([RoBYCoNTe](https://github.com/RoBYCoNTe))
* [TypeScript] Fix minor type errors in `ra-ui-material-ui` and `validate` ([6147](https://github.com/marmelab/react-admin/pull/6147)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<Labeled>` documentation is missing `resource` and `source` props usage ([6138](https://github.com/marmelab/react-admin/pull/6138)) ([djhi](https://github.com/djhi))
* [Doc] Add illustration for the `<Aside>` component ([6132](https://github.com/marmelab/react-admin/pull/6132)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add link to `ra-acl` auth package ([6123](https://github.com/marmelab/react-admin/pull/6123)) ([andrico1234](https://github.com/andrico1234))

## v3.14.2

* Fix `<Datagrid>` requires too many props when used standalone ([6115](https://github.com/marmelab/react-admin/pull/6115)) ([fzaninotto](https://github.com/fzaninotto))
* Fix console warnings from `<Error>` component ([6114](https://github.com/marmelab/react-admin/pull/6114)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<UserMenu>` hides the scrollbar ([6113](https://github.com/marmelab/react-admin/pull/6113)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<UserMenu>` dropdown positioning ([6105](https://github.com/marmelab/react-admin/pull/6105)) ([djhi](https://github.com/djhi))
* Fix `<Admin customRoutes>` aren't used when the resources are empty ([6112](https://github.com/marmelab/react-admin/pull/6112)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ra-ui-material-ui` dependency version on `ra-core` ([6111](https://github.com/marmelab/react-admin/pull/6111)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix missing import in `ra-core` hook utils ([6071](https://github.com/marmelab/react-admin/pull/6071)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<TabbedForm syncWithLocation>` example ([6097](https://github.com/marmelab/react-admin/pull/6097)) ([djhi](https://github.com/djhi))

## v3.14.1

* Fix performance regression ([6096](https://github.com/marmelab/react-admin/pull/6096)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `<SingleFieldList component>` doesn't accept string components ([6094](https://github.com/marmelab/react-admin/pull/6094)) ([fzaninotto](https://github.com/fzaninotto))

## v3.14.0

* Add ability to use `record` from context in `Field` components ([5995](https://github.com/marmelab/react-admin/pull/5995)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<Datagrid isRowExpandable` prop ([5941](https://github.com/marmelab/react-admin/pull/5941)) ([WiXSL](https://github.com/WiXSL))
* Add `useResourceLabel` hook ([6016](https://github.com/marmelab/react-admin/pull/6016)) ([djhi](https://github.com/djhi))
* Add ability to use an element as label in `<FormTab>` ([6061](https://github.com/marmelab/react-admin/pull/6061)) ([WiXSL](https://github.com/WiXSL))
* Add ability to use an element as label in `<FilterListItem>` ([6034](https://github.com/marmelab/react-admin/pull/6034)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to call `useGetList` without pagination, sort, or filter params ([6056](https://github.com/marmelab/react-admin/pull/6056)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to omit `basePath` in buttons ([6041](https://github.com/marmelab/react-admin/pull/6041)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to omit `basePath` in Reference fields ([6028](https://github.com/marmelab/react-admin/pull/6028)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `<SingleFieldList component>` ([6036](https://github.com/marmelab/react-admin/pull/6036)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `<Labeled fullWidth>` ([6089](https://github.com/marmelab/react-admin/pull/6089)) ([seniorquico](https://github.com/seniorquico))
* Add support for `<ArrayInput helperText>` ([6062](https://github.com/marmelab/react-admin/pull/6062)) ([WiXSL](https://github.com/WiXSL))
* Add debounce to `<AutocompleteArrayInput>` `setFilter` call ([6003](https://github.com/marmelab/react-admin/pull/6003)) ([djhi](https://github.com/djhi))
* Add `success` notification type ([5961](https://github.com/marmelab/react-admin/pull/5961)) ([WiXSL](https://github.com/WiXSL))
* Add support for a React element as `<Confirm content` prop value ([5954](https://github.com/marmelab/react-admin/pull/5954)) ([andrico1234](https://github.com/andrico1234))
* Fix refresh strategy to avoid empty page while refreshing ([6054](https://github.com/marmelab/react-admin/pull/6054)) ([fzaninotto](https://github.com/fzaninotto))
* Fix performance issue in forms with many validators ([6092](https://github.com/marmelab/react-admin/pull/6092)) ([djhi](https://github.com/djhi))
* Fix `<ReferenceArrayField>` passes empty data to child when loaded ([6080](https://github.com/marmelab/react-admin/pull/6080)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in private variable name in `useGetList` code ([6069](https://github.com/marmelab/react-admin/pull/6069)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix `ra-input-rich-text` is missing types ([6093](https://github.com/marmelab/react-admin/pull/6093)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `<SimpleList>` and other list components can't be used without context ([6090](https://github.com/marmelab/react-admin/pull/6090)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Export more types for `ra-ui-materialui` Input components props ([6086](https://github.com/marmelab/react-admin/pull/6086)) ([tdnl](https://github.com/tdnl))
* [TypeScript] Fix typo in `<FormWithRedirect>` props types ([6085](https://github.com/marmelab/react-admin/pull/6085)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix type definition for `<Datagrid rowClick>` prop doesn't allow for functions that return a Promise ([6060](https://github.com/marmelab/react-admin/pull/6060)) ([jvert](https://github.com/jvert))
* [Doc] Fix error in snippet for custom error page ([6091](https://github.com/marmelab/react-admin/pull/6091)) ([danangekal](https://github.com/danangekal))
* [Doc] Fix installation snippet for `'ra-data-local-storage` ([6083](https://github.com/marmelab/react-admin/pull/6083)) ([luoxi](https://github.com/luoxi))

## v3.13.5

* Fix `<FilterLiveSearch>` looses its value upon navigation ([6066](https://github.com/marmelab/react-admin/pull/6066)) ([djhi](https://github.com/djhi))
* Fix `<AutocompleteInput>` and `<AutocompletearrayInput>` options appear behind Dialog ([6065](https://github.com/marmelab/react-admin/pull/6065)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DeleteWithConfirmButton>` propagates click event down to `<DatagridRow>` ([6063](https://github.com/marmelab/react-admin/pull/6063)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceInput>` incorrectly sets the `total` value ([6058](https://github.com/marmelab/react-admin/pull/6058)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix `useGetList` return type assumes `data` and `ids` are possibly `undefined` ([6053](https://github.com/marmelab/react-admin/pull/6053)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `useRecordContext` doesn't work without props ([6046](https://github.com/marmelab/react-admin/pull/6046)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix various typos and doc anchors ([6059](https://github.com/marmelab/react-admin/pull/6059)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing newline in Inputs chapter ([6064](https://github.com/marmelab/react-admin/pull/6064)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<Admin ready>` prop doesn't appear in the side navigation ([6048](https://github.com/marmelab/react-admin/pull/6048)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `bulkActionButtons` documentation ([6043](https://github.com/marmelab/react-admin/pull/6043)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `react-admin` package README is out of date ([6042](https://github.com/marmelab/react-admin/pull/6042)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix outdated indonesian translation ([5937](https://github.com/marmelab/react-admin/pull/5937)) ([danangekal](https://github.com/danangekal))

## v3.13.4

* Fix Go to definition goes to the compiled code in VSCode ([6039](https://github.com/marmelab/react-admin/pull/6039)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RecordContext>` and `useRecordContext` internal representation ([6038](https://github.com/marmelab/react-admin/pull/6038)) ([djhi](https://github.com/djhi))
* Fix simple example in Webpack version (for CodeSandbox) ([6037](https://github.com/marmelab/react-admin/pull/6037)) ([djhi](https://github.com/djhi))
* Fix `actions={false}` in a View component throws a runtime warning ([6033](https://github.com/marmelab/react-admin/pull/6033)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Admin>` with no i18nProvider logs warnings for missing translations ([6032](https://github.com/marmelab/react-admin/pull/6032)) ([fzaninotto](https://github.com/fzaninotto))
* Fix duplicated export in `ra-ui-materialui` Form components ([6030](https://github.com/marmelab/react-admin/pull/6030)) ([adrien-may](https://github.com/adrien-may))
* [TypeScript] Fix cannot pass custom appbar to Layout ([6035](https://github.com/marmelab/react-admin/pull/6035)) ([yasharzolmajdi](https://github.com/yasharzolmajdi))
* [Doc] Fix missing mention of `<Labeled>` in Fields doc ([6040](https://github.com/marmelab/react-admin/pull/6040)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Synchronize Readme files ([5994](https://github.com/marmelab/react-admin/pull/5994)) ([WiXSL](https://github.com/WiXSL))

## v3.13.3

* Fix `<SortButton>` labels must have a valid translation message ([6029](https://github.com/marmelab/react-admin/pull/6029)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useRecordSelection` function name ([6021](https://github.com/marmelab/react-admin/pull/6021)) ([WiXSL](https://github.com/WiXSL))
* Fix warnings about missing props when using `<List>` as a standalone component ([6017](https://github.com/marmelab/react-admin/pull/6017)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Form looses dirty field values after cancelling navigation ([6005](https://github.com/marmelab/react-admin/pull/6005)) ([djhi](https://github.com/djhi))
* [Doc] Fix CHANGELOG typos ([6018](https://github.com/marmelab/react-admin/pull/6018)) ([WiXSL](https://github.com/WiXSL))

## v3.13.2

* Fix `<NullabelBooleanInput>` ignores `defaultValue` prop ([6002](https://github.com/marmelab/react-admin/pull/6002)) ([djhi](https://github.com/djhi))
* Fix error when missing field type in `ra-data-graphql-simple` ([5999](https://github.com/marmelab/react-admin/pull/5999)) ([Kilometers42](https://github.com/Kilometers42))
* Fix `<TabbedForm>` tab headers don't turn red on validation error ([5984](https://github.com/marmelab/react-admin/pull/5984)) ([djhi](https://github.com/djhi))
* Fix validate on submit doesn't reset validation errors ([5962](https://github.com/marmelab/react-admin/pull/5962)) ([alanpoulain](https://github.com/alanpoulain))
* Fix forward compatibility between react-admin packages ([5989](https://github.com/marmelab/react-admin/pull/5989)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<TabbedFormView>` component isn't exported ([6011](https://github.com/marmelab/react-admin/pull/6011)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SimpleFormView>` component isn't exported ([6006](https://github.com/marmelab/react-admin/pull/6006)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix TS error on `<CheckboxGroupInput>` label styles ([6001](https://github.com/marmelab/react-admin/pull/6001)) ([andrico1234](https://github.com/andrico1234))
* [TypeScript] Fix `<AutoCompleteArrayInput>` Props Interface isn't exported ([5990](https://github.com/marmelab/react-admin/pull/5990)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix missing field in interface of `<DeleteButton>` props ([5998](https://github.com/marmelab/react-admin/pull/5998)) ([DjebbZ](https://github.com/DjebbZ))
* [Doc] Improve design on search modal ([5991](https://github.com/marmelab/react-admin/pull/5991)) ([zyhou](https://github.com/zyhou))
* [Doc] Fix section title level in List and Create/Edit chapters ([6010](https://github.com/marmelab/react-admin/pull/6010)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<SimpleForm>` JDocs ([6004](https://github.com/marmelab/react-admin/pull/6004)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing `DataProviderContext` in Querying the API chapter ([5988](https://github.com/marmelab/react-admin/pull/5988)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix wrong `sortBy` prop prescription in `<ReferenceField>` documentation ([5983](https://github.com/marmelab/react-admin/pull/5983)) ([guilbill](https://github.com/guilbill))

## v3.13.1

* Fix `<ReferenceArrayInput>` props drilling ([5977](https://github.com/marmelab/react-admin/pull/5977)) ([djhi](https://github.com/djhi))
* Fix `<ReferenceArrayInput>` passes wrong props to children ([5975](https://github.com/marmelab/react-admin/pull/5975)) ([djhi](https://github.com/djhi))
* Fix flaky e2e tests ([5982](https://github.com/marmelab/react-admin/pull/5982)) ([djhi](https://github.com/djhi))
* Fix flaky e2e tests ([5963](https://github.com/marmelab/react-admin/pull/5963)) ([djhi](https://github.com/djhi))
* Fix flaky unit tests ([5980](https://github.com/marmelab/react-admin/pull/5980)) ([djhi](https://github.com/djhi))
* [Doc] Fix `dataProvider.deleteMany` response format in Tutorial ([5973](https://github.com/marmelab/react-admin/pull/5973)) ([tbrrt11](https://github.com/tbrrt11))
* [Doc] Fix `ra-data-local-storage` package name in installation instructions ([5972](https://github.com/marmelab/react-admin/pull/5972)) ([Kiailandi](https://github.com/Kiailandi))
* [Doc] Fix default value for `useListContext().perPage` ([5967](https://github.com/marmelab/react-admin/pull/5967)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing reference to `<DashboardMenuItem>` component ([5966](https://github.com/marmelab/react-admin/pull/5966)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix incomplete `<UserMenu>` description and reference ([5965](https://github.com/marmelab/react-admin/pull/5965)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix buttons anchors in Reference section ([5964](https://github.com/marmelab/react-admin/pull/5964)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix scrollable `<TabbedForm>` example ([5960](https://github.com/marmelab/react-admin/pull/5960)) ([WiXSL](https://github.com/WiXSL))

## v3.13

* [BC Break] Move test utils (`<TestContext>`, `renderWithRedux`, `renderHook`) out of `ra-core` into a new `ra-test` package ([5846](https://github.com/marmelab/react-admin/pull/5846)) ([djhi](https://github.com/djhi))


This is a slight BC break in development: any import of the Test utils from "ra-core" will fail and must be replaced by an import or "ra-test".

```diff
-import { renderWithRedux, useMatchingReferences} from 'react-admin';
+import { useMatchingReferences} from 'react-admin';
+import { renderWithRedux } from 'ra-test';
```

* Add scroll to top on key navigation links ([5905](https://github.com/marmelab/react-admin/pull/5905)) ([fzaninotto](https://github.com/fzaninotto))
* Add `enabled` options to query hooks to allow dependent queries ([5849](https://github.com/marmelab/react-admin/pull/5849)) ([ValentinH](https://github.com/ValentinH))
* Add ability to disable routing in `<TabbedForm>` and `<TabbedShowLayout>` ([5945](https://github.com/marmelab/react-admin/pull/5945)) ([djhi](https://github.com/djhi))
* Add ability to disable options in `<SelectArrayInput>` ([5940](https://github.com/marmelab/react-admin/pull/5940)) ([paulo9mv](https://github.com/paulo9mv))
* Add support for selecting a range of `<Datagrid>` rows shift + click ([5936](https://github.com/marmelab/react-admin/pull/5936)) ([m4theushw](https://github.com/m4theushw))
* Add ability to override the `<UserMenu>` component style ([5918](https://github.com/marmelab/react-admin/pull/5918)) ([WiXSL](https://github.com/WiXSL))
* Add support for array values in `<ReferenceArrayField>` filter ([5887](https://github.com/marmelab/react-admin/pull/5887)) ([srosset81](https://github.com/srosset81))
* Add `ListContext` in `<ReferenceArrayInput>` ([5886](https://github.com/marmelab/react-admin/pull/5886)) ([djhi](https://github.com/djhi))
* Migrate simple example to Vite.js instead of Webpack for faster development ([5857](https://github.com/marmelab/react-admin/pull/5857)) ([djhi](https://github.com/djhi))
* Fix `<CheckboxGroupInput>` style error when used in `<ReferenceArrayInput>` ([5953](https://github.com/marmelab/react-admin/pull/5953)) ([djhi](https://github.com/djhi))
* Fix unused ccs rule in `<CreateButton>` ([5915](https://github.com/marmelab/react-admin/pull/5915)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ShowButton>` does not re-render when the `disabled` prop changes ([5914](https://github.com/marmelab/react-admin/pull/5914)) ([WiXSL](https://github.com/WiXSL))
* Fix `<CreateButton>` does not re-render when the `disabled` prop changes ([5866](https://github.com/marmelab/react-admin/pull/5866)) ([andrico1234](https://github.com/andrico1234))
* [TypeScript] Fix compilation fails with `@types/react@17` ([5950](https://github.com/marmelab/react-admin/pull/5950)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add buttons CSS API ([5913](https://github.com/marmelab/react-admin/pull/5913)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add CSS API for the `<Toolbar>` component ([5955](https://github.com/marmelab/react-admin/pull/5955)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix snippet about custom query for `<Datagrid>` ([5951](https://github.com/marmelab/react-admin/pull/5951)) ([Shumuu](https://github.com/Shumuu))
* [Doc] Fix typos in docs and comments ([5946](https://github.com/marmelab/react-admin/pull/5946)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `<MenuItemLink>` component CSS API reference ([5919](https://github.com/marmelab/react-admin/pull/5919)) ([WiXSL](https://github.com/WiXSL))

## v3.12.5

* Fix `useGetManyReference` loading state detection ([5931](https://github.com/marmelab/react-admin/pull/5931)) ([djhi](https://github.com/djhi))
* Fix warning about required `resource` prop in components using `ResourceContext` ([5929](https://github.com/marmelab/react-admin/pull/5929)) ([WiXSL](https://github.com/WiXSL))
* Fix simple example doesn't run on CodeSandbox ([5928](https://github.com/marmelab/react-admin/pull/5928)) ([ValentinH](https://github.com/ValentinH))
* Fix warning about `<ReferenceField label>` prop when using an element as value ([5927](https://github.com/marmelab/react-admin/pull/5927)) ([ValentinH](https://github.com/ValentinH))
* Fix skipped Loading tests ([5925](https://github.com/marmelab/react-admin/pull/5925)) ([djhi](https://github.com/djhi))
* Fix `<FunctionField>` misses PropType for the render prop ([5924](https://github.com/marmelab/react-admin/pull/5924)) ([WiXSL](https://github.com/WiXSL))
* Fix form children props are overridden ([5895](https://github.com/marmelab/react-admin/pull/5895)) ([djhi](https://github.com/djhi))
* [Doc] Add lb4, processmaker3, and mixer data provider links ([5939](https://github.com/marmelab/react-admin/pull/5939)) ([ckoliber](https://github.com/ckoliber))
* [Doc] Fix minor typos ([5912](https://github.com/marmelab/react-admin/pull/5912)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix data provider mutation types don't allow to specify Record type ([5934](https://github.com/marmelab/react-admin/pull/5934)) ([andrico1234](https://github.com/andrico1234))

## v3.12.4

* Fix `useQueryWithStore` doesn't change loading state false when stacked queries end ([5922](https://github.com/marmelab/react-admin/pull/5922)) ([djhi](https://github.com/djhi))
* Fix `<SkipNavigationButton>` does not allow global CSS override via theme ([5917](https://github.com/marmelab/react-admin/pull/5917)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceArrayInputView>` propTypes warning about required `resource` prop ([5916](https://github.com/marmelab/react-admin/pull/5916)) ([ValentinH](https://github.com/ValentinH))
* Fix warning when passing partial props to `useListContext` and other view context hooks ([5802](https://github.com/marmelab/react-admin/pull/5802)) ([Luwangel](https://github.com/Luwangel))
* Fix `<SaveButton>` incorrectly checks `<FormContext>` presence ([5911](https://github.com/marmelab/react-admin/pull/5911)) ([djhi](https://github.com/djhi))
* Fix `<TabbedForm>` does not display errors in hidden tabs on submit ([5903](https://github.com/marmelab/react-admin/pull/5903)) ([djhi](https://github.com/djhi))
* [Doc] Fix `<SelectField>` definition ([5923](https://github.com/marmelab/react-admin/pull/5923)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix minor typo in Authorization introduction ([5920](https://github.com/marmelab/react-admin/pull/5920)) ([jormaechea](https://github.com/jormaechea))

## v3.12.3

* Failed release

## v3.12.2

* Fix `<DeleteWithConfirmButton>` does not allow to override `resource` ([5884](https://github.com/marmelab/react-admin/pull/5884)) ([djhi](https://github.com/djhi))
* Fix List view error after delete when using a field with no record test ([5900](https://github.com/marmelab/react-admin/pull/5900)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid>` fails when `selectedIds` is undefined ([5892](https://github.com/marmelab/react-admin/pull/5892)) ([jtomaszewski](https://github.com/jtomaszewski))
* Fix `useInput` doesn't pass down the `isRequired` option ([5812](https://github.com/marmelab/react-admin/pull/5812)) ([FACOLOMBANI](https://github.com/FACOLOMBANI))
* Fix `<ReferenceManyField>` throws error after insert ([5877](https://github.com/marmelab/react-admin/pull/5877)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ArrayInput>` always overrides `disabled` prop in its child Inputs ([5876](https://github.com/marmelab/react-admin/pull/5876)) ([djhi](https://github.com/djhi))
* [TypeScript] Add missing classes prop on `<SimpleFormIterator>` ([5890](https://github.com/marmelab/react-admin/pull/5890)) ([ValentinH](https://github.com/ValentinH))
* [Doc] Fix `<List>` prop list is duplicated and incomplete ([5880](https://github.com/marmelab/react-admin/pull/5880)) ([f-jost](https://github.com/f-jost))
* [Doc] Fix Custom App example ([5897](https://github.com/marmelab/react-admin/pull/5897)) ([f107](https://github.com/f107))
* [Doc] Fix various links anchors ([5875](https://github.com/marmelab/react-admin/pull/5875)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix minor typos in jsDoc of `ra-ui-materialui` components ([5889](https://github.com/marmelab/react-admin/pull/5889)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix minor typo in `<ReferenceInput>` jsDoc ([5885](https://github.com/marmelab/react-admin/pull/5885)) ([WiXSL](https://github.com/WiXSL))

## v3.12.1

* Fix missing type for `ra.navigation.skip_nav` translation message ([5867](https://github.com/marmelab/react-admin/pull/5867)) ([bicstone](https://github.com/bicstone))
* Fix error when using `<List>` outside of a `ResourceContext` ([5863](https://github.com/marmelab/react-admin/pull/5863)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DeleteButton mutationMode>` handling ([5855](https://github.com/marmelab/react-admin/pull/5855)) ([djhi](https://github.com/djhi))
* Fix `form.restart` is not a function error ([5852](https://github.com/marmelab/react-admin/pull/5852)) ([fzaninotto](https://github.com/fzaninotto))
* Fix regression on `<ArrayInput>` children validation ([5850](https://github.com/marmelab/react-admin/pull/5850)) ([djhi](https://github.com/djhi))
* Fix `<TranslatableInputs>` layout ([5848](https://github.com/marmelab/react-admin/pull/5848)) ([djhi](https://github.com/djhi))
* Fix regression in `<SaveButton>` causing an error about missing `<FormContext>` ([5842](https://github.com/marmelab/react-admin/pull/5842)) ([djhi](https://github.com/djhi))
* Fix missing French translation for the `ra.navigation.skip_nav` message ([5841](https://github.com/marmelab/react-admin/pull/5841)) ([adrien-may](https://github.com/adrien-may))
* [TypeScript] Fix `onSuccess` / `onFailure` types ([5853](https://github.com/marmelab/react-admin/pull/5853)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Improve Reference section ([5864](https://github.com/marmelab/react-admin/pull/5864)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `<List aside>` example ([5861](https://github.com/marmelab/react-admin/pull/5861)) ([vdimitroff](https://github.com/vdimitroff))
* [Doc] Add documentation for `linkToRecord` ([5860](https://github.com/marmelab/react-admin/pull/5860)) ([jgabriele](https://github.com/jgabriele))
* [Doc] Fix typo in `<ResourceContextProvider>` documentation ([5859](https://github.com/marmelab/react-admin/pull/5859)) ([abdusco](https://github.com/abdusco))
* [Doc] Fix typos in code snippets ([5845](https://github.com/marmelab/react-admin/pull/5845)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix onSuccess callback signature for optimistic and undoable queries ([5851](https://github.com/marmelab/react-admin/pull/5851)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Added hindi transations to the ecosystem ([5798](https://github.com/marmelab/react-admin/pull/5798)) ([harshit-budhraja](https://github.com/harshit-budhraja))

## v3.12.0

* Add support for submission validation errors in `<Edit>` and `<Create>` ([5778](https://github.com/marmelab/react-admin/pull/5778)) ([alanpoulain](https://github.com/alanpoulain))
* Add `<Edit mutationMode>` prop, deprecate `<Edit undoable>` prop, and add optimistic mutation mode ([5799](https://github.com/marmelab/react-admin/pull/5799)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for keyboard navigation in Menu ([5772](https://github.com/marmelab/react-admin/pull/5772)) ([andrico1234](https://github.com/andrico1234))
* Add skip to content button when navigating with the keyboard ([5804](https://github.com/marmelab/react-admin/pull/5804)) ([andrico1234](https://github.com/andrico1234))
* Add ability to use `<List>` inside another page, without location sync ([5741](https://github.com/marmelab/react-admin/pull/5741)) ([djhi](https://github.com/djhi))
* Add `<TranslatableInputs>` and `<TranslatableFields>` to edit and show translatable content ([5810](https://github.com/marmelab/react-admin/pull/5810)) ([djhi](https://github.com/djhi))
* Add loading state support to the children of `<ReferenceInput>` ([5767](https://github.com/marmelab/react-admin/pull/5767)) ([djhi](https://github.com/djhi))
* Add Form Groups to better show the validation status of a group of inputs ([5752](https://github.com/marmelab/react-admin/pull/5752)) ([djhi](https://github.com/djhi))
* Add `<MenuItemLink TooltipPops>` to override tooltips in menus ([5714](https://github.com/marmelab/react-admin/pull/5714)) ([WiXSL](https://github.com/WiXSL))
* Add `<SimpleForm component>` to override the root component in forms ([5703](https://github.com/marmelab/react-admin/pull/5703)) ([WiXSL](https://github.com/WiXSL))
* Upgrade test dependencies ([5679](https://github.com/marmelab/react-admin/pull/5679)) ([Luwangel](https://github.com/Luwangel))
* Fix typos in CHANGELOG ([5839](https://github.com/marmelab/react-admin/pull/5839)) ([WiXSL](https://github.com/WiXSL))
* Fix `syncWithLocation` DOM warnings when using `<List>` ([5837](https://github.com/marmelab/react-admin/pull/5837)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useResourceDefinition` isn't overridable with Props ([5829](https://github.com/marmelab/react-admin/pull/5829)) ([djhi](https://github.com/djhi))
* Fix white page on load when using `<WithPermissions>` twice ([5822](https://github.com/marmelab/react-admin/pull/5822)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useQueryWithStore` flaky Test ([5800](https://github.com/marmelab/react-admin/pull/5800)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `<Edit transform>` and `<Create transform>` types don't accept async transformation ([5818](https://github.com/marmelab/react-admin/pull/5818)) ([Developerius](https://github.com/Developerius))
* [Doc] Fix deprecated Hasura data provider ([5820](https://github.com/marmelab/react-admin/pull/5820)) ([cpv123](https://github.com/cpv123))
* [Doc] Add coreBOS dataProvider ([5817](https://github.com/marmelab/react-admin/pull/5817)) ([joebordes](https://github.com/joebordes))

## v3.11.4

* Fix "dataProvider should return a rejected Promise" error in GraphQL providers ([5795](https://github.com/marmelab/react-admin/pull/5795)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Redux store is duplicated when the `<Admin>` component updates ([5793](https://github.com/marmelab/react-admin/pull/5793)) ([djhi](https://github.com/djhi))
* Fix "Please login to continue" notification remains after login ([5789](https://github.com/marmelab/react-admin/pull/5789)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix double spinner on loading and TS warnings ([5790](https://github.com/marmelab/react-admin/pull/5790)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `FormWithRedirect` types aren't exported ([5809](https://github.com/marmelab/react-admin/pull/5809)) ([djhi](https://github.com/djhi))
* [Doc] Fix custom `<Menu>` example misses Dashboard link ([5811](https://github.com/marmelab/react-admin/pull/5811)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix documentation about the `undoable` prop, which only works in `<Edit>` and not `<Create>` ([5806](https://github.com/marmelab/react-admin/pull/5806)) ([alanpoulain](https://github.com/alanpoulain))
* [Doc] Fix Create method API call URL example in `ra-data-json-server ([5794](https://github.com/marmelab/react-admin/pull/5794)) ([tjsturos](https://github.com/tjsturos))

## v3.11.3

* Fix `<EditGuesser>` is broken ([5756](https://github.com/marmelab/react-admin/pull/5756)) ([maaarghk](https://github.com/maaarghk))
* Fix `<AutocompleteInput>` doesn't work decorated with `<ReferenceInput>` ([5763](https://github.com/marmelab/react-admin/pull/5763)) ([djhi](https://github.com/djhi))
* Fix warning about unsaved change when using ArrayInputs ([5776](https://github.com/marmelab/react-admin/pull/5776)) ([djhi](https://github.com/djhi))
* Fix uncaught error when `dataProvider` fails on undoable forms ([5781](https://github.com/marmelab/react-admin/pull/5781)) ([fzaninotto](https://github.com/fzaninotto))
* Fix resource context fallback in `<EditGuesser>` and `<ShowGuesser>` ([5762](https://github.com/marmelab/react-admin/pull/5762)) ([djhi](https://github.com/djhi))
* [Demo] Fix Review Edit warning due to missing `<EditContext>` ([5780](https://github.com/marmelab/react-admin/pull/5780)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix app doesn't need a CSS preprocessor ([5765](https://github.com/marmelab/react-admin/pull/5765)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix the type of the custom `theme` used in `<Admin>` ([5784](https://github.com/marmelab/react-admin/pull/5784)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix the return type of the `exporter` function used in `<List>` ([5782](https://github.com/marmelab/react-admin/pull/5782)) ([ohbarye](https://github.com/ohbarye))
* [Doc] Fix various typos in Input components prop lists ([5777](https://github.com/marmelab/react-admin/pull/5777)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `saveModifiers` code comment ([5770](https://github.com/marmelab/react-admin/pull/5770)) ([DjebbZ](https://github.com/DjebbZ))
* [Doc] Fix `<AutocompleteInput resettable>` prop isn't documented ([5769](https://github.com/marmelab/react-admin/pull/5769)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix minor typos in code comments ([5758](https://github.com/marmelab/react-admin/pull/5758)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix bad return types and typos in jsDocs for `ra-core` and `ra-ui-material-ui` packages ([5690](https://github.com/marmelab/react-admin/pull/5690)) ([WiXSL](https://github.com/WiXSL))

## v3.11.2

* Fix `SaveContext` error when no context is supplied ([5738](https://github.com/marmelab/react-admin/pull/5738)) ([WiXSL](https://github.com/WiXSL))
* Fix `getPossibleReferences.possibleValues` prop gets overridden after one call ([5737](https://github.com/marmelab/react-admin/pull/5737)) ([WiXSL](https://github.com/WiXSL))
* Fix "Cannot read property 'fullName' of undefined" error after logout ([5735](https://github.com/marmelab/react-admin/pull/5735)) ([etienne-bondot](https://github.com/etienne-bondot))
* Fix `<ReferenceInput>` does not show loader while possible values and reference record are loading ([5731](https://github.com/marmelab/react-admin/pull/5731)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Create>`, `<Edit>` and `<Show>` cannot be used outside of a `<ResourceContextProvider>` ([5730](https://github.com/marmelab/react-admin/pull/5730)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<EditGuesser>` is broken ([5728](https://github.com/marmelab/react-admin/pull/5728)) ([fzaninotto](https://github.com/fzaninotto))
* Fix findDOMNode warning in StrictMode when using `<SimpleFormIterator>` ([5725](https://github.com/marmelab/react-admin/pull/5725)) ([fzaninotto](https://github.com/fzaninotto))
* Fix DOM warning when using `<Edit transform>` ([5705](https://github.com/marmelab/react-admin/pull/5705)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos in jsDoc, comments and string literals ([5739](https://github.com/marmelab/react-admin/pull/5739)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `ra-language-malay` translation ([5736](https://github.com/marmelab/react-admin/pull/5736)) ([kayuapi](https://github.com/kayuapi))
* [Doc] Fix `authProvider.getIdentity()` signature in Authentication doc ([5734](https://github.com/marmelab/react-admin/pull/5734)) ([adrien-may](https://github.com/adrien-may))
* [Doc] Fix `ra-data-json-server` `getMany` is documented as multiple `getOne` calls ([5729](https://github.com/marmelab/react-admin/pull/5729)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix custom query with `<Datagrid>` example uses incorrect resource ([5726](https://github.com/marmelab/react-admin/pull/5726)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo in `useSelectionState` jsdoc ([5715](https://github.com/marmelab/react-admin/pull/5715)) ([DjebbZ](https://github.com/DjebbZ))
* [Doc] Fix Changelog links ([5712](https://github.com/marmelab/react-admin/pull/5712)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix wrong anchor in `useListContent` examples list ([5711](https://github.com/marmelab/react-admin/pull/5711)) ([WiXSL](https://github.com/WiXSL))

## v3.11.1

* Fix select empty option in `<AutocompleteInput>` does not reset the input ([5698](https://github.com/marmelab/react-admin/pull/5698)) ([AnkitaGupta111](https://github.com/AnkitaGupta111))
* Fix `<Empty>` list component does not display when the `Resource` has no `create` component ([5688](https://github.com/marmelab/react-admin/pull/5688)) ([djhi](https://github.com/djhi))
* Fix `<ExportButton>` doesn't take permanent `filter` into account ([5675](https://github.com/marmelab/react-admin/pull/5675)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Confirm>` dialog shows a scroll bar on mobile ([5674](https://github.com/marmelab/react-admin/pull/5674)) ([rkfg](https://github.com/rkfg))
* Fix `<ReferenceField>` and `<ReferenceArrayField>` performance by showing loader only after a delay ([5668](https://github.com/marmelab/react-admin/pull/5668)) ([djhi](https://github.com/djhi))
* [Doc] Fix link to react-final-form `Field` documentation in CreateEdit chapter ([5689](https://github.com/marmelab/react-admin/pull/5689)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix outdated Hasura Data Provider reference ([5686](https://github.com/marmelab/react-admin/pull/5686)) ([djhi](https://github.com/djhi))
* [Doc] Fix syntax in actions example for `useUpdate` ([5681](https://github.com/marmelab/react-admin/pull/5681)) ([abdenny](https://github.com/abdenny))
* [Doc] Fix custom theme doc doesn't explain how to override default theme ([5676](https://github.com/marmelab/react-admin/pull/5676)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos in Tutorial doc ([5669](https://github.com/marmelab/react-admin/pull/5669)) ([paulo9mv](https://github.com/paulo9mv))

## v3.11.0

Starting with this version, react-admin applications send an anonymous request on mount to a telemetry server operated by marmelab. You can see this request by looking at the Network tab of your browser DevTools:

`https://react-admin-telemetry.marmelab.com/react-admin-telemetry`

The only data sent to the telemetry server is the admin domain (e.g. "example.com") - no personal data is ever sent, and no cookie is included in the response. The react-admin team uses these domains to track the usage of the framework.

You can opt out of telemetry by simply adding `disableTelemetry` to the `<Admin>` component:

```jsx
// in src/App.js
import * as React from "react";
import { Admin } from 'react-admin';

const App = () => (
    <Admin disableTelemetry>
        // ...
    </Admin>
);
```

* Add domain telemetry on app mount ([5631](https://github.com/marmelab/react-admin/pull/5631)) ([djhi](https://github.com/djhi))
* Add ability to access (and override) side effects in `SaveContext` ([5604](https://github.com/marmelab/react-admin/pull/5604)) ([djhi](https://github.com/djhi))
* Add support for `disabled` in `<ArrayInput>` ([5618](https://github.com/marmelab/react-admin/pull/5618)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to customize the notification element in the `<Login>` page ([5630](https://github.com/marmelab/react-admin/pull/5630)) ([hieusmiths](https://github.com/hieusmiths))
* Disable ripple effect on Buttons for improved performance ([5598](https://github.com/marmelab/react-admin/pull/5598)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<TestContext>` doesn't contain `notifications` node ([5659](https://github.com/marmelab/react-admin/pull/5659)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Filter>` fails to show compound filters with no default value ([5657](https://github.com/marmelab/react-admin/pull/5657)) ([fzaninotto](https://github.com/fzaninotto))
* Fix "Missing translation" console error when the `dataProvider` fails ([5655](https://github.com/marmelab/react-admin/pull/5655)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FilterListItem>` doesn't appear selected when more than one filter is applied ([5644](https://github.com/marmelab/react-admin/pull/5644)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `usePermissions` always triggers a re-render even though the permissions are unchanged ([5607](https://github.com/marmelab/react-admin/pull/5607)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add `rowStyle` example usage to `<SimpleList>` jsDoc ([5661](https://github.com/marmelab/react-admin/pull/5661)) ([vdimitroff](https://github.com/vdimitroff))
* [Doc] Fix `<ReferenceField link>` prop type to show that it accepts a function ([5660](https://github.com/marmelab/react-admin/pull/5660)) ([vdimitroff](https://github.com/vdimitroff))
* [Doc] Fix missing import in `List` example ([5658](https://github.com/marmelab/react-admin/pull/5658)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix syntax error in `<List exporter>` prop usage ([5649](https://github.com/marmelab/react-admin/pull/5649)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Sidebar size change resets the theme color ([5646](https://github.com/marmelab/react-admin/pull/5646)) ([zheya08](https://github.com/zheya08))
* [Doc] Fix `<ReferenceInput>` and `<ReferenceArrayInput>` JSDocs point to the wrong `dataProvider` method ([5645](https://github.com/marmelab/react-admin/pull/5645)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add mention of saved queries in List chapter ([5638](https://github.com/marmelab/react-admin/pull/5638)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<Admin history>` prop injection documentation misses package version constraint ([5538](https://github.com/marmelab/react-admin/pull/5538)) ([fzaninotto](https://github.com/fzaninotto))

## v3.10.4

* Fix `ra-data-simple-rest` delete method fails because of bad header ([5628](https://github.com/marmelab/react-admin/pull/5628)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FilterButtonMenuItem>` isn't exported ([5625](https://github.com/marmelab/react-admin/pull/5625)) ([fzaninotto](https://github.com/fzaninotto))
* Fix support for async validators in Create and Edit forms ([5623](https://github.com/marmelab/react-admin/pull/5623)) ([djhi](https://github.com/djhi))
* Fix useless rerenders in minor components ([5616](https://github.com/marmelab/react-admin/pull/5616)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AppBar>` rerenders too often ([5613](https://github.com/marmelab/react-admin/pull/5613)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceManyField>` rerenders too often ([5612](https://github.com/marmelab/react-admin/pull/5612)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceArrayInput>` doesn't humanize the source if no label is given ([5606](https://github.com/marmelab/react-admin/pull/5606)) ([alanpoulain](https://github.com/alanpoulain))
* [TypeScript] Fix `<EditActionsProps>` type is missing ([5614](https://github.com/marmelab/react-admin/pull/5614)) ([fzaninotto](https://github.com/fzaninotto))

## v3.10.3

* Fix `<Datagrid optimized>` freezes when using `expand` ([5603](https://github.com/marmelab/react-admin/pull/5603)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning about deprecated prop in `useCreateController` ([5594](https://github.com/marmelab/react-admin/pull/5594)) ([djhi](https://github.com/djhi))
* Fix Edit notifications are not shown in React 17 ([5583](https://github.com/marmelab/react-admin/pull/5583)) ([djhi](https://github.com/djhi))
* Fix `<ReferenceField>` doesn't accept the `emptyText` prop ([5579](https://github.com/marmelab/react-admin/pull/5579)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `logout` causes error in `useGetList` ([5577](https://github.com/marmelab/react-admin/pull/5577)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Sidebar>` width cannot be modified by the child `<Menu>` ([5575](https://github.com/marmelab/react-admin/pull/5575)) ([djhi](https://github.com/djhi))
* Fix `<FilterListItem>` doesn't accept object values ([5559](https://github.com/marmelab/react-admin/pull/5559)) ([mjattiot](https://github.com/mjattiot))
* [TypeScript] Export `SimpleFormIteratorProps` interface ([5595](https://github.com/marmelab/react-admin/pull/5595)) ([djhi](https://github.com/djhi))
* [Doc] Fix create and edit controller usage documentation ([5597](https://github.com/marmelab/react-admin/pull/5597)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos in `<XXXBase>` components jsdoc ([5589](https://github.com/marmelab/react-admin/pull/5589)) ([WiXSL](https://github.com/WiXSL))

## v3.10.2

* Fix `ra-data-simple-rest` delete response mime type ([5568](https://github.com/marmelab/react-admin/pull/5568)) ([djhi](https://github.com/djhi))
* Fix `ra-data-graphql-simple` delete result ([5567](https://github.com/marmelab/react-admin/pull/5567)) ([djhi](https://github.com/djhi))
* Fix Loading route missing `theme` ([5560](https://github.com/marmelab/react-admin/pull/5560)) ([thcolin](https://github.com/thcolin))
* Fix `variant` and `margin` prop on an input have no effect inside a Filter form ([5555](https://github.com/marmelab/react-admin/pull/5555)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix missing Roboto font in e-commerce demo ([5566](https://github.com/marmelab/react-admin/pull/5566)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix link formatting in "Writing your own input" documentation ([5556](https://github.com/marmelab/react-admin/pull/5556)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos in Theming doc ([5546](https://github.com/marmelab/react-admin/pull/5546)) ([DjebbZ](https://github.com/DjebbZ))
* [Doc] Fix code examples in TypeScript ([5548](https://github.com/marmelab/react-admin/pull/5548)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Improve List chapter screenshots and cross-links ([5543](https://github.com/marmelab/react-admin/pull/5543)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add link to `MrHertal/react-admin-json-view` package for JSON field and input ([5542](https://github.com/marmelab/react-admin/pull/5542)) ([MrHertal](https://github.com/MrHertal))
* [Doc] Update tutorial link ([5540](https://github.com/marmelab/react-admin/pull/5540)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix sample REST translation of `dataProvider` calls in Tutorial ([5535](https://github.com/marmelab/react-admin/pull/5535)) ([ayhandoslu](https://github.com/ayhandoslu))
* [Doc] Fix sample REST translation of `dataProvider` calls in Data Providers documentation ([5536](https://github.com/marmelab/react-admin/pull/5536)) ([ayhandoslu](https://github.com/ayhandoslu))

## v3.10.1

* Fix `<ReferenceInput>` ignores `sort` prop ([5527](https://github.com/marmelab/react-admin/pull/5527)) ([djhi](https://github.com/djhi))
* Fix `<ExportButton>` doesn't use UTF-8 mimetype ([5499](https://github.com/marmelab/react-admin/pull/5499)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* Fix `setImmediate` is not defined error when using SSR ([5523](https://github.com/marmelab/react-admin/pull/5523)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useDataProvider` throws 'options is undefined' error when called without arguments ([5524](https://github.com/marmelab/react-admin/pull/5524)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `options` prop not being injected to View elements ([5511](https://github.com/marmelab/react-admin/pull/5511)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix View types ([5532](https://github.com/marmelab/react-admin/pull/5532)) ([djhi](https://github.com/djhi))
* [Doc] Improve some docs anchors visibility ([5515](https://github.com/marmelab/react-admin/pull/5515)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add missing `<Datagrid>` css rules ([5522](https://github.com/marmelab/react-admin/pull/5522)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `ra-compact-ui` to the Ecosystem docs ([5520](https://github.com/marmelab/react-admin/pull/5520)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* [Doc] Fix code examples errors and typos in jsDoc ([5517](https://github.com/marmelab/react-admin/pull/5517)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* [Doc] Fix typos ([5510](https://github.com/marmelab/react-admin/pull/5510)) ([WiXSL](https://github.com/WiXSL))
* [RFR] Fix typo in README example ([5503](https://github.com/marmelab/react-admin/pull/5503)) ([janakact](https://github.com/janakact))
* Use React 17 in examples to make sure react-admin works with this version ([5453](https://github.com/marmelab/react-admin/pull/5453)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate CI to GitHub Actions ([5508](https://github.com/marmelab/react-admin/pull/5508)) ([djhi](https://github.com/djhi))

## v3.10.0

* Add `<RecordContext>` and Base components for Edit, Create and Show ([5422](https://github.com/marmelab/react-admin/pull/5422)) ([djhi](https://github.com/djhi))
* Add `<ResourceContext>` ([5456](https://github.com/marmelab/react-admin/pull/5456)) ([djhi](https://github.com/djhi))
* Update the `<ResourceContext>` to store a scalar instead of an object ([5489](https://github.com/marmelab/react-admin/pull/5489)) ([fzaninotto](https://github.com/fzaninotto))
* Update `<Reference>` elements to use `<ResourceContext>` ([5502](https://github.com/marmelab/react-admin/pull/5502)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to reset an `<AutocompleteInput>` ([5396](https://github.com/marmelab/react-admin/pull/5396)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to disable redirection after logout ([5458](https://github.com/marmelab/react-admin/pull/5458)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to customize the `ready` screen on empty admins ([5441](https://github.com/marmelab/react-admin/pull/5441)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to disable the `<UserMenu>` without rewriting the `<AppBar>` ([5421](https://github.com/marmelab/react-admin/pull/5421)) ([Luwangel](https://github.com/Luwangel))
* Add ability to hide notification when `authProvider.checkAuth()` or `authProvider.checkError()` fail ([5382](https://github.com/marmelab/react-admin/pull/5382)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to specify record type in `<FunctionField>` ([5370](https://github.com/marmelab/react-admin/pull/5370)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to infer field type from data ([5485](https://github.com/marmelab/react-admin/pull/5485)) ([fzaninotto](https://github.com/fzaninotto))
* Add rest props sanitizer for Fields and Inputs ([5392](https://github.com/marmelab/react-admin/pull/5392)) ([fzaninotto](https://github.com/fzaninotto))
* Speed up show & hide filter ([5411](https://github.com/marmelab/react-admin/pull/5411)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo on bulk action labels in French translation ([5494](https://github.com/marmelab/react-admin/pull/5494)) ([etienne-bondot](https://github.com/etienne-bondot))
* Fix `<EmailField>` with `target` prop fails TypeScript compilation ([5488](https://github.com/marmelab/react-admin/pull/5488)) ([fzaninotto](https://github.com/fzaninotto))
* Fix crash when navigating away during undo period ([5487](https://github.com/marmelab/react-admin/pull/5487)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ShowButton>` does not update on `to` prop change ([5483](https://github.com/marmelab/react-admin/pull/5483)) ([rkfg](https://github.com/rkfg))
* Fix error when using `withDataProvider` without `options` argument ([5481](https://github.com/marmelab/react-admin/pull/5481)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix layout component type ([5473](https://github.com/marmelab/react-admin/pull/5473)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Add rowStyle prop to SimpleList ([5252](https://github.com/marmelab/react-admin/pull/5252)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* [Doc] Improve Auth Provider chapter ([5493](https://github.com/marmelab/react-admin/pull/5493)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo ([5482](https://github.com/marmelab/react-admin/pull/5482)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix docs typos and grammar ([5480](https://github.com/marmelab/react-admin/pull/5480)) ([WiXSL](https://github.com/WiXSL))
* [Demo] use stepper for customer actions ([5472](https://github.com/marmelab/react-admin/pull/5472)) ([fzaninotto](https://github.com/fzaninotto))

## v3.9.6

* Fix unrecognized DOM prop on `<Show>` ([5471](https://github.com/marmelab/react-admin/pull/5471)) ([FredericEspiau](https://github.com/FredericEspiau))
* Fix filter with nested source ([5457](https://github.com/marmelab/react-admin/pull/5457)) ([fzaninotto](https://github.com/fzaninotto))
* Fix failed delete doesn't refresh the view ([5455](https://github.com/marmelab/react-admin/pull/5455)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo in tutorial documentation([5468](https://github.com/marmelab/react-admin/pull/5468)) ([ivanosevitch](https://github.com/ivanosevitch))
* [Doc] Fix bad sentence in `CloneButton` usage ([5466](https://github.com/marmelab/react-admin/pull/5466)) ([DjebbZ](https://github.com/DjebbZ))
* [Demo] Fix sales chart becomes empty at the end of the month ([5465](https://github.com/marmelab/react-admin/pull/5465)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix minor typos ([5460](https://github.com/marmelab/react-admin/pull/5460)) ([DjebbZ](https://github.com/DjebbZ))
* [Doc] Improve main navigation ([5459](https://github.com/marmelab/react-admin/pull/5459)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Improve List and Datagrid docs ([5449](https://github.com/marmelab/react-admin/pull/5449)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix simple example usage instructions ([5444](https://github.com/marmelab/react-admin/pull/5444)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Group Inputs and Fields in documentation to allow better discoverability ([5440](https://github.com/marmelab/react-admin/pull/5440)) ([fzaninotto](https://github.com/fzaninotto))

## v3.9.5

* Fix Custom Menu doesn't always receive `onMenuClick` prop ([5435](https://github.com/marmelab/react-admin/pull/5435)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Appbar>` custom content flickers when loading ([5434](https://github.com/marmelab/react-admin/pull/5434)) ([fzaninotto](https://github.com/fzaninotto))
* Fix several eslint warnings ([5433](https://github.com/marmelab/react-admin/pull/5433)) ([Luwangel](https://github.com/Luwangel))
* Fix `<AutocompleteArrayInput>` doesn't support the `disabled` prop ([5432](https://github.com/marmelab/react-admin/pull/5432)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Edit view doesn't work with `ra-data-graphql-simple` if resource id is of type `Int!` ([5402](https://github.com/marmelab/react-admin/pull/5402)) ([EmrysMyrddin](https://github.com/EmrysMyrddin))
* Fix `useDataProvider` signature prevents custom methods usage ([5395](https://github.com/marmelab/react-admin/pull/5395)) ([djhi](https://github.com/djhi))
* [TypeScript] Add type for theme ([5429](https://github.com/marmelab/react-admin/pull/5429)) ([djhi](https://github.com/djhi))
* [TypeScript] Export and Rename Pagination Types ([5420](https://github.com/marmelab/react-admin/pull/5420)) ([djhi](https://github.com/djhi))
* [Doc] Fix typos ([5431](https://github.com/marmelab/react-admin/pull/5431)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typos ([5412](https://github.com/marmelab/react-admin/pull/5412)) ([WiXSL](https://github.com/WiXSL))

## v3.9.4

* Fix `<AutocompleteInput>` suggestions appear beneath Dialog ([5393](https://github.com/marmelab/react-admin/pull/5393)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix missing types for `<AppBar>` and other layout components ([5410](https://github.com/marmelab/react-admin/pull/5410)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix compilation error on `defaultIdentity` ([5408](https://github.com/marmelab/react-admin/pull/5408)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix missing `path` prop in Tab component type ([5386](https://github.com/marmelab/react-admin/pull/5386)) ([nickwaelkens](https://github.com/nickwaelkens))
* [Demo] Improve Order Edit UI ([5407](https://github.com/marmelab/react-admin/pull/5407)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix "Link to filtered list" snippet incorrectly requires all query parameters ([5401](https://github.com/marmelab/react-admin/pull/5401)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add warning about inconsistent record shapes in custom data provider instructions ([5391](https://github.com/marmelab/react-admin/pull/5391)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix specialized `dataProvider` hooks usage ([5390](https://github.com/marmelab/react-admin/pull/5390)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix linking two inputs example ([5389](https://github.com/marmelab/react-admin/pull/5389)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix custom login snippet missing theme ([5388](https://github.com/marmelab/react-admin/pull/5388)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Remove Input `defaultValue` syntax with a function ([5387](https://github.com/marmelab/react-admin/pull/5387)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Replace TypeScript code by js code in examples documentation([5385](https://github.com/marmelab/react-admin/pull/5385)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<EmailField>` and `<UrlField>` definitions ([5384](https://github.com/marmelab/react-admin/pull/5384)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<FileInput>` props table format documentation([5383](https://github.com/marmelab/react-admin/pull/5383)) ([WiXSL](https://github.com/WiXSL))

## v3.9.3

* Fix `dataProvider` fails silently when response has wrong type ([5373](https://github.com/marmelab/react-admin/pull/5373)) ([fzaninotto](https://github.com/fzaninotto))
* Fix default `authProvider.getIdentity()` triggers infinite loop ([5381](https://github.com/marmelab/react-admin/pull/5381)) ([fzaninotto](https://github.com/fzaninotto))
* Fix duplicated `lodash` package when bundling react-admin without tree shaking ([5380](https://github.com/marmelab/react-admin/pull/5380)) ([impronunciable](https://github.com/impronunciable))
* Fix default `AuthContext` value fails TypeScript compilation ([5372](https://github.com/marmelab/react-admin/pull/5372)) ([fzaninotto](https://github.com/fzaninotto))
* Fix unused css rules in Input components ([5345](https://github.com/marmelab/react-admin/pull/5345)) ([WiXSL](https://github.com/WiXSL))
* Fix support for `className` prop in `<SimpleFormIterator>` ([5368](https://github.com/marmelab/react-admin/pull/5368)) ([edulix](https://github.com/edulix))
* [Doc] Fix rendering a Datagrid outside a Resource instructions ([5371](https://github.com/marmelab/react-admin/pull/5371)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add Inputs and Fields CSS Api documentation ([5346](https://github.com/marmelab/react-admin/pull/5346)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add open in Gitpod button in README ([5364](https://github.com/marmelab/react-admin/pull/5364)) ([nisarhassan12](https://github.com/nisarhassan12))
* [Doc] Fix Demo Video Links in the READMEs of ra- packages ([5369](https://github.com/marmelab/react-admin/pull/5369)) ([djhi](https://github.com/djhi))
* [Doc] Add mentions of the Enterprise Edition components in documentation ([5363](https://github.com/marmelab/react-admin/pull/5363)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix wrong link in shop demo's README ([5357](https://github.com/marmelab/react-admin/pull/5357)) ([DjebbZ](https://github.com/DjebbZ))
* [Doc] Fix links to source code following TypeScript migration ([5358](https://github.com/marmelab/react-admin/pull/5358)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add react-router link in Resource documentation ([5356](https://github.com/marmelab/react-admin/pull/5356)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in CreateEdit chapter introduction ([5355](https://github.com/marmelab/react-admin/pull/5355)) ([pamuche](https://github.com/pamuche))
* [Doc] Fix `useAuthState` hook js docs ([5351](https://github.com/marmelab/react-admin/pull/5351)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix import in `<AdminUI>` code example ([5352](https://github.com/marmelab/react-admin/pull/5352)) ([WiXSL](https://github.com/WiXSL))

## v3.9.2

* Add `onSuccess` and `onFailure` props to `<DeleteButton>` ([5310](https://github.com/marmelab/react-admin/pull/5310)) ([gavacho](https://github.com/gavacho))
* Fix `sideEffect` saga can throw `undefined` as error ([5315](https://github.com/marmelab/react-admin/pull/5315)) ([Hemant-yadav](https://github.com/Hemant-yadav))
* Fix ra-data-graphql only considers resource implementing `GET_ONE` and `GET_LIST` ([5305](https://github.com/marmelab/react-admin/pull/5305)) ([Kilometers42](https://github.com/Kilometers42))
* Fix `<TabbedShowLayout>` resolves path incorrectly if first tab is null ([5312](https://github.com/marmelab/react-admin/pull/5312)) ([WiXSL](https://github.com/WiXSL))


## v3.9.1

* Fix packages dependencies pointing to react-admin beta and causing duplicate packages ([5347](https://github.com/marmelab/react-admin/pull/5347)) ([WiXSL](https://github.com/WiXSL))

## v3.9.0

* Emit TypeScript types ([5291](https://github.com/marmelab/react-admin/pull/5291)) ([fzaninotto](https://github.com/fzaninotto))
* Add user name and avatar on the top bar ([5180](https://github.com/marmelab/react-admin/pull/5180)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to use a custom count header in `ra-data-simple-rest` data provider instead of `Content-Range` ([5224](https://github.com/marmelab/react-admin/pull/5224)) ([alexisjanvier](https://github.com/alexisjanvier))
* Add `localStorage` data provider ([5329](https://github.com/marmelab/react-admin/pull/5329)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to customize the option labels of `<NullableBooleanInput>` ([5311](https://github.com/marmelab/react-admin/pull/5311)) ([gavacho](https://github.com/gavacho))
* Add ability to pass custom icons to `<BooleanField>` to show as values ([5281](https://github.com/marmelab/react-admin/pull/5281)) ([WiXSL](https://github.com/WiXSL))
* Add ability to disable notifications of `useCheckAuth` and `useLogoutIfAccessDenied` hooks ([5255](https://github.com/marmelab/react-admin/pull/5255)) ([WiXSL](https://github.com/WiXSL))
* Fix warning about `<Error>` component proptypes when using string `error` ([5341](https://github.com/marmelab/react-admin/pull/5341)) ([fzaninotto](https://github.com/fzaninotto))
* Convert `<Tab>` component to TypeScript ([5342](https://github.com/marmelab/react-admin/pull/5342)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Edit>` logs warning when using `transform` prop ([5332](https://github.com/marmelab/react-admin/pull/5332)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<NullableBooleanInput>` empty value isn't selectable ([5326](https://github.com/marmelab/react-admin/pull/5326)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Edit>` refreshes dirty forms if tab is backgrounded ([5319](https://github.com/marmelab/react-admin/pull/5319)) ([WiXSL](https://github.com/WiXSL))
* Fix TypeScript types ([5318](https://github.com/marmelab/react-admin/pull/5318)) ([djhi](https://github.com/djhi))
* Fix TypeScrip types ([5313](https://github.com/marmelab/react-admin/pull/5313)) ([djhi](https://github.com/djhi))
* Fix warning when passing `FieldProps` to `<Input>` components ([5300](https://github.com/marmelab/react-admin/pull/5300)) ([fzaninotto](https://github.com/fzaninotto))
* Fix TypeScript types ([5298](https://github.com/marmelab/react-admin/pull/5298)) ([djhi](https://github.com/djhi))
* Fix `<LoadingIndicator>` does not get class overrides ([5279](https://github.com/marmelab/react-admin/pull/5279)) ([WiXSL](https://github.com/WiXSL))
* Fix `IsRowSelectable` return type ([5278](https://github.com/marmelab/react-admin/pull/5278)) ([WiXSL](https://github.com/WiXSL))
* Fix `useGetIdentity` fails when there is no `authProvider` ([5209](https://github.com/marmelab/react-admin/pull/5209)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid>` doesn't support forwarding ref ([5202](https://github.com/marmelab/react-admin/pull/5202)) ([jeiea](https://github.com/jeiea))
* [BC Break] Rename duplicate `Sort`, `Filter` and `Navigation` types to allow type emission from react-admin ([5257](https://github.com/marmelab/react-admin/pull/5257)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix missing link to `<DateTimeInput>` in reference documentation ([5340](https://github.com/marmelab/react-admin/pull/5340)) ([Hettomei](https://github.com/Hettomei))
* [Doc] Fix a typo in the `ra-data-localstorage` readme ([5333](https://github.com/marmelab/react-admin/pull/5333)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<UserMenu>` example in theming docs ([5328](https://github.com/marmelab/react-admin/pull/5328)) ([ceracera](https://github.com/ceracera))
* [Doc] Add link to a new REST data provider, variant of `ra-data-simple-rest`, allowing configurable `id` field ([5290](https://github.com/marmelab/react-admin/pull/5290)) ([zachrybaker](https://github.com/zachrybaker))
* [Doc] Fix the instructions for customizing the `Toolbar` in `<SaveButton>` ([5285](https://github.com/marmelab/react-admin/pull/5285)) ([Luwangel](https://github.com/Luwangel))
* [Doc] Add `ra-enterprise` packages to Ecosystem documentation ([5284](https://github.com/marmelab/react-admin/pull/5284)) ([djhi](https://github.com/djhi))
* [Doc] Fix http docs links ([5277](https://github.com/marmelab/react-admin/pull/5277)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix changelog links ([5276](https://github.com/marmelab/react-admin/pull/5276)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix minor typo in Actions documentation ([5274](https://github.com/marmelab/react-admin/pull/5274)) ([lipusal](https://github.com/lipusal))

## v3.8.5

* Fix ugly rounded corners in `<Datagrid>` Header ([5264](https://github.com/marmelab/react-admin/pull/5264)) ([djhi](https://github.com/djhi))
* Fix unexpected page change in `<List>` ([5263](https://github.com/marmelab/react-admin/pull/5263)) ([jdemangeon](https://github.com/jdemangeon))
* Fix syntax error in `useLogoutIfAccessDenied` hook ([5254](https://github.com/marmelab/react-admin/pull/5254)) ([WiXSL](https://github.com/WiXSL))
* Fix `useLogin` optional `pathName` cannot be reached ([5248](https://github.com/marmelab/react-admin/pull/5248)) ([bardeutsch](https://github.com/bardeutsch))
* Fix `<AutocompleteArrayInput />` chips input when `variant=outlined` ([5238](https://github.com/marmelab/react-admin/pull/5238)) ([m4theushw](https://github.com/m4theushw))
* Fix welcome banner style in the ecommerce demo ([5236](https://github.com/marmelab/react-admin/pull/5236)) ([Luwangel](https://github.com/Luwangel))
* [Doc] Add links to new advanced tutorials ([5261](https://github.com/marmelab/react-admin/pull/5261)) ([djhi](https://github.com/djhi))
* [Doc] Improve explanation of `onSuccess` callback execution in `<Edit undoable>` component ([5260](https://github.com/marmelab/react-admin/pull/5260)) ([jdemangeon](https://github.com/jdemangeon))
* [Doc] Improved Form examples. ([5250](https://github.com/marmelab/react-admin/pull/5250)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix outdated Catalan translation link ([5245](https://github.com/marmelab/react-admin/pull/5245)) ([joshf](https://github.com/joshf))
* [Doc] Fix `react-final-form` links ([5239](https://github.com/marmelab/react-admin/pull/5239)) ([WiXSL](https://github.com/WiXSL))

## v3.8.4

* Fix margin-top on `<Filter>` that creates an invisible overlay ([5234](https://github.com/marmelab/react-admin/pull/5234)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix support for function value in `<Form initialValues>` ([5222](https://github.com/marmelab/react-admin/pull/5222)) ([djhi](https://github.com/djhi))
* Fix proptypes warning in `<ListToolBar>` ([5230](https://github.com/marmelab/react-admin/pull/5230)) ([zyhou](https://github.com/zyhou))
* Fix vulnerability in simple example due to `serve` package ([5227](https://github.com/marmelab/react-admin/pull/5227)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Firefox support in end-to-end tests ([5223](https://github.com/marmelab/react-admin/pull/5223)) ([djhi](https://github.com/djhi))
* [Doc] Fix changelog typos ([5219](https://github.com/marmelab/react-admin/pull/5219)) ([WiXSL](https://github.com/WiXSL))

## v3.8.3

* Fix Optimistic Effects Handling ([5212](https://github.com/marmelab/react-admin/pull/5212)) ([djhi](https://github.com/djhi))
* Fix props & TypeScript related warnings in webpack, upgrade to TypeScript 4 ([5198](https://github.com/marmelab/react-admin/pull/5198)) ([djhi](https://github.com/djhi))
* Fix missing `useChoices` Types ([5193](https://github.com/marmelab/react-admin/pull/5193)) ([djhi](https://github.com/djhi))
* Fix cursor pointer in `<ChipField>` when wrapped in `<ReferenceField>` ([5186](https://github.com/marmelab/react-admin/pull/5186)) ([smeng9](https://github.com/smeng9))
* Add easy dev setup with Gitpod in `README` ([5213](https://github.com/marmelab/react-admin/pull/5213)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate remaining `ra-ui-materialui/List` components to TypeScript ([5187](https://github.com/marmelab/react-admin/pull/5187)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `ra-ui-materialui/Layout` components to typescript RFR([5183](https://github.com/marmelab/react-admin/pull/5183)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `data-generator` package to TypeScript RFR([5174](https://github.com/marmelab/react-admin/pull/5174)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `onSuccess` function examples missing data parameter ([5214](https://github.com/marmelab/react-admin/pull/5214)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix specialized hooks definitions missing `options` parameter ([5207](https://github.com/marmelab/react-admin/pull/5207)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typos in jsDoc params of dataProvider hooks ([5206](https://github.com/marmelab/react-admin/pull/5206)) ([WiXSL](https://github.com/WiXSL))

## v3.8.2

* Add ability to disable the `<Empty>` page in `<List>` ([5165](https://github.com/marmelab/react-admin/pull/5165)) ([jdemangeon](https://github.com/jdemangeon))
* Fix `<Edit>` form has wrong `pristine` state when coming from a Create form ([5146](https://github.com/marmelab/react-admin/pull/5146)) ([djhi](https://github.com/djhi))
* Fix `<ListContext>` subcontexts lack `resource` data ([5176](https://github.com/marmelab/react-admin/pull/5176)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing `range` header in `ra-data-simple-rest` `getList` request ([5164](https://github.com/marmelab/react-admin/pull/5164)) ([jpetitcolas](https://github.com/jpetitcolas))
* Fix `<SortButton>` label does not use `resource` name ([5159](https://github.com/marmelab/react-admin/pull/5159)) ([WiXSL](https://github.com/WiXSL))
* Fix webpack warnings about incorrect imports ([5156](https://github.com/marmelab/react-admin/pull/5156)) ([djhi](https://github.com/djhi))
* Fix Automatic Refresh in `<Create>` and `<Edit>` if the form is `dirty` ([5152](https://github.com/marmelab/react-admin/pull/5152)) ([djhi](https://github.com/djhi))
* Fix `addEventListener` calls for compatibility with React v17 ([5147](https://github.com/marmelab/react-admin/pull/5147)) ([WiXSL](https://github.com/WiXSL))
* Fix DOM warning in `<SimpleForm>` and `<TabbedForm>` ([5143](https://github.com/marmelab/react-admin/pull/5143)) ([Kmaschta](https://github.com/Kmaschta))
* Convert `Form` components to TypeScript ([5170](https://github.com/marmelab/react-admin/pull/5170)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix sidebar navigation on Firefox ([5175](https://github.com/marmelab/react-admin/pull/5175)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix missing mention of i18n messages in `<NullableBooleanInput>` usage ([5172](https://github.com/marmelab/react-admin/pull/5172)) ([sliterok](https://github.com/sliterok))
* [Doc] Fix wrong create verb request format in the `ra-data-simple-rest` data provider ([5171](https://github.com/marmelab/react-admin/pull/5171)) ([Luwangel](https://github.com/Luwangel))
* [Doc] Add example for how to add a custom back button ([5155](https://github.com/marmelab/react-admin/pull/5155)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add `ra-treemenu` to the ecosystem ([5153](https://github.com/marmelab/react-admin/pull/5153)) ([harshit-budhraja](https://github.com/harshit-budhraja))
* [Doc] Fix markdown of props tables ([5150](https://github.com/marmelab/react-admin/pull/5150)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing `<RichTextInput>` options documentation ([5145](https://github.com/marmelab/react-admin/pull/5145)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix documentation link hidden on small screens ([5167](https://github.com/marmelab/react-admin/pull/5167)) ([Luwangel](https://github.com/Luwangel))

## v3.8.1

* Fix warning about duplicate filter files with different case in esm build ([5036](https://github.com/marmelab/react-admin/pull/5036)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix various typos and anchors ([5137](https://github.com/marmelab/react-admin/pull/5137)) ([WiXSL](https://github.com/WiXSL))

## v3.8.0

* [BC Break] Remove dependency on `recompose` - add it to your `packages.json` if your code depends on `recompose` ([5088](https://github.com/marmelab/react-admin/pull/5088)) ([Luwangel](https://github.com/Luwangel))
* [BC Break] Remove `ra-data-graphcool` dataProvider. The graph.cool service is discontinued anyway. ([5015](https://github.com/marmelab/react-admin/pull/5015)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<FilterList>` and `<SortButton>` components, split `<ListContext>` for better performance ([5031](https://github.com/marmelab/react-admin/pull/5031)) ([fzaninotto](https://github.com/fzaninotto))
* Add abilility to make `<Sidebar>` full height ([5119](https://github.com/marmelab/react-admin/pull/5119)) ([djhi](https://github.com/djhi))
* Add ability to opt out of `sanitizeEmptyValues` in `<SimpleForm>` and `<TabbedForm>` ([5077](https://github.com/marmelab/react-admin/pull/5077)) ([Kmaschta](https://github.com/Kmaschta))
* Add ability to make the `<SaveButton>` not disabled by default ([5002](https://github.com/marmelab/react-admin/pull/5002)) ([Luwangel](https://github.com/Luwangel))
* Add ability to cutomize Add and Remove buttons in `<SimpleFormIterator>` ([4818](https://github.com/marmelab/react-admin/pull/4818)) ([manishsundriyal](https://github.com/manishsundriyal))
* Fix bad type for `useQuery` options (`onError` -> `onFailure`) ([5130](https://github.com/marmelab/react-admin/pull/5130)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceInput>` throws exception on custom pages ([5129](https://github.com/marmelab/react-admin/pull/5129)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `TypeError` when suggested element in `<AutocompleteInput>` is empty ([5125](https://github.com/marmelab/react-admin/pull/5125)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<LogoutButton>` memorizes last visited page ([5124](https://github.com/marmelab/react-admin/pull/5124)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Sidebar>` component classes ([5121](https://github.com/marmelab/react-admin/pull/5121)) ([WiXSL](https://github.com/WiXSL))
* Fix sorting a list using a `<Datagrid>` inside a `<ReferenceManyField>` ([5094](https://github.com/marmelab/react-admin/pull/5094)) ([Luwangel](https://github.com/Luwangel))
* Fix "Deprecated findDOMNode" warning in `StrictMode` ([5079](https://github.com/marmelab/react-admin/pull/5079)) ([pietro909](https://github.com/pietro909))
* Fix notifications appear under confirm dialog ([5073](https://github.com/marmelab/react-admin/pull/5073)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix eslint version ([5055](https://github.com/marmelab/react-admin/pull/5055)) ([WiXSL](https://github.com/WiXSL))
* Remove recompose dependency from `ra-core` and `demo` projects ([5087](https://github.com/marmelab/react-admin/pull/5087)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix a typo about the `<SimpleFormIterator>` ([5095](https://github.com/marmelab/react-admin/pull/5095)) ([Luwangel](https://github.com/Luwangel))
* [Doc] Fix the "Not Using the `<Admin>` Components" code ([5058](https://github.com/marmelab/react-admin/pull/5058)) ([srosset81](https://github.com/srosset81))

## v3.7.2

* Fix `authProvider.checkAuth()` support for redirection with query string ([5115](https://github.com/marmelab/react-admin/pull/5115)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ra-input-rich-text` dark theme compatibility ([5113](https://github.com/marmelab/react-admin/pull/5113)) ([manishprivet](https://github.com/manishprivet))
* Full height `<Layout>` & `<Sidebar>` margins ([5111](https://github.com/marmelab/react-admin/pull/5111)) ([djhi](https://github.com/djhi))
* Fix error when passing an undefined record to the `<DeleteButton>` ([5110](https://github.com/marmelab/react-admin/pull/5110)) ([Luwangel](https://github.com/Luwangel))
* Fix `<Placeholder>` component `className` value order ([5109](https://github.com/marmelab/react-admin/pull/5109)) ([WiXSL](https://github.com/WiXSL))
* Fix `<BulkDeleteButton>` confirmation dialog does not close after success when using `<Datagrid>` in a non-list page ([5097](https://github.com/marmelab/react-admin/pull/5097)) ([Luwangel](https://github.com/Luwangel))
* Fix `<BooleanInput>` label in filters does not use theme color ([5092](https://github.com/marmelab/react-admin/pull/5092)) ([djhi](https://github.com/djhi))
* Fix typo in `<FormDataConsumer>` warning ([5080](https://github.com/marmelab/react-admin/pull/5080)) ([Hemant-yadav](https://github.com/Hemant-yadav))
* Fix CORS issue in simple example CodeSandbox ([5068](https://github.com/marmelab/react-admin/pull/5068)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix `useUpdateMany` argument type ([5067](https://github.com/marmelab/react-admin/pull/5067)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceInput>` adds a buggy `pagination` DOM property to the inner `<SelectInput>` ([5053](https://github.com/marmelab/react-admin/pull/5053)) ([Luwangel](https://github.com/Luwangel))
* Replace `recompose`'s `shallowEqual` with `react-redux`'s `shallowEqual` ([5051](https://github.com/marmelab/react-admin/pull/5051)) ([WiXSL](https://github.com/WiXSL))
* Fix warning about `useEffect` in `<AutocompleteArrayInput>` ([5044](https://github.com/marmelab/react-admin/pull/5044)) ([helenwilliamson](https://github.com/helenwilliamson))
* Fix ESLint `@material-ui/core` rule configuration ([5042](https://github.com/marmelab/react-admin/pull/5042)) ([rassie](https://github.com/rassie))
* Fix warning when deleting last element on last page in data table ([4894](https://github.com/marmelab/react-admin/pull/4894)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix various typos in code samples ([5107](https://github.com/marmelab/react-admin/pull/5107)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix various typos in descriptions ([5100](https://github.com/marmelab/react-admin/pull/5100)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix outdated NestJS data provider ([5091](https://github.com/marmelab/react-admin/pull/5091)) ([rayman1104](https://github.com/rayman1104))
* [Doc] Fix typo in `authProvider` comment ([5084](https://github.com/marmelab/react-admin/pull/5084)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `<SaveButton>` comment ([5083](https://github.com/marmelab/react-admin/pull/5083)) ([adrien-may](https://github.com/adrien-may))
* [Doc] Fix various typos ([5075](https://github.com/marmelab/react-admin/pull/5075)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix title formatting in the `<Admin>` component documentation ([5061](https://github.com/marmelab/react-admin/pull/5061)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `ra-postgraphile` for `PostGraphile` as Data Provider ([5060](https://github.com/marmelab/react-admin/pull/5060)) ([BowlingX](https://github.com/BowlingX))

## v3.7.1

* Fix `<ExportButton>` fails to export data when using default exporter ([5032](https://github.com/marmelab/react-admin/pull/5032)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceManyField>` does not pass the right `resource` to its children ([5029](https://github.com/marmelab/react-admin/pull/5029)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `setFilter` fails on `<ReferenceManyField>` ([5025](https://github.com/marmelab/react-admin/pull/5025)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<CreateButton>` does not update when `to` prop changes ([5014](https://github.com/marmelab/react-admin/pull/5014)) ([rkfg](https://github.com/rkfg))
* Fix import errors when tree-shaking @material-ui ([4983](https://github.com/marmelab/react-admin/pull/4983)) ([rassie](https://github.com/rassie))
* Add data and auth providers for AWS Amplify ([5011](https://github.com/marmelab/react-admin/pull/5011)) ([MrHertal](https://github.com/MrHertal))
* [Doc] Fix unused import in `<EditButton>` usage example ([5033](https://github.com/marmelab/react-admin/pull/5033)) ([jpetitcolas](https://github.com/jpetitcolas))
* [Doc] Fix typo in auth code index comment ([5019](https://github.com/marmelab/react-admin/pull/5019)) ([damner](https://github.com/damner))
* [Doc] Fix many grammar errors and typos in documentation ([5017](https://github.com/marmelab/react-admin/pull/5017)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `ra-data-simple-rest` documentation ([5013](https://github.com/marmelab/react-admin/pull/5013)) ([thekevinbrown](https://github.com/thekevinbrown))

## v3.7.0

* Add `useListContext()`, which greatly simplifies the development of custom `<List>` views ([4952](https://github.com/marmelab/react-admin/pull/4952)) ([fzaninotto](https://github.com/fzaninotto))
* Add real product names to ecommerce demo ([4997](https://github.com/marmelab/react-admin/pull/4997)) ([fzaninotto](https://github.com/fzaninotto))
* Add custom theme to ecommerce demo (should be more welcoming to people hostile to material design) ([4948](https://github.com/marmelab/react-admin/pull/4948)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `<AutocompleteInput disabled` ([4915](https://github.com/marmelab/react-admin/pull/4915)) ([fancyaction](https://github.com/fancyaction))
* Update `<BooleanField>` height to match other fields ([4901](https://github.com/marmelab/react-admin/pull/4901)) ([fzaninotto](https://github.com/fzaninotto))
* Fix incompatibility between `<Datagrid rowClick="toggleSelection">` and `selectable="false"` ([5006](https://github.com/marmelab/react-admin/pull/5006)) ([WiXSL](https://github.com/WiXSL))
* Fix typing of Field components ([4947](https://github.com/marmelab/react-admin/pull/4947)) ([fzaninotto](https://github.com/fzaninotto))

## v3.6.3

* Fix `<SearchInput>` with label prop renders incorrectly ([4995](https://github.com/marmelab/react-admin/pull/4995)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<LogoutButton>` should not render as a `<li>` in Mobile menu ([4994](https://github.com/marmelab/react-admin/pull/4994)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useGetOne()` throws exception when used in `<Dashboard>` ([4990](https://github.com/marmelab/react-admin/pull/4990)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing type for `ra.action.unselect` translation message ([4987](https://github.com/marmelab/react-admin/pull/4987)) ([bicstone](https://github.com/bicstone))
* [Doc] Fix missing documentation about `<AdminContext>` and `<AdminUI>` components to build admins with a dynamic list or resources ([5004](https://github.com/marmelab/react-admin/pull/5004)) ([Luwangel](https://github.com/Luwangel))
* [Doc] Fix typo in `dataProvider` usage documentation ([5000](https://github.com/marmelab/react-admin/pull/5000)) ([tranln025](https://github.com/tranln025))
* [Doc] Fix description of react-admin in `README` ([4979](https://github.com/marmelab/react-admin/pull/4979)) ([christiaanwesterbeek](https://github.com/christiaanwesterbeek))

## v3.6.2

* Fix `createAdminStore` warning on SSR and tests ([4970](https://github.com/marmelab/react-admin/pull/4970)) ([hammadj](https://github.com/hammadj))
* Fix message in delete confirmation dialog does not respect German name capitalization rule ([4957](https://github.com/marmelab/react-admin/pull/4957)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix `<ExpandRowButton>` is not exported in `ra-ui-material-ui` ([4950](https://github.com/marmelab/react-admin/pull/4950)) ([floo51](https://github.com/floo51))
* Fix `useQuery` does not run again after calling `refresh` ([4945](https://github.com/marmelab/react-admin/pull/4945)) ([fzaninotto](https://github.com/fzaninotto))
* Update unit tests to use `assert` instead of `expect` ([4941](https://github.com/marmelab/react-admin/pull/4941)) ([WiXSL](https://github.com/WiXSL))

## v3.6.1

* Fix "name not found" error in `ra-data-graphql` data provider when `queryType` or `mutationType` do not exist in the schema ([4940](https://github.com/marmelab/react-admin/pull/4940)) ([braco](https://github.com/braco))
* Fix call to `dataProvider.update()` or `dataProvider.delete()` resets the pagination ([4936](https://github.com/marmelab/react-admin/pull/4936)) ([fzaninotto](https://github.com/fzaninotto))
* Fix duplicate `id` in `<RadioButtonGroupInput>` when using a React element for the choices ([4928](https://github.com/marmelab/react-admin/pull/4928)) ([helenwilliamson](https://github.com/helenwilliamson))
* Fix regression in `<ArrayField>` when used with `<SingleFieldList>` ([4918](https://github.com/marmelab/react-admin/pull/4918)) ([smeng9](https://github.com/smeng9))
* Fix `<NumberInput>` doesn't accept `min` and `max` props ([4912](https://github.com/marmelab/react-admin/pull/4912)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `HttpError` error name does not allow proper detection in `authProvider` ([4911](https://github.com/marmelab/react-admin/pull/4911)) ([jesseshieh](https://github.com/jesseshieh))
* Fix `pristine` prop not applied to the edit toolbar on `<SaveButton>` ([4904](https://github.com/marmelab/react-admin/pull/4904)) ([kopax](https://github.com/kopax))
* [Doc] Fix outdated jsDoc example in `<ArrayInput>` ([4907](https://github.com/marmelab/react-admin/pull/4907)) ([pefi1011](https://github.com/pefi1011))

## v3.6.0

* Add `onSuccess`, `onFailure` and `transform` to `<Create>`, `<Edit>` and `<SaveButton>` ([4881](https://github.com/marmelab/react-admin/pull/4881)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to deselect rows in one click in `<BulkActionsToolbar>` ([4859](https://github.com/marmelab/react-admin/pull/4859)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to style pagination buttons ([4891](https://github.com/marmelab/react-admin/pull/4891)) ([djhi](https://github.com/djhi))
* Add ability to create custom `<DeleteButton>` views without rewriting the logic ([4858](https://github.com/marmelab/react-admin/pull/4858)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to use a React element as `<Field>` label ([4852](https://github.com/marmelab/react-admin/pull/4852)) ([fzaninotto](https://github.com/fzaninotto))
* Add `useListParams` hook to allow easier customization of List pages ([4843](https://github.com/marmelab/react-admin/pull/4843)) ([WiXSL](https://github.com/WiXSL))
* Add support for `download`, `rel`, and `ping` attributes in `<FileField>` ([4798](https://github.com/marmelab/react-admin/pull/4798)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to use pagination and sort in `GET_MANY_REFERENCE` for `ra-data-graphcool` dataProvider ([4778](https://github.com/marmelab/react-admin/pull/4778)) ([byymster](https://github.com/byymster))
* Add feature to disable `<SaveButton>` if the Form is pristine ([4773](https://github.com/marmelab/react-admin/pull/4773)) ([WiXSL](https://github.com/WiXSL))
* Add `sortByOrder` prop to `<Field>` components to allow specifying the default sort order ([4518](https://github.com/marmelab/react-admin/pull/4518)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Add support for `variant=outlined` in `<SelectArrayInput>` ([4511](https://github.com/marmelab/react-admin/pull/4511)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Add explicit error when `useGetOne` is called for an undefined resource ([4430](https://github.com/marmelab/react-admin/pull/4430)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<EmailField>` doesn't use the theme typography ([4866](https://github.com/marmelab/react-admin/pull/4866)) ([WiXSL](https://github.com/WiXSL))
* Fix deprecated usage of `recompose` methods, replaced by `React.memo` ([4786](https://github.com/marmelab/react-admin/pull/4786)) ([WiXSL](https://github.com/WiXSL))
* Convert the demo `<GridList>` to TypeScript ([4870](https://github.com/marmelab/react-admin/pull/4870)) ([MohammedFaragallah](https://github.com/MohammedFaragallah))
* Convert products demo example to TypeScript ([4758](https://github.com/marmelab/react-admin/pull/4758)) ([MohammedFaragallah](https://github.com/MohammedFaragallah))
* Convert `<ArrayField>` component to function component. ([4536](https://github.com/marmelab/react-admin/pull/4536)) ([WiXSL](https://github.com/WiXSL))
* Convert demo example to TypeScript ([4516](https://github.com/marmelab/react-admin/pull/4516)) ([josephktcheung](https://github.com/josephktcheung))

## v3.5.6

* Fix default margin in `<AutocompleteArrayInput>` ([4892](https://github.com/marmelab/react-admin/pull/4892)) ([bard](https://github.com/bard))
* Fix `<FileInput>` when used without children ([4889](https://github.com/marmelab/react-admin/pull/4889)) ([fzaninotto](https://github.com/fzaninotto))
* Fix mobile version of `<ReviewList>` on the example demo ([4878](https://github.com/marmelab/react-admin/pull/4878)) ([alanpoulain](https://github.com/alanpoulain))
* [Doc] Fix `useQuery` and `useMutation` arguments name ([4887](https://github.com/marmelab/react-admin/pull/4887)) ([WiXSL](https://github.com/WiXSL))

## v3.5.5

* Fix list params set via query string are lost after redirection ([4868](https://github.com/marmelab/react-admin/pull/4868)) ([djhi](https://github.com/djhi))
* Fix failing language change in a corner case ([4854](https://github.com/marmelab/react-admin/pull/4854)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `dataProvider.delete()` input type ([4851](https://github.com/marmelab/react-admin/pull/4851)) ([fzaninotto](https://github.com/fzaninotto))
* Fix support for array of objects in `sanitizeEmptyValues` ([4853](https://github.com/marmelab/react-admin/pull/4853)) ([armellarcier](https://github.com/armellarcier))
* Update examples to use the latest version of material-ui and react-final-form ([4872](https://github.com/marmelab/react-admin/pull/4872)) ([djhi](https://github.com/djhi))
* Update imports from `React` to be future-proof ([4864](https://github.com/marmelab/react-admin/pull/4864)) ([djhi](https://github.com/djhi))
* [Doc] Fix `<NumberField>` `options` prop description ([4860](https://github.com/marmelab/react-admin/pull/4860)) ([joebordes](https://github.com/joebordes))
* [Doc] Update link to Firestore data provider ([4856](https://github.com/marmelab/react-admin/pull/4856)) ([benwinding](https://github.com/benwinding))
* [Doc] Fix typo in `useAuthenticated` hook usage description ([4855](https://github.com/marmelab/react-admin/pull/4855)) ([joebordes](https://github.com/joebordes))

## v3.5.4 (unpublished)

## v3.5.3

* Fix "Cannot set a numeric property on an objec" error in `<ReferenceArrayInput>` ([4819](https://github.com/marmelab/react-admin/pull/4819)) ([alanpoulain](https://github.com/alanpoulain))
* Fix refresh button breaks `useGetList` result when using application cache ([4829](https://github.com/marmelab/react-admin/pull/4829)) ([fzaninotto](https://github.com/fzaninotto))
* Fix null value for string array field crashes dataProvider in `ra-data-graphql-simple` ([4828](https://github.com/marmelab/react-admin/pull/4828)) ([stensrud](https://github.com/stensrud))
* Add many small improvements to the Posters Galore demo UX ([4831](https://github.com/marmelab/react-admin/pull/4831)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `dataProvider.delete()` response format documentation ([4840](https://github.com/marmelab/react-admin/pull/4840)) ([bmihelac](https://github.com/bmihelac))
* [Doc] Fix warning about unhandled DOM attribute when integrating react-admin in another application ([4837](https://github.com/marmelab/react-admin/pull/4837)) ([smeng9](https://github.com/smeng9))
* [Doc] Add `react-admin-firebase` to Authentication Providers ([4824](https://github.com/marmelab/react-admin/pull/4824)) ([benwinding](https://github.com/benwinding))
* [Doc] Fix incorrect syntax for `useNotify` hook ([4822](https://github.com/marmelab/react-admin/pull/4822)) ([Aikain](https://github.com/Aikain))

## v3.5.2

* Fix `initialValue` is ignored in children of `<ArrayInput>` ([4810](https://github.com/marmelab/react-admin/pull/4810)) ([fzaninotto](https://github.com/fzaninotto))
* Add new internationalization package for Brazilian Portuguese ([4812](https://github.com/marmelab/react-admin/pull/4812)) ([gucarletto](https://github.com/gucarletto))
* [Doc] Fix outdated mention of function default value for inputs ([4802](https://github.com/marmelab/react-admin/pull/4802)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix documentation about custom previous / next pagination ([4799](https://github.com/marmelab/react-admin/pull/4799)) ([alanpoulain](https://github.com/alanpoulain))

## v3.5.1

* Fix broken SSR due to `<Sidebar>` open default value ([4787](https://github.com/marmelab/react-admin/pull/4787)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceInput>` when using an object literal as `filter` prop ([4784](https://github.com/marmelab/react-admin/pull/4784)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<CheckboxGroupInputItem>` doesn't propagate `options` to `<Checkbox>` ([4772](https://github.com/marmelab/react-admin/pull/4772)) ([WiXSL](https://github.com/WiXSL))
* Fix components / hooks error in react-devtools ([4767](https://github.com/marmelab/react-admin/pull/4767)) ([EricJin987](https://github.com/EricJin987))
* Fix `<Edit>` view used as expand panel in `<List>` ([4762](https://github.com/marmelab/react-admin/pull/4762)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DeleteButton>` throws an error when accessing detail page ([4742](https://github.com/marmelab/react-admin/pull/4742)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix minor typos in Caching doc ([4781](https://github.com/marmelab/react-admin/pull/4781)) ([joebordes](https://github.com/joebordes))
* [Doc] Fix minor typos in Fields doc ([4780](https://github.com/marmelab/react-admin/pull/4780)) ([joebordes](https://github.com/joebordes))
* [Doc] Fix minor typos in Create/Edit doc ([4779](https://github.com/marmelab/react-admin/pull/4779)) ([joebordes](https://github.com/joebordes))
* [Doc] Fix minor typos in List doc ([4771](https://github.com/marmelab/react-admin/pull/4771)) ([joebordes](https://github.com/joebordes))
* [Doc] Fix minor typos in Data Provider doc ([4770](https://github.com/marmelab/react-admin/pull/4770)) ([joebordes](https://github.com/joebordes))
* [Doc] Add a list of props to all `Field` and `Input` components ([4769](https://github.com/marmelab/react-admin/pull/4769)) ([fzaninotto](https://github.com/fzaninotto))

## v3.5.0

* Update `<Sidebar>` default state to avoid flickering on load ([4677](https://github.com/marmelab/react-admin/pull/4677)) ([Luwangel](https://github.com/Luwangel))
* Add support for function value of `<SimpleList>` `linkType` prop ([4708](https://github.com/marmelab/react-admin/pull/4708)) ([WiXSL](https://github.com/WiXSL))
* Fix documentation and propType for `<SimpleList>` `linkType` prop ([4735](https://github.com/marmelab/react-admin/pull/4735)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add a link to `<ClipboardListField>` third-party package ([4659](https://github.com/marmelab/react-admin/pull/4659)) ([OoDeLally](https://github.com/OoDeLally))

## v3.4.4

* Fix cryptic error message when using a `<ReferenceInput>` to a missing resource ([4744](https://github.com/marmelab/react-admin/pull/4744)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `translateChoice` warning in `<ReferenceField>` ([4738](https://github.com/marmelab/react-admin/pull/4738)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix error in `<AutocompleteInput>` tests due to wrong initial state ([4730](https://github.com/marmelab/react-admin/pull/4730)) ([WiXSL](https://github.com/WiXSL))
* Fix default `total` selector in `useQueryWithStore` ([4720](https://github.com/marmelab/react-admin/pull/4720)) ([alanpoulain](https://github.com/alanpoulain))
* [Doc] Add prisma 2 dataProvider to the docs ([4748](https://github.com/marmelab/react-admin/pull/4748)) ([macrozone](https://github.com/macrozone))
* [Doc] Add link to the Romanian translation ([4746](https://github.com/marmelab/react-admin/pull/4746)) ([gyhaLabs](https://github.com/gyhaLabs))
* [Doc] Explain translate options and add notification duration to useNotify doc ([4739](https://github.com/marmelab/react-admin/pull/4739)) ([alanpoulain](https://github.com/alanpoulain))

## v3.4.3

* Fix race condition on the `List` page resulting in page coming back to 1 ([4718](https://github.com/marmelab/react-admin/pull/4718)) ([djhi](https://github.com/djhi))
* Fix `initialValue` in `<SelectInput>` component causes warning ([4717](https://github.com/marmelab/react-admin/pull/4717)) ([djhi](https://github.com/djhi))
* Fix `<FormTab>` component does not validate all props at runtime ([4501](https://github.com/marmelab/react-admin/pull/4501)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix custom `buildQuery` snippet `in ra-data-graphql` `README` ([4723](https://github.com/marmelab/react-admin/pull/4723)) ([bookvik](https://github.com/bookvik))
* [Doc] Fix typo in CreateEdit documentation ([4714](https://github.com/marmelab/react-admin/pull/4714)) ([deuzu](https://github.com/deuzu))
* [Doc] Fix typo in code comment for `checkAuth` ([4707](https://github.com/marmelab/react-admin/pull/4707)) ([martencassel](https://github.com/martencassel))
* [Doc] Fix character case typos in docs ([4701](https://github.com/marmelab/react-admin/pull/4701)) ([WiXSL](https://github.com/WiXSL))

## v3.4.2

* Fix `<AutocompleteInput>` not accepting 0 as a value ([4693](https://github.com/marmelab/react-admin/pull/4693)) ([Kmaschta](https://github.com/Kmaschta))
* Fix helper text misalignment in `<FileInput>` preview ([4680](https://github.com/marmelab/react-admin/pull/4680)) ([oleg-andreyev](https://github.com/oleg-andreyev))
* Fix filter error in `ra-data-graphql-simple` `getManyReference()` implementation ([4685](https://github.com/marmelab/react-admin/pull/4685)) ([jdemangeon](https://github.com/jdemangeon))
* Fix default app `<Loading>` is not centered vertically ([4686](https://github.com/marmelab/react-admin/pull/4686)) ([manishsundriyal](https://github.com/manishsundriyal))
* Fix `<AutocompleteInput>` empty suggestion item height ([4691](https://github.com/marmelab/react-admin/pull/4691)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `ra-data-graphql` uses deprecated query `introspectionQuery` ([4674](https://github.com/marmelab/react-admin/pull/4674)) ([edulecca](https://github.com/edulecca))
* Fix css typo in `<StarRatingField>` in the demo ([4678](https://github.com/marmelab/react-admin/pull/4678)) ([kopax](https://github.com/kopax))
* [Doc] Fix snippet in Upgrade guide regarding `<FormDataConsumer>` ([4700](https://github.com/marmelab/react-admin/pull/4700)) ([shakhal](https://github.com/shakhal))
* [Doc] Change the Portuguese translation to a more up to date package ([4696](https://github.com/marmelab/react-admin/pull/4696)) ([henriko202](https://github.com/henriko202))

## v3.4.1

* Fix build broken due to full ICU package version ([4673](https://github.com/marmelab/react-admin/pull/4673)) ([Kmaschta](https://github.com/Kmaschta))
* Fix Simple example webpack configuration missing dependency aliases ([4663](https://github.com/marmelab/react-admin/pull/4663)) ([jdemangeon](https://github.com/jdemangeon))
* Fix `<Field>` with null value gets rendered as "null", fix `emptyText` inconsistencies ([4661](https://github.com/marmelab/react-admin/pull/4661)) ([jdemangeon](https://github.com/jdemangeon))
* Fix `parse` and `format` usage in `<AutocompleteArrayInput>` ([4653](https://github.com/marmelab/react-admin/pull/4653)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `permanentFilter` changes aren't reflected in List requests ([4650](https://github.com/marmelab/react-admin/pull/4650)) ([oleg-andreyev](https://github.com/oleg-andreyev))
* Fix multiple notifications shown once the session ends ([4645](https://github.com/marmelab/react-admin/pull/4645)) ([djhi](https://github.com/djhi))
* Fix missing `defaultValue` handling in `<ReferenceArrayInput>` ([4641](https://github.com/marmelab/react-admin/pull/4641)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `onRemove` does not fire in `<FileInput>` options ([4637](https://github.com/marmelab/react-admin/pull/4637)) ([oleg-andreyev](https://github.com/oleg-andreyev))
* Fix error when passing custom link style to `<SingleFieldList>` ([4636](https://github.com/marmelab/react-admin/pull/4636)) ([Slavvkko](https://github.com/Slavvkko))
* Upgrade Cypress version ([4654](https://github.com/marmelab/react-admin/pull/4654)) ([Kmaschta](https://github.com/Kmaschta))
* [Doc] Add section about filters in List documentation ([4675](https://github.com/marmelab/react-admin/pull/4675)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix an outdated link on Translation docs ([4669](https://github.com/marmelab/react-admin/pull/4669)) ([henriko202](https://github.com/henriko202))
* [Doc] Update `<NumberInput>` "parse" documentation for Firefox ([4652](https://github.com/marmelab/react-admin/pull/4652)) ([Kmaschta](https://github.com/Kmaschta))
* [Doc] Update CreateEdit chapter to clarify tip about declaring form validators ([4651](https://github.com/marmelab/react-admin/pull/4651)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `useQuery` being incorrectly referenced in `useMutation` definition docs ([4639](https://github.com/marmelab/react-admin/pull/4639)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Improve buttons sanitation explanation ([4621](https://github.com/marmelab/react-admin/pull/4621)) ([WiXSL](https://github.com/WiXSL))

## v3.4.0

* Add row expand state persistence in `<Datagrid>` ([4624](https://github.com/marmelab/react-admin/pull/4624)) ([fzaninotto](https://github.com/fzaninotto))
* Add a data refresh when the App comes back from background ([4582](https://github.com/marmelab/react-admin/pull/4582)) ([fzaninotto](https://github.com/fzaninotto))
* Add warning when leaving form with unsaved changes ([4570](https://github.com/marmelab/react-admin/pull/4570)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `allowEmpty=false` in Filter `<Input>` components ([4500](https://github.com/marmelab/react-admin/pull/4500)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Add `color` prop to `<AppBar>` ([4479](https://github.com/marmelab/react-admin/pull/4479)) ([WiXSL](https://github.com/WiXSL))
* Add translation for hamburger menu tooltip ([4596](https://github.com/marmelab/react-admin/pull/4596)) ([fzaninotto](https://github.com/fzaninotto))
* Improve buttons props sanitation ([4574](https://github.com/marmelab/react-admin/pull/4574)) ([WiXSL](https://github.com/WiXSL))
* Add style to `<UrlField>` ([4568](https://github.com/marmelab/react-admin/pull/4568)) ([WiXSL](https://github.com/WiXSL))
* Convert `ra-language-english` and `ra-language-french` to typescript ([4569](https://github.com/marmelab/react-admin/pull/4569)) ([mayteio](https://github.com/mayteio))
* [Doc] Improve documentation on AppBar color prop. ([4503](https://github.com/marmelab/react-admin/pull/4503)) ([WiXSL](https://github.com/WiXSL))

## v3.3.4

* Fix `<ExportButton>` ignores custom `exporter` prop ([4630](https://github.com/marmelab/react-admin/pull/4630)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceInput>` `filter` prop change doesn't update filters ([4508](https://github.com/marmelab/react-admin/pull/4508)) ([tarunraj95](https://github.com/tarunraj95))
* Fix `destroyOnUnregister` prop is ignored in `<SimpleForm>` and `<TabbedForm>` ([4595](https://github.com/marmelab/react-admin/pull/4595)) ([fzaninotto](https://github.com/fzaninotto))
* Fix duplicate `react-transition-group` package dependency ([4597](https://github.com/marmelab/react-admin/pull/4597)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useState` return type in demo example `<Dashboard>` ([4590](https://github.com/marmelab/react-admin/pull/4590)) ([developerium](https://github.com/developerium))
* Remove obsolete `getDefaultValues` function ([4620](https://github.com/marmelab/react-admin/pull/4620)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Add section about page controller hooks ([4608](https://github.com/marmelab/react-admin/pull/4608)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<MenuItemLink>` example so that the `leftIcon` prop uses an element ([4604](https://github.com/marmelab/react-admin/pull/4604)) ([janakact](https://github.com/janakact))
* [Doc] Fix `addLabel` usage documentation ([4598](https://github.com/marmelab/react-admin/pull/4598)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add `react-admin-import-csv` to the Ecosystem section ([4599](https://github.com/marmelab/react-admin/pull/4599)) ([benwinding](https://github.com/benwinding))
* [Doc] Fix data provider example on file upload ([4591](https://github.com/marmelab/react-admin/pull/4591)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fixing theming documentation for custom icons ([4581](https://github.com/marmelab/react-admin/pull/4581)) ([g3n35i5](https://github.com/g3n35i5))

## v3.3.3

* Fix `useGetList` after an optimistic delete when using string identifiers ([4575](https://github.com/marmelab/react-admin/pull/4575)) ([fzaninotto](https://github.com/fzaninotto))
* Fix "Total from response is not a number" console error in optimistic mode ([4573](https://github.com/marmelab/react-admin/pull/4573)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix Edit Toolbar docs to explain how to use a `<CreateButton>` ([4544](https://github.com/marmelab/react-admin/pull/4544)) ([agent3bood](https://github.com/agent3bood))
* [Doc] Fix right menu when it contains too many items ([4560](https://github.com/marmelab/react-admin/pull/4560)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix code examples of `<List>` bulk action buttons ([4556](https://github.com/marmelab/react-admin/pull/4556)) ([WiXSL](https://github.com/WiXSL))

## v3.3.2

* Fix warning in `<SelectArrayInput>` when `alwaysOn` is true ([4561](https://github.com/marmelab/react-admin/pull/4561)) ([yelworc](https://github.com/yelworc))
* Fix regression on filters using dot separator in source ([4545](https://github.com/marmelab/react-admin/pull/4545)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix `<SimpleFormIterator>` for non-empty array inputs ([4535](https://github.com/marmelab/react-admin/pull/4535)) ([NikitaVlaznev](https://github.com/NikitaVlaznev))
* Fix missing PropType for `resettable` prop in `<SelectInput>` ([4513](https://github.com/marmelab/react-admin/pull/4513)) ([WiXSL](https://github.com/WiXSL))
* Change Fields docs menu item order to make it easier to find ([4529](https://github.com/marmelab/react-admin/pull/4529)) ([WiXSL](https://github.com/WiXSL))
* Add link to Belarusian, Estonian, Latvian, and Lithuanian translations ([4559](https://github.com/marmelab/react-admin/pull/4559)) ([AntonLukichev](https://github.com/AntonLukichev))
* Add link to Korean translation ([4550](https://github.com/marmelab/react-admin/pull/4550)) ([acidsound](https://github.com/acidsound))
* [Doc] Fix `dataProvider` calls using old-style verbs instead of method ([4532](https://github.com/marmelab/react-admin/pull/4532)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix example in `<ReferenceField>` and `<SelectField>` documentation ([4530](https://github.com/marmelab/react-admin/pull/4530)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix invalid JSON in API call examples for simple rest data provider ([4528](https://github.com/marmelab/react-admin/pull/4528)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix code sample for `<SimpleFormIterator>` when using `Field` components as child ([4527](https://github.com/marmelab/react-admin/pull/4527)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))

## v3.3.1

* Fix pagination buttons are in the wrong direction in RTL languages ([4496](https://github.com/marmelab/react-admin/pull/4496)) ([alikazemkhanloo](https://github.com/alikazemkhanloo))
* Fix `<ReferenceArrayInput>` list when filter is changed ([4494](https://github.com/marmelab/react-admin/pull/4494)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix rerender caused by style override ([4490](https://github.com/marmelab/react-admin/pull/4490)) ([fzaninotto](https://github.com/fzaninotto))
* Fix build of `ra-input-rich-text` ([4455](https://github.com/marmelab/react-admin/pull/4455)) ([teyc](https://github.com/teyc))
* [Doc] Fix code sample in CreateEdit docs. ([4524](https://github.com/marmelab/react-admin/pull/4524)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix useless line in `ra-data-graphcool` `README` ([4521](https://github.com/marmelab/react-admin/pull/4521)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix anchor text in CreateEdit list of props ([4515](https://github.com/marmelab/react-admin/pull/4515)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Authentication docs missing `<Notification>` in `<MyLoginPage>` example ([4492](https://github.com/marmelab/react-admin/pull/4492)) ([gvillo](https://github.com/gvillo))
* [Doc] Fix some jsDocs definitions. ([4484](https://github.com/marmelab/react-admin/pull/4484)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix link to react-final-form in CreateEdit documentation ([4483](https://github.com/marmelab/react-admin/pull/4483)) ([ekalinin](https://github.com/ekalinin))

## v3.3.0

* Add opt-in client-side caching layer to save on network requests, add support for optimistic rendering of multiple list pages, make `useListController` use `useGetList`, fix refresh when leaving optimistic mode ([4386](https://github.com/marmelab/react-admin/pull/4386)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to keep form validation when using custom save buttons ([4458](https://github.com/marmelab/react-admin/pull/4458)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Add support for `disabled` prop in `<BooleanInput>` ([4443](https://github.com/marmelab/react-admin/pull/4443)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Add `fieldKey` prop to `<ArrayField>` to improve performance on large arrays ([4437](https://github.com/marmelab/react-admin/pull/4437)) ([Hemant-yadav](https://github.com/Hemant-yadav))
* Add `emptyText` prop to show a fixed string when the value of a `<Field>` is `null` ([4413](https://github.com/marmelab/react-admin/pull/4413)) ([m4theushw](https://github.com/m4theushw))
* Fix empty filters are lost when navigating away ([4442](https://github.com/marmelab/react-admin/pull/4442)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix filter form inputs appear too high when there is no search input ([4481](https://github.com/marmelab/react-admin/pull/4481)) ([fzaninotto](https://github.com/fzaninotto))
* Fix empty item option height in `<SelectInput>` ([4480](https://github.com/marmelab/react-admin/pull/4386)) ([fzaninotto](https://github.com/fzaninotto))
* Fix dark theme contrast in the demo ([4399](https://github.com/marmelab/react-admin/pull/4399)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix override of `defaultValue` in `<FormInput>` ([4482](https://github.com/marmelab/react-admin/pull/4482)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Convert `<Field>` components to TypeScript ([4459](https://github.com/marmelab/react-admin/pull/4459)) ([josephktcheung](https://github.com/josephktcheung))
* Convert `<SimpleFormIterator>` to function component ([4450](https://github.com/marmelab/react-admin/pull/4450)) ([WiXSL](https://github.com/WiXSL))
* Convert remaining tests to `react-testing-library` ([4446](https://github.com/marmelab/react-admin/pull/4446)) ([m4theushw](https://github.com/m4theushw))
* Convert `<Confirm>`, `<Layout>` and `<BulkDeleteButton>` to TypeScript ([4441](https://github.com/marmelab/react-admin/pull/4441)) ([josephktcheung](https://github.com/josephktcheung))
* Convert `<RichTextInput>` to TypeScript ([4223](https://github.com/marmelab/react-admin/pull/4223)) ([tlaziuk](https://github.com/tlaziuk))
* [Doc] Add documentation for using of `<Field>` components inside `<SimpleFormIterator>` ([4477](https://github.com/marmelab/react-admin/pull/4477)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix `<ReferenceInput>` documentation of `filterToQuery` prop ([4461](https://github.com/marmelab/react-admin/pull/4461)) ([leibowitz](https://github.com/leibowitz))

## v3.2.4

* Fix error when using `<SimpleListLoading>` directly ([4469](https://github.com/marmelab/react-admin/pull/4469)) ([WiXSL](https://github.com/WiXSL))
* Fix `<LoadingIndicator>` shows infinite loading after Unauthorized error ([4456](https://github.com/marmelab/react-admin/pull/4456)) ([Developerius](https://github.com/Developerius))
* Fix `[object Object]` error in `<ArrayInput>` when using `defaultValue` or primitive value ([4394](https://github.com/marmelab/react-admin/pull/4394)) ([jdemangeon](https://github.com/jdemangeon))
* [Doc] Fix broken images in advanced tutorials ([4467](https://github.com/marmelab/react-admin/pull/4467)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix links to JSONPlaceholder are http instead of https ([4457](https://github.com/marmelab/react-admin/pull/4457)) ([WiXSL](https://github.com/WiXSL))

## v3.2.3

* Fix wrong defaults for `<CoreAdminUI>` in development mode ([4432](https://github.com/marmelab/react-admin/pull/4432)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SimpleFormIterator>` styles can't be overridden by theme ([4426](https://github.com/marmelab/react-admin/pull/4426)) ([WiXSL](https://github.com/WiXSL))
* Fix typo in variable name in unit tests ([4427](https://github.com/marmelab/react-admin/pull/4427)) ([developerium](https://github.com/developerium))
* Migrate Dashboard demo components to TypeScript ([4415](https://github.com/marmelab/react-admin/pull/4415)) ([developerium](https://github.com/developerium))
* [Doc] Fix typo in Upgrade guide for custom apps ([4433](https://github.com/marmelab/react-admin/pull/4433)) ([nadeeraka](https://github.com/nadeeraka))

## v3.2.2

* Fix `<CloneButton>` does not work with `<TabbedForm>` ([4422](https://github.com/marmelab/react-admin/pull/4422)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Empty>` component shows incorrectly in dark theme. ([4419](https://github.com/marmelab/react-admin/pull/4419)) ([WiXSL](https://github.com/WiXSL))
* Fix `<List>` does not refresh after API error ([4179](https://github.com/marmelab/react-admin/pull/4179)) ([m4theushw](https://github.com/m4theushw))
* Fix unable to submit a form using the keyboard ([4410](https://github.com/marmelab/react-admin/pull/4410)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix hot reload for demo example ([4252](https://github.com/marmelab/react-admin/pull/4252)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fich rich text editor toobal colors ([4409](https://github.com/marmelab/react-admin/pull/4409)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix custom menu snippet in theming documentation ([4418](https://github.com/marmelab/react-admin/pull/4418)) ([fzaninotto](https://github.com/fzaninotto))

## v3.2.1

* Fix `<FilterForm>` layout broken by bottom margin on `Input` components ([4390](https://github.com/marmelab/react-admin/pull/4390)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RichTextInput>` dark theme ([4384](https://github.com/marmelab/react-admin/pull/4384)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix `<Layout>` styles can't be overridden by theme ([4382](https://github.com/marmelab/react-admin/pull/4382)) ([leonidasv](https://github.com/leonidasv))

## v3.2.0

* Add the `<Empty>` component, an invitation to create the first record when the list is empty ([4113](https://github.com/marmelab/react-admin/pull/4113)) ([m4theushw](https://github.com/m4theushw))
* Add sticky header to `<Datagrid>` ([4309](https://github.com/marmelab/react-admin/pull/4309)) ([fzaninotto](https://github.com/fzaninotto))
* Display skeleton during `<SimpleList>` initial load ([4292](https://github.com/marmelab/react-admin/pull/4292)) ([djhi](https://github.com/djhi))
* Delay skeleton display in `<Datagrid>` and `<SimpleList>`, a la Suspense ([4294](https://github.com/marmelab/react-admin/pull/4294)) ([djhi](https://github.com/djhi))
* Force helper text height in all `<Input>` components to avoid form layout changes upon validation ([4364](https://github.com/marmelab/react-admin/pull/4364)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Reduce the default app weight by removing the image background on the Login screen ([4342](https://github.com/marmelab/react-admin/pull/4342)) ([ThieryMichel](https://github.com/ThieryMichel))
* Add ability to customize the icon in the `<Logout>` button ([4229](https://github.com/marmelab/react-admin/pull/4229)) ([steurt](https://github.com/steurt))
* Add ability to customize `<Empty>` styles using the theme ([4293](https://github.com/marmelab/react-admin/pull/4293)) ([WiXSL](https://github.com/WiXSL))
* Add `<NullableBooleanInput displayNull` prop to force the dislay of the null option ([4365](https://github.com/marmelab/react-admin/pull/4365)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Add explicit error in `useDataProvider` hook when the `dataProvider` throws a sync error([4291](https://github.com/marmelab/react-admin/pull/4291)) ([fzaninotto](https://github.com/fzaninotto))
* Export Reference Utilities ([4338](https://github.com/marmelab/react-admin/pull/4338)) ([djhi](https://github.com/djhi))
* Ensure `useEditController` specifies a default redirect to its caller ([4339](https://github.com/marmelab/react-admin/pull/4339)) ([djhi](https://github.com/djhi))
* Convert `<Menu>`, `<MenuItem>`, and `<DashboardMenuItem>` components to TypeScript ([4266](https://github.com/marmelab/react-admin/pull/4266)) ([steurt](https://github.com/steurt))
* Fix menu size in latest version of material-ui ([4374](https://github.com/marmelab/react-admin/pull/4374)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Autocomplete selection display with custom Component ([4367](https://github.com/marmelab/react-admin/pull/4367)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* Fix interface name starting with a lowercase letter in ReferenceFieldController ([4163](https://github.com/marmelab/react-admin/pull/4163)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix urls in 3.1.4 changelog ([4379](https://github.com/marmelab/react-admin/pull/4379)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add PostgREST data provider to the list of third-party providers ([4380](https://github.com/marmelab/react-admin/pull/4380)) ([scheiblr](https://github.com/scheiblr))

## v3.1.4

* Fix default value of filters with paths not applied correctly ([4347](https://github.com/marmelab/react-admin/pull/4347)) ([djhi](https://github.com/djhi))
* Fix Datagrid column headers don't update sort indicator when used in ReferenceManyField ([4346](https://github.com/marmelab/react-admin/pull/4346)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo in Create / Edit documentation ([4373](https://github.com/marmelab/react-admin/pull/4373)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Armenian abbreviation in the translation's documentation ([4371](https://github.com/marmelab/react-admin/pull/4371)) ([mrdntgrn](https://github.com/mrdntgrn))
* [Doc] Fix instructions for contributing to react-admin in `README` ([4359](https://github.com/marmelab/react-admin/pull/4359)) ([PaulMest](https://github.com/PaulMest))
* [Doc] Fix typo in `ra-data-graphcool` and `ra-data-graphql-simple` READMEs. ([4354](https://github.com/marmelab/react-admin/pull/4354)) ([kahdo](https://github.com/kahdo))
* [Doc] Fix documentation about extending a dataProvider ([4341](https://github.com/marmelab/react-admin/pull/4341)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix upgrade documentation about form handling ([4330](https://github.com/marmelab/react-admin/pull/4330)) ([JulienMattiussi](https://github.com/JulienMattiussi))
* [Doc] Fix custom actions example in List documentation ([4327](https://github.com/marmelab/react-admin/pull/4327)) ([Artexoid](https://github.com/Artexoid))

## v3.1.3

* Fix `<Menu>` overlapps the `<AppBar>` with material-ui > 4.8 ([4315](https://github.com/marmelab/react-admin/pull/4315)) ([fzaninotto](https://github.com/fzaninotto))
* Fix unused `filter` prop in `useGetMatchingReference` hook ([4314](https://github.com/marmelab/react-admin/pull/4314)) ([Luwangel](https://github.com/Luwangel))
* Fix several jsDoc blocks in `ra-core` hooks ([4312](https://github.com/marmelab/react-admin/pull/4312)) ([WiXSL](https://github.com/WiXSL))
* Fix `autoHideDuration` prop not being used in `<Notification>` component ([4311](https://github.com/marmelab/react-admin/pull/4311)) ([WiXSL](https://github.com/WiXSL))
* Fix `<NullableBooleanInput>` does not show initial value ([4303](https://github.com/marmelab/react-admin/pull/4303)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in `useCreate` hook jsDoc ([4289](https://github.com/marmelab/react-admin/pull/4289)) ([ekalinin](https://github.com/ekalinin))
* Fix error in `<Confirm>` due to bad prop-types package version ([4285](https://github.com/marmelab/react-admin/pull/4285)) ([fzaninotto](https://github.com/fzaninotto))
* Fix deprecation warnings about `<Admin>` props appearing in production ([4279](https://github.com/marmelab/react-admin/pull/4279)) ([alanpoulain](https://github.com/alanpoulain))
* Fix warning on `catchall` page due to improper sanitization in `<NotFound>` component ([4275](https://github.com/marmelab/react-admin/pull/4275)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix custom layout documentation doesn't mention the importance of the `<Notification>` component ([4336](https://github.com/marmelab/react-admin/pull/4336)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix form customization code snippet in CreateEdit documentation ([4335](https://github.com/marmelab/react-admin/pull/4335)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix outdated mention of `aor-dependent-input` in the FAQ ([4334](https://github.com/marmelab/react-admin/pull/4334)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix missing `basePath` prop in Custom App doc ([4333](https://github.com/marmelab/react-admin/pull/4333)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ImageInput>` and `<FileInput>` doc and explain `accept` prop ([4332](https://github.com/marmelab/react-admin/pull/4332)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix code snippet showing how to prefill forms ([4301](https://github.com/marmelab/react-admin/pull/4301)) ([nicgirault](https://github.com/nicgirault))
* [Doc] Fix useless line breaks in the Inputs documentation ([4278](https://github.com/marmelab/react-admin/pull/4278)) ([Luwangel](https://github.com/Luwangel))
* [Doc] Fix link to broken tinyMCE third-party package ([4274](https://github.com/marmelab/react-admin/pull/4274)) ([Luwangel](https://github.com/Luwangel))

## v3.1.2

* Fix build delay in certain bundlers due to `@material-ui/icons` import ([4265](https://github.com/marmelab/react-admin/pull/4265)) ([WiXSL](https://github.com/WiXSL))
* Fix list appears empty after a while ([4261](https://github.com/marmelab/react-admin/pull/4261)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix verbose code in `Resource` registration ([4257](https://github.com/marmelab/react-admin/pull/4257)) ([WiXSL](https://github.com/WiXSL))
* Fix useless export of style hook in `Edit`, `Show`, and `List` ([4255](https://github.com/marmelab/react-admin/pull/4255)) ([WiXSL](https://github.com/WiXSL))
* Fix 20 components exported twice (named and default) in `ra-ui-material-ui` ([4254](https://github.com/marmelab/react-admin/pull/4254)) ([WiXSL](https://github.com/WiXSL))
* Fix custom routes not working when based on resources ([4251](https://github.com/marmelab/react-admin/pull/4251)) ([djhi](https://github.com/djhi))
* Fix invalid DOM attribute warning when using `<EditController>`, `<ShowController>`, or `<CreateController>` ([4250](https://github.com/marmelab/react-admin/pull/4250)) ([djhi](https://github.com/djhi))
* Fix validation message color in `<SelectArrayInput>` ([4249](https://github.com/marmelab/react-admin/pull/4249)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix ability to override `parse` and `format` props in `<DateTimeInput>` ([4246](https://github.com/marmelab/react-admin/pull/4246)) ([WiXSL](https://github.com/WiXSL))
* Fix `initialValue` prop passed to `<Input>` elements by mistake ([4244](https://github.com/marmelab/react-admin/pull/4244)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Router>` and `<Title>` code to allow Server-Side Rendering (SSR) ([4242](https://github.com/marmelab/react-admin/pull/4242)) ([CarsonF](https://github.com/CarsonF))
* Fix `<DashboardMenuItem>` density differs from other menu items ([4241](https://github.com/marmelab/react-admin/pull/4241)) ([steurt](https://github.com/steurt))
* Fix page components use injected `location` prop instead of `useLocation` hook as encouraged by `react-router` documentation ([4240](https://github.com/marmelab/react-admin/pull/4240)) ([CarsonF](https://github.com/CarsonF))
* Fix `<DateTimeInput>` converts to value empty Object in `ra-data-graphql-simple` provider ([4238](https://github.com/marmelab/react-admin/pull/4238)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `withTranslate` HOC uses default `translate` prop instead of the one from context ([4233](https://github.com/marmelab/react-admin/pull/4233)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix invalid DOM attribute warnings in `<CheckboxGroupInput>` ([4216](https://github.com/marmelab/react-admin/pull/4216)) ([SeanBE](https://github.com/SeanBE))
* Fix TypeScript compilation issue in `ra-i18n-polyglot` ([4186](https://github.com/marmelab/react-admin/pull/4186)) ([WiXSL](https://github.com/WiXSL))
* Fix GraphQL demo ([4237](https://github.com/marmelab/react-admin/pull/4237)) ([ThieryMichel](https://github.com/ThieryMichel))
* [Doc] Fix typo in custom Save button code example ([4263](https://github.com/marmelab/react-admin/pull/4263)) ([almahdi](https://github.com/almahdi))
* [Doc] Fix AppBar customization documentation ([4258](https://github.com/marmelab/react-admin/pull/4258)) ([michelerota](https://github.com/michelerota))
* [Doc] Fix welcome page screenshot in tutorial ([4239](https://github.com/marmelab/react-admin/pull/4239)) ([zyhou](https://github.com/zyhou))
* [Doc] Fix typos in Inputs and Authorization docs ([4226](https://github.com/marmelab/react-admin/pull/4226)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix snippet for creating the React app in Tutorial ([4198](https://github.com/marmelab/react-admin/pull/4198)) ([pizzafox](https://github.com/pizzafox))
* [Doc] Add Armenian translation ([4199](https://github.com/marmelab/react-admin/pull/4199)) ([mrdntgrn](https://github.com/mrdntgrn))
* [Doc] Add `express-sequelize-crud` to the list of data provider backends ([4150](https://github.com/marmelab/react-admin/pull/4150)) ([nicgirault](https://github.com/nicgirault))

## v3.1.1

* Fix `SelectInput` doc about `emptyValue` defaultValue ([4193](https://github.com/marmelab/react-admin/pull/4193)) ([alanpoulain](https://github.com/alanpoulain))
* Fix `matchSuggestion` type in `useSuggestion` hook ([4192](https://github.com/marmelab/react-admin/pull/4192)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ReferenceError` in `useGetPermissions` hook due to temporal dead zone ([4191](https://github.com/marmelab/react-admin/pull/4191)) ([fzaninotto](https://github.com/fzaninotto))
* Fix unexpected token error in `FormWithRedirect` ([4190](https://github.com/marmelab/react-admin/pull/4190)) ([fzaninotto](https://github.com/fzaninotto))
* Fix bad anchors in Create Edit docs ([4188](https://github.com/marmelab/react-admin/pull/4188)) ([WiXSL](https://github.com/WiXSL))

## v3.1.0

* Add link to `ra-resource-aggregator` in Ecosystem doc ([4177](https://github.com/marmelab/react-admin/pull/4177)) ([dryhten](https://github.com/dryhten))
* Add Form customization documentation ([4175](https://github.com/marmelab/react-admin/pull/4175)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning in `<SelectInput>` when `alwaysOn` is true ([4174](https://github.com/marmelab/react-admin/pull/4174)) ([fzaninotto](https://github.com/fzaninotto))
* Fix duplicate `query-string` package ([4173](https://github.com/marmelab/react-admin/pull/4173)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `cellClassName` shortcoming isn't documented ([4172](https://github.com/marmelab/react-admin/pull/4172)) ([fzaninotto](https://github.com/fzaninotto))
* Fix upgrade guide misses `redux-saga` version requirement ([4171](https://github.com/marmelab/react-admin/pull/4171)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in custom Actions documentation ([4168](https://github.com/marmelab/react-admin/pull/4168)) ([gartner](https://github.com/gartner))
* Fix a couple variables defined with `var` instead of `const` ([4162](https://github.com/marmelab/react-admin/pull/4162)) ([WiXSL](https://github.com/WiXSL))
* Fix typo in `README` ([4159](https://github.com/marmelab/react-admin/pull/4159)) ([erikras](https://github.com/erikras))
* Fix `useStyles` hooks exported by mistake in `ra-ui-materialui` ([4153](https://github.com/marmelab/react-admin/pull/4153)) ([WiXSL](https://github.com/WiXSL))
* Add ability to extend pagination more easily ([4132](https://github.com/marmelab/react-admin/pull/4132)) ([Kmaschta](https://github.com/Kmaschta))
* Add the ability to override form layouts in a simpler way - introducing `<FormWithRedirect>` ([4116](https://github.com/marmelab/react-admin/pull/4116)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<BulkExportButton>` component ([4109](https://github.com/marmelab/react-admin/pull/4109)) ([fzaninotto](https://github.com/fzaninotto))
* Fix bad rebase (re-apply changes from ba48c62 accidentally overridden by fd7ba05) ([4076](https://github.com/marmelab/react-admin/pull/4076)) ([WiXSL](https://github.com/WiXSL))
* Add ability to extend `useEditController` ([4075](https://github.com/marmelab/react-admin/pull/4075)) ([Kmaschta](https://github.com/Kmaschta))
* Add types for button components ([4071](https://github.com/marmelab/react-admin/pull/4071)) ([fzaninotto](https://github.com/fzaninotto))
* Add documentation for `isRowSelectable` prop ([4064](https://github.com/marmelab/react-admin/pull/4064)) ([WiXSL](https://github.com/WiXSL))
* Add tooltip for `<BooleanField>` labels (instead of hidden text) ([4054](https://github.com/marmelab/react-admin/pull/4054)) ([fzaninotto](https://github.com/fzaninotto))
* Add `allowDuplicates` for `<AutocompleteArrayInput>` ([4026](https://github.com/marmelab/react-admin/pull/4026)) ([alanpoulain](https://github.com/alanpoulain))
* Update `<Tab>` and `<FormTab>` components to function components ([4002](https://github.com/marmelab/react-admin/pull/4002)) ([WiXSL](https://github.com/WiXSL))
* Add PropTypes to `<SimpleForm>` and `<TabbedForm>` components ([3996](https://github.com/marmelab/react-admin/pull/3996)) ([WiXSL](https://github.com/WiXSL))
* Add `isRowSelectable` function prop to `<Datagrid>` component ([3964](https://github.com/marmelab/react-admin/pull/3964)) ([WiXSL](https://github.com/WiXSL))
* Add `name` option to `makeStyles` ([3946](https://github.com/marmelab/react-admin/pull/3946)) ([DanudeSandstorm](https://github.com/DanudeSandstorm))
* Add custom icons for `<Confirm>` action buttons ([3812](https://github.com/marmelab/react-admin/pull/3812)) ([WiXSL](https://github.com/WiXSL))
* Add ability to hide `<SelectInput>` label ([3806](https://github.com/marmelab/react-admin/pull/3806)) ([WiXSL](https://github.com/WiXSL))
* Add props to allow customizing the title and content of `<Confirm>` modals for delete buttons ([3760](https://github.com/marmelab/react-admin/pull/3760)) ([macklin-10x](https://github.com/macklin-10x))-10x
* Add comprehensive param support for `ra-data-graphql-simple` adapter `GET_MANY_REFERENCE` requests ([3759](https://github.com/marmelab/react-admin/pull/3759)) ([maxschridde1494](https://github.com/maxschridde1494))
* Add `TransitionProps` prop to `<SimpleFormIterator>` component ([3226](https://github.com/marmelab/react-admin/pull/3226)) ([cherniavskii](https://github.com/cherniavskii))
* Add `<PasswordInput>` component ([3013](https://github.com/marmelab/react-admin/pull/3013)) ([Kmaschta](https://github.com/Kmaschta))

## v3.0.4

* Fix typos, syntax errors and anchors references in the docs ([4152](https://github.com/marmelab/react-admin/pull/4152)) ([WiXSL](https://github.com/WiXSL))
* Fix deprecated `useField` documentation ([4151](https://github.com/marmelab/react-admin/pull/4151)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ReferenceField` when used inside form ([4147](https://github.com/marmelab/react-admin/pull/4147)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RadioButtonGroupInput onChange` prop being ignored ([4123](https://github.com/marmelab/react-admin/pull/4123)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `Input` components ignore `variant` prop ([4142](https://github.com/marmelab/react-admin/pull/4142)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `make doc` command fails in development ([4143](https://github.com/marmelab/react-admin/pull/4143)) ([fzaninotto](https://github.com/fzaninotto))
* Fix prop sanitatization for `ReferenceInput` ([4139](https://github.com/marmelab/react-admin/pull/4139)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `<FileInput onDrop` option ([4140](https://github.com/marmelab/react-admin/pull/4140)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `ReferenceArrayInput` ignores `parse` and `format` props ([4138](https://github.com/marmelab/react-admin/pull/4138)) ([Kmaschta](https://github.com/Kmaschta))
* Fix cloned record reverts values when submitting ([4130](https://github.com/marmelab/react-admin/pull/4130)) ([m4theushw](https://github.com/m4theushw))
* Fix `RadioButtonGroupInput` option not being checked when numeric ids are used ([4128](https://github.com/marmelab/react-admin/pull/4128)) ([m4theushw](https://github.com/m4theushw))

## v3.0.3

* Fix typo in `fullWidth` Input prop documentation ([4119](https://github.com/marmelab/react-admin/pull/4119)) ([JoonsungUm](https://github.com/JoonsungUm))
* Fix outdated mention of Redux-form in Readme ([4108](https://github.com/marmelab/react-admin/pull/4108)) ([kopax](https://github.com/kopax))
* Fix `<TextInput endAdornment` when resettable ([4107](https://github.com/marmelab/react-admin/pull/4107)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ArrayInput>` usage in `<FilterForm>` ([4105](https://github.com/marmelab/react-admin/pull/4105)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in `<FormDataConsumer>` docs ([4104](https://github.com/marmelab/react-admin/pull/4104)) ([tdeo](https://github.com/tdeo))
* Fix form values sanitization messes with JSON values ([4103](https://github.com/marmelab/react-admin/pull/4103)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FilterForm>` doesn't use default values for `<BooleanInput>` ([4101](https://github.com/marmelab/react-admin/pull/4101)) ([fzaninotto](https://github.com/fzaninotto))
* Fix regression in `<ReferenceArrayInput>` (`idsToGetFromStore` error) ([4099](https://github.com/marmelab/react-admin/pull/4099)) ([fzaninotto](https://github.com/fzaninotto))
* Fix incorrect `dataProvider` leads to infinite render loop ([4097](https://github.com/marmelab/react-admin/pull/4097)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `fullWidth` support on `<AutoCompleteInput>` ([4096](https://github.com/marmelab/react-admin/pull/4096)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing mention about `AUTH_GET_PERMISSIONS` in Upgrade guide ([4088](https://github.com/marmelab/react-admin/pull/4088)) ([fzaninotto](https://github.com/fzaninotto))
* Fix unused prop in `<LoadingIndicator>` ([4085](https://github.com/marmelab/react-admin/pull/4085)) ([kopax](https://github.com/kopax))
* Fix Form breaks when setting undefined value to object ([4082](https://github.com/marmelab/react-admin/pull/4082)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate half of the Demo to Typescript ([4081](https://github.com/marmelab/react-admin/pull/4081)) ([djhi](https://github.com/djhi))
* Fix missing dependency in `ra-ui-material-ui` packages.json ([4077](https://github.com/marmelab/react-admin/pull/4077)) ([kopax](https://github.com/kopax))

## v3.0.2

* Fix duplicated import in `<TabbedForm>` ([4074](https://github.com/marmelab/react-admin/pull/4074)) ([kopax](https://github.com/kopax))
* Fix `<DatagridRow rowClick` event handling ([4063](https://github.com/marmelab/react-admin/pull/4063)) ([djhi](https://github.com/djhi))
* Fix warnings on Logout on Demo ([4062](https://github.com/marmelab/react-admin/pull/4062)) ([djhi](https://github.com/djhi))
* Fix `<ArrayInput>` validation ([4061](https://github.com/marmelab/react-admin/pull/4061)) ([djhi](https://github.com/djhi))
* Fix support of GraphQL interface type ([3712](https://github.com/marmelab/react-admin/pull/3712)) ([MichielDeMey](https://github.com/MichielDeMey))
* Fix `ra-data-graphql-simple`: Queries that have the same type defined multiple times are being dropped ([3900](https://github.com/marmelab/react-admin/pull/3900)) ([Ashenback](https://github.com/Ashenback))
* Fix warning about unmounted component after Login on Demo ([4059](https://github.com/marmelab/react-admin/pull/4059)) ([djhi](https://github.com/djhi))
* Fix `<AutocompleteInput>` default width ([4055](https://github.com/marmelab/react-admin/pull/4055)) ([djhi](https://github.com/djhi))
* Fix `List` does not refresh correctly after optimistic update ([4058](https://github.com/marmelab/react-admin/pull/4058)) ([djhi](https://github.com/djhi))
* Fix `<Create>` form prefill ([4053](https://github.com/marmelab/react-admin/pull/4053)) ([fzaninotto](https://github.com/fzaninotto))
* Fix console errors in tests ([4050](https://github.com/marmelab/react-admin/pull/4050)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing `useFilterState` export ([4051](https://github.com/marmelab/react-admin/pull/4051)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteArrayInput>` inside `<ReferenceArrayInput>` ([4042](https://github.com/marmelab/react-admin/pull/4042)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated mention of `ra-realtime` in the Ecosystem doc ([4045](https://github.com/marmelab/react-admin/pull/4045)) ([esistgut](https://github.com/esistgut))

## v3.0.1

* Fix `<ReferenceInput>` should not set filter in getList when q is empty ([4039](https://github.com/marmelab/react-admin/pull/4039)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Sidebar>` classes can't be overridden ([4038](https://github.com/marmelab/react-admin/pull/4038)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` required label ([4034](https://github.com/marmelab/react-admin/pull/4034)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<TabbedForm>` and `<TabbedShowLayout>` do not support parenthesis in id ([4028](https://github.com/marmelab/react-admin/pull/4028)) ([fzaninotto](https://github.com/fzaninotto))
* Fix wrong syntax in custom menu example ([4023](https://github.com/marmelab/react-admin/pull/4023)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing mention in Upgrade doc about `<Login>` using children instead of a loginForm prop ([4022](https://github.com/marmelab/react-admin/pull/4022)) ([christiaanwesterbeek](https://github.com/christiaanwesterbeek))
* Fix internal cross-package dependencies to use table v3 ([4013](https://github.com/marmelab/react-admin/pull/4013)) ([WiXSL](https://github.com/WiXSL))

## v3.0.0

* Fix IE11 support on the demo ([4007](https://github.com/marmelab/react-admin/pull/4007)) ([m4theushw](https://github.com/m4theushw))
* Fix anchor in Input documentation ([4004](https://github.com/marmelab/react-admin/pull/4004)) ([WiXSL](https://github.com/WiXSL))
* Fix setting filter resets pagination ([4000](https://github.com/marmelab/react-admin/pull/4000)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Inputs doc to make props more obvious ([3998](https://github.com/marmelab/react-admin/pull/3998)) ([fzaninotto](https://github.com/fzaninotto))
* Update demo example to use function components ([3995](https://github.com/marmelab/react-admin/pull/3995)) ([WiXSL](https://github.com/WiXSL))
* Fix `useGetMany` hook `accumulatedIds` filter function ([3989](https://github.com/marmelab/react-admin/pull/3989)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SelectInput variant="standard">` shows warning for unknown class ([3988](https://github.com/marmelab/react-admin/pull/3988)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Login>` component does not accept style override ([3986](https://github.com/marmelab/react-admin/pull/3986)) ([zyhou](https://github.com/zyhou))
* Fix `<Field>` in form does not like the variant prop ([3984](https://github.com/marmelab/react-admin/pull/3984)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useQueryWithStore` and `useGetMany` return error: null when success after first fail ([3983](https://github.com/marmelab/react-admin/pull/3983)) ([Slavvkko](https://github.com/Slavvkko))
* Fix `<RadioButtonGroupInput>` label size ([3974](https://github.com/marmelab/react-admin/pull/3974)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<CloneButton>` for nested objects ([3973](https://github.com/marmelab/react-admin/pull/3973)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<TabbedFormTabs>` computes wrong tab index ([3972](https://github.com/marmelab/react-admin/pull/3972)) ([natrim](https://github.com/natrim))
* Fix `useSuggestions` crashes on empty value ([3971](https://github.com/marmelab/react-admin/pull/3971)) ([natrim](https://github.com/natrim))
* Fix `dataProvider` console logs in production ([3967](https://github.com/marmelab/react-admin/pull/3967)) ([WiXSL](https://github.com/WiXSL))
* Fix various typos in docs ([3963](https://github.com/marmelab/react-admin/pull/3963)) ([WiXSL](https://github.com/WiXSL))
* Fix warning in `<LoginForm>` ([3961](https://github.com/marmelab/react-admin/pull/3961)) ([WiXSL](https://github.com/WiXSL))
* Fix warnings caused by passing new FinalForm form state property `dirtyFieldsSinceLastSubmit` ([3959](https://github.com/marmelab/react-admin/pull/3959)) ([MiMo42](https://github.com/MiMo42))

## v2.9.9

* Add link to `ra-language-japanese` in Translation doc ([3994](https://github.com/marmelab/react-admin/pull/3994)) ([bicstone](https://github.com/bicstone))
* Fix duplicate keywords ([3993](https://github.com/marmelab/react-admin/pull/3993)) ([bicstone](https://github.com/bicstone))
* Fix warning in Login form ([3958](https://github.com/marmelab/react-admin/pull/3958)) ([gstvg](https://github.com/gstvg))
* Add example of custom Datagrid usage in the List documentation ([3956](https://github.com/marmelab/react-admin/pull/3956)) ([nicgirault](https://github.com/nicgirault))
* Add a list if `<Pagination>` props in the List documentation ([3954](https://github.com/marmelab/react-admin/pull/3954)) ([nicgirault](https://github.com/nicgirault))
* Fix pessimistic delete one does not remove item from selection ([3926](https://github.com/marmelab/react-admin/pull/3926)) ([fzaninotto](https://github.com/fzaninotto))
* Add a link to `moleculer-data-provider` in Data Providers doc ([3925](https://github.com/marmelab/react-admin/pull/3925)) ([jjgumucio](https://github.com/jjgumucio))

## v3.0.0-beta.6

* Fix `<AutocompleteInput>` `allowEmpty` position ([3953](https://github.com/marmelab/react-admin/pull/3953)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` suggestion list placement ([3951](https://github.com/marmelab/react-admin/pull/3951)) ([fzaninotto](https://github.com/fzaninotto))
* Fix delete wrong item in `<AutocompleteArrayInput>` ([3950](https://github.com/marmelab/react-admin/pull/3950)) ([fzaninotto](https://github.com/fzaninotto))
* Fix click in `<AutocompleteArrayInput>` does not show options ([3949](https://github.com/marmelab/react-admin/pull/3949)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<EnhancedFilterForm>` does not allow style override via classes prop ([3948](https://github.com/marmelab/react-admin/pull/3948)) ([MiMo42](https://github.com/MiMo42))
* Fix `<FieldTitle>` not receiving `label` prop ([3944](https://github.com/marmelab/react-admin/pull/3944)) ([m4theushw](https://github.com/m4theushw))
* Fix js vs jsx markdown styles in docs code. ([3938](https://github.com/marmelab/react-admin/pull/3938)) ([WiXSL](https://github.com/WiXSL))
* Fix docs JSX samples. ([3936](https://github.com/marmelab/react-admin/pull/3936)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectInput resettable` with value doesn't show options on click ([3932](https://github.com/marmelab/react-admin/pull/3932)) ([tdeo](https://github.com/tdeo))
* Fix missing documentation for `allowMissing` Polyglot option ([3930](https://github.com/marmelab/react-admin/pull/3930)) ([fzaninotto](https://github.com/fzaninotto))
* Fix overly aggressive `<EditButton>` memoization ([3929](https://github.com/marmelab/react-admin/pull/3929)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useFilterState` does not react to `permanentFilter` changes ([3928](https://github.com/marmelab/react-admin/pull/3928)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing core constants make `convertLegacyDataProvider` fail ([3927](https://github.com/marmelab/react-admin/pull/3927)) ([fzaninotto](https://github.com/fzaninotto))
* Fix docs examples ([3922](https://github.com/marmelab/react-admin/pull/3922)) ([WiXSL](https://github.com/WiXSL))

## v3.0.0-beta-5

* Fix Erroneous TypeScript types ([fzaninotto](https://github.com/fzaninotto))

## v3.0.0-beta-4

* [BC Break] Remove ra-realtime ([3908](https://github.com/marmelab/react-admin/pull/3908)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<CoreAdminContext>` to ease custom apps ([3907](https://github.com/marmelab/react-admin/pull/3907)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning in `<ResettableTextField>`. ([3904](https://github.com/marmelab/react-admin/pull/3904)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceArrayInput>` does not work in Filters ([3898](https://github.com/marmelab/react-admin/pull/3898)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DateTimeInput>` style differs from other inputs ([3897](https://github.com/marmelab/react-admin/pull/3897)) ([fzaninotto](https://github.com/fzaninotto))
* Fix notifications upgrade guide ([3893](https://github.com/marmelab/react-admin/pull/3893)) ([WiXSL](https://github.com/WiXSL))
* Fix ResettableTextField adornment style ([3891](https://github.com/marmelab/react-admin/pull/3891)) ([tdeo](https://github.com/tdeo))
* Fix `<AutocompleteInput>` default width and margin ([3890](https://github.com/marmelab/react-admin/pull/3890)) ([tdeo](https://github.com/tdeo))
* Fix `<DeleteWithConfirm>` throws exception ([3889](https://github.com/marmelab/react-admin/pull/3889)) ([fzaninotto](https://github.com/fzaninotto))
* Fix incorrect test data in simple example ([3888](https://github.com/marmelab/react-admin/pull/3888)) ([fzaninotto](https://github.com/fzaninotto))
* Fix search field loses its value when a column is sorted ([3887](https://github.com/marmelab/react-admin/pull/3887)) ([m4theushw](https://github.com/m4theushw))
* Fix deprecated React types ([3886](https://github.com/marmelab/react-admin/pull/3886)) ([WiXSL](https://github.com/WiXSL))
* Fix missing await for async operation in test. ([3885](https://github.com/marmelab/react-admin/pull/3885)) ([WiXSL](https://github.com/WiXSL))
* Fix bug when using `<SimpleForm>` with `<ArrayInput>` ([3884](https://github.com/marmelab/react-admin/pull/3884)) ([jinseoplee](https://github.com/jinseoplee))
* Fix typo in example ([3880](https://github.com/marmelab/react-admin/pull/3880)) ([tdeo](https://github.com/tdeo))
* Fix `<TabbedShowLayout>` documentation for scrollable tabs ([3878](https://github.com/marmelab/react-admin/pull/3878)) ([tdeo](https://github.com/tdeo))
* Convert `<RichTextInput>` to a functional component ([3875](https://github.com/marmelab/react-admin/pull/3875)) ([m4theushw](https://github.com/m4theushw))
* Fix broken links in Data Provider docs ([3874](https://github.com/marmelab/react-admin/pull/3874)) ([WiXSL](https://github.com/WiXSL))
* Fix custom user menu does not close after selecting an item in the demo ([3868](https://github.com/marmelab/react-admin/pull/3868)) ([fzaninotto](https://github.com/fzaninotto))
* Fix theme can't be changed dynamically ([3867](https://github.com/marmelab/react-admin/pull/3867)) ([fzaninotto](https://github.com/fzaninotto))
* Fix various typos in the docs. ([3861](https://github.com/marmelab/react-admin/pull/3861)) ([WiXSL](https://github.com/WiXSL))

## v3.0.0-beta.3

* Fix typos and anchors in the docs. ([3860](https://github.com/marmelab/react-admin/pull/3860)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Datagrid>` is not sortable when used inside `<ReferenceManyField>` ([3859](https://github.com/marmelab/react-admin/pull/3859)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` error message color ([3857](https://github.com/marmelab/react-admin/pull/3857)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` does not use custom label ([3855](https://github.com/marmelab/react-admin/pull/3855)) ([fzaninotto](https://github.com/fzaninotto))
* Improve welcome screen look and feel ([3852](https://github.com/marmelab/react-admin/pull/3852)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing `@testing-library/react` dependency([3851](https://github.com/marmelab/react-admin/pull/3851)) ([zyhou](https://github.com/zyhou))

## v3.0.0-beta.2

* Fix `<Datagrid>` has no padding when disabling bulk actions ([3840](https://github.com/marmelab/react-admin/pull/3840)) ([fzaninotto](https://github.com/fzaninotto))
* Fix anchors and uris in the docs. ([3838](https://github.com/marmelab/react-admin/pull/3838)) ([WiXSL](https://github.com/WiXSL))
* [BC Break] Remove `ra-tree` ([3836](https://github.com/marmelab/react-admin/pull/3836)) ([fzaninotto](https://github.com/fzaninotto))
* Fix JSDocs errors ([3829](https://github.com/marmelab/react-admin/pull/3829)) ([WiXSL](https://github.com/WiXSL))
* Fix typos in docs ([3828](https://github.com/marmelab/react-admin/pull/3828)) ([WiXSL](https://github.com/WiXSL))
* Fix imports of routing components to `react-router-dom` ([3825](https://github.com/marmelab/react-admin/pull/3825)) ([thclark](https://github.com/thclark))
* Fix `defaultI18nProvider` Export ([3820](https://github.com/marmelab/react-admin/pull/3820)) ([djhi](https://github.com/djhi))
* Fix warnings Displayed when Overriding Filter Classes ([3817](https://github.com/marmelab/react-admin/pull/3817)) ([djhi](https://github.com/djhi))
* Fix hard to read code due to non-explicit dependencies ([3816](https://github.com/marmelab/react-admin/pull/3816)) ([pemoreau](https://github.com/pemoreau))
* Fix `FinalForm` Props Leak to Root Component ([3815](https://github.com/marmelab/react-admin/pull/3815)) ([djhi](https://github.com/djhi))
* Fix following sonarqube audit ([3798](https://github.com/marmelab/react-admin/pull/3798)) ([pemoreau](https://github.com/pemoreau))
* Fix Upgrade guide order ([3789](https://github.com/marmelab/react-admin/pull/3789)) ([djhi](https://github.com/djhi))
* Fix `ReferenceInput` ignores its `sort` prop ([3783](https://github.com/marmelab/react-admin/pull/3783)) ([djhi](https://github.com/djhi))
* Add `redux-devtools-extension` trace feature in development mode if available ([3781](https://github.com/marmelab/react-admin/pull/3781)) ([WiXSL](https://github.com/WiXSL))
* Fix unstable tests ([3777](https://github.com/marmelab/react-admin/pull/3777)) ([djhi](https://github.com/djhi))
* Fix minor typo in custom data-provider example documentation([3775](https://github.com/marmelab/react-admin/pull/3775)) ([alexisjanvier](https://github.com/alexisjanvier))
* Fix missing deprecated component in Upgrade guide ([3770](https://github.com/marmelab/react-admin/pull/3770)) ([Kmaschta](https://github.com/Kmaschta))
* Add hooks to Reference documentation ([3768](https://github.com/marmelab/react-admin/pull/3768)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing quote in `i18nProvider` upgrade guide ([3766](https://github.com/marmelab/react-admin/pull/3766)) ([mabhub](https://github.com/mabhub))
* Fix example for `useDispatch` hook in upgrade guide ([3765](https://github.com/marmelab/react-admin/pull/3765)) ([mabhub](https://github.com/mabhub))
* Update dependencies for stateful packages to avoid duplicate packages bug ([3763](https://github.com/marmelab/react-admin/pull/3763)) ([kopax](https://github.com/kopax))
* Fix Forms Remove Empty Values ([3758](https://github.com/marmelab/react-admin/pull/3758)) ([djhi](https://github.com/djhi))

## v3.0.0-beta.1

* Failed (and unpublished) release

## v2.9.8

* Rewrite `ra-tree`. The new API isn't backwards compatible, but as ra-tree is considered a "lab" feature, we chose to release it in a minor version. ([3771](https://github.com/marmelab/react-admin/pull/3771)) ([djhi](https://github.com/djhi))
* Add support for custom queries in `ra-data-graphql` ([3839](https://github.com/marmelab/react-admin/pull/3839)) ([djhi](https://github.com/djhi))
* Add theme support in `FileInput` dropzone background ([3823](https://github.com/marmelab/react-admin/pull/3823)) ([despatates](https://github.com/despatates))
* Add link to OpenID Connect advanced example ([3795](https://github.com/marmelab/react-admin/pull/3795)) ([Kmaschta](https://github.com/Kmaschta))
* Fix react-admin dependency in secondary packages ([3791](https://github.com/marmelab/react-admin/pull/3791)) ([manelpb](https://github.com/manelpb))
* Fix trailing slash in url breaks routing ([3788](https://github.com/marmelab/react-admin/pull/3788)) ([djhi](https://github.com/djhi))
* Fix jsDoc in `refresh` side effect ([3780](https://github.com/marmelab/react-admin/pull/3780)) ([gillesdemey](https://github.com/gillesdemey))
* Fix autocomplete of `Password` field on `LoginForm` ([3666](https://github.com/marmelab/react-admin/pull/3666)) ([UltimateForm](https://github.com/UltimateForm))

## v2.9.7

* Fix missing semicolons in docs ([3773](https://github.com/marmelab/react-admin/pull/3773)) ([emptyhand](https://github.com/emptyhand))
* Fix typo in `ra-core` `README` ([3772](https://github.com/marmelab/react-admin/pull/3772)) ([AlexanderOttenhoff](https://github.com/AlexanderOttenhoff))
* Fix `dataProvider` doc uses onFailure instead of onError ([3761](https://github.com/marmelab/react-admin/pull/3761)) ([mchaffotte](https://github.com/mchaffotte))
* Fix `Content-Type` header added for non GET requests. ([3743](https://github.com/marmelab/react-admin/pull/3743)) ([clement-escolano](https://github.com/clement-escolano))
* Fix filter extend order in `ReferenceInputController` ([3740](https://github.com/marmelab/react-admin/pull/3740)) ([TheHyphen](https://github.com/TheHyphen))
* Fix `TabbedForm` does not detect errors when source is a path ([3711](https://github.com/marmelab/react-admin/pull/3711)) ([djhi](https://github.com/djhi))
* Add support for GraphQL Interface type ([3692](https://github.com/marmelab/react-admin/pull/3692)) ([MichielDeMey](https://github.com/MichielDeMey))
* Fix typo in exporter documentation ([3675](https://github.com/marmelab/react-admin/pull/3675)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Move built-in validators documentation order ([3363](https://github.com/marmelab/react-admin/pull/3363)) ([heyfife](https://github.com/heyfife))

## v3.0.0-beta.0

* Ensure Data Provider does not alter the original error ([3757](https://github.com/marmelab/react-admin/pull/3757)) ([djhi](https://github.com/djhi))
* `SimpleForm`/`TabbedForm` - deprecate `defaultValue` ([3756](https://github.com/marmelab/react-admin/pull/3756)) ([djhi](https://github.com/djhi))
* [BC Break] Remove `locale` from `Admin` (the `i18nProvider` defines the initial locale) ([3755](https://github.com/marmelab/react-admin/pull/3755)) ([djhi](https://github.com/djhi))
* Code enhancement: rewrote list merge (without duplicate) and list inclusion ([3754](https://github.com/marmelab/react-admin/pull/3754)) ([pemoreau](https://github.com/pemoreau))
* Code enhancement: remove duplicated code ([3753](https://github.com/marmelab/react-admin/pull/3753)) ([pemoreau](https://github.com/pemoreau))
* Fix mistype ([3752](https://github.com/marmelab/react-admin/pull/3752)) ([yuriydobryanskyyempeek](https://github.com/yuriydobryanskyyempeek))
* Fix `SelectInput` Warnings ([3750](https://github.com/marmelab/react-admin/pull/3750)) ([djhi](https://github.com/djhi))
* Refactor `Layout` ([3749](https://github.com/marmelab/react-admin/pull/3749)) ([djhi](https://github.com/djhi))
* `Form` Related Cleanup ([3748](https://github.com/marmelab/react-admin/pull/3748)) ([djhi](https://github.com/djhi))
* Stabilize tests ([3747](https://github.com/marmelab/react-admin/pull/3747)) ([djhi](https://github.com/djhi))
* Upgrade `react-router` to 5.1 ([3744](https://github.com/marmelab/react-admin/pull/3744)) ([djhi](https://github.com/djhi))
* Add discriminated union type for auth action ([3742](https://github.com/marmelab/react-admin/pull/3742)) ([pemoreau](https://github.com/pemoreau))
* Fix `BooleanInput` does not update on label click ([3736](https://github.com/marmelab/react-admin/pull/3736)) ([djhi](https://github.com/djhi))
* Fix `RadioButtonGroupInput` and `CheckboxGroupInput` Error Display ([3735](https://github.com/marmelab/react-admin/pull/3735)) ([djhi](https://github.com/djhi))
* Fix `FilterForm` Submit ([3732](https://github.com/marmelab/react-admin/pull/3732)) ([djhi](https://github.com/djhi))
* Fix `Notification` text color ([3730](https://github.com/marmelab/react-admin/pull/3730)) ([natrim](https://github.com/natrim))
* Convert `dataProvider` to Object ([3726](https://github.com/marmelab/react-admin/pull/3726)) ([djhi](https://github.com/djhi))
* Fix Form becomes dirty after record initialization ([3721](https://github.com/marmelab/react-admin/pull/3721)) ([djhi](https://github.com/djhi))
* Fix custom `Login` error handling ([3718](https://github.com/marmelab/react-admin/pull/3718)) ([fzaninotto](https://github.com/fzaninotto))
* Use `useSafeSetState` in `CoreAdminRouter` ([3709](https://github.com/marmelab/react-admin/pull/3709)) ([natrim](https://github.com/natrim))
* Upgrade react to 16.9 ([3706](https://github.com/marmelab/react-admin/pull/3706)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `ReferenceArrayInput` to use hooks ([3705](https://github.com/marmelab/react-admin/pull/3705)) ([djhi](https://github.com/djhi))
* [BC Break] Replace `I18nProvider` function by object ([3699](https://github.com/marmelab/react-admin/pull/3699)) ([fzaninotto](https://github.com/fzaninotto))
* Introduce `useGetMatching` and `useReferenceArrayInputController` ([3698](https://github.com/marmelab/react-admin/pull/3698)) ([djhi](https://github.com/djhi))
* Introduce `useGetManyReference` hook ([3697](https://github.com/marmelab/react-admin/pull/3697)) ([djhi](https://github.com/djhi))
* Fix Simple Example Warnings ([3696](https://github.com/marmelab/react-admin/pull/3696)) ([djhi](https://github.com/djhi))
* Replace `authProvider` function by object ([3694](https://github.com/marmelab/react-admin/pull/3694)) ([fzaninotto](https://github.com/fzaninotto))
* Remove useless sagas ([3693](https://github.com/marmelab/react-admin/pull/3693)) ([fzaninotto](https://github.com/fzaninotto))
* Code cleanup ([3688](https://github.com/marmelab/react-admin/pull/3688)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] `i18nProvider` new signature ([3685](https://github.com/marmelab/react-admin/pull/3685)) ([fzaninotto](https://github.com/fzaninotto))
* Introduce `useChoices` & `useSuggestions` hook ([3683](https://github.com/marmelab/react-admin/pull/3683)) ([djhi](https://github.com/djhi))
* [BC Break] Refactor I18n layer to use hooks ([3672](https://github.com/marmelab/react-admin/pull/3672)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] `SimpleFormIterator` - use resource fields label ([3671](https://github.com/marmelab/react-admin/pull/3671)) ([natrim](https://github.com/natrim))
* Add subscription prop to `FormDataConsumer` ([3670](https://github.com/marmelab/react-admin/pull/3670)) ([natrim](https://github.com/natrim))
* [BC Break] New `AutocompleteArrayInput` ([3667](https://github.com/marmelab/react-admin/pull/3667)) ([djhi](https://github.com/djhi))
* `NumberInput` - step needs to be passed in `inputProps` ([3665](https://github.com/marmelab/react-admin/pull/3665)) ([natrim](https://github.com/natrim))
* [BC Break] Reimplement `auth` logic using hooks ([3655](https://github.com/marmelab/react-admin/pull/3655)) ([fzaninotto](https://github.com/fzaninotto))
* Ensure `DeleteButton` is usable when record is not defined at mount time ([3652](https://github.com/marmelab/react-admin/pull/3652)) ([djhi](https://github.com/djhi))
* `SimpleFormIterator` - don't display error if its object ([3651](https://github.com/marmelab/react-admin/pull/3651)) ([natrim](https://github.com/natrim))
* Fix margins are too small in `Show` views ([3648](https://github.com/marmelab/react-admin/pull/3648)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Fix `Confirm` dialog loading bug ([3647](https://github.com/marmelab/react-admin/pull/3647)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Rename `isLoading` to `loading` everywhere ([3644](https://github.com/marmelab/react-admin/pull/3644)) ([fzaninotto](https://github.com/fzaninotto))
* Replace `connect` by hooks in a few components ([3643](https://github.com/marmelab/react-admin/pull/3643)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Migrate `ExportButton` ([3640](https://github.com/marmelab/react-admin/pull/3640)) ([fzaninotto](https://github.com/fzaninotto))
* Fix bad import in `RootDropTarget` ([3638](https://github.com/marmelab/react-admin/pull/3638)) ([natrim](https://github.com/natrim))
* Fix bad import in `PaginationActions` ([3637](https://github.com/marmelab/react-admin/pull/3637)) ([natrim](https://github.com/natrim))

## v3.0.0-alpha.4

* Fix adding a filter overrides displayed filters ([3634](https://github.com/marmelab/react-admin/pull/3634)) ([djhi](https://github.com/djhi))
* Fix FileInput does not react to click ([3628](https://github.com/marmelab/react-admin/pull/3628)) ([natrim](https://github.com/natrim))
* Fix import package in `ra-data-simple-rest` ([3626](https://github.com/marmelab/react-admin/pull/3626)) ([natrim](https://github.com/natrim))
* Add error log in `CoreAdminRouter` when `initializeResources` fails ([3625](https://github.com/marmelab/react-admin/pull/3625)) ([natrim](https://github.com/natrim))
* Fix bad memoization in Input components ([3621](https://github.com/marmelab/react-admin/pull/3621)) ([Evgeny81](https://github.com/Evgeny81))
* Fix missing translation in `NullableBooleanInput` ([3614](https://github.com/marmelab/react-admin/pull/3614)) ([fzaninotto](https://github.com/fzaninotto))
* Add Form Helpers to `ra-core` ([3613](https://github.com/marmelab/react-admin/pull/3613)) ([djhi](https://github.com/djhi))
* Fix backwards compatibility of `Query`, `Mutation`, and `withDataProvider` ([3605](https://github.com/marmelab/react-admin/pull/3605)) ([djhi](https://github.com/djhi))
* Fix broken build due to missing `css-mediaquery` dependency ([3603](https://github.com/marmelab/react-admin/pull/3603)) ([djhi](https://github.com/djhi))
* Fix `SelectArrayInput` overrides choices of `ReferenceArrayInput` ([3602](https://github.com/marmelab/react-admin/pull/3602)) ([djhi](https://github.com/djhi))
* Fix required `ArrayInput` doesn't catch removed items in an `Edit` view ([3601](https://github.com/marmelab/react-admin/pull/3601)) ([djhi](https://github.com/djhi))
* Migrate `NodeForm`, `PaginationActions`, `RootDropTarget`, `AppBar`, `DragLayer`, `DragPreview`, `DataGrid`, `MenuLinkItem`, `Loading`, and `SingleFieldList` to hooks ([3599](https://github.com/marmelab/react-admin/pull/3599)) ([3598](https://github.com/marmelab/react-admin/pull/3598)) ([3596](https://github.com/marmelab/react-admin/pull/3596)) ([3595](https://github.com/marmelab/react-admin/pull/3595)) ([3591](https://github.com/marmelab/react-admin/pull/3591)) ([3589](https://github.com/marmelab/react-admin/pull/3589)) ([3585](https://github.com/marmelab/react-admin/pull/3585)) ([3584](https://github.com/marmelab/react-admin/pull/3584)) ([3583](https://github.com/marmelab/react-admin/pull/3583)) ([3582](https://github.com/marmelab/react-admin/pull/3582)) ([3580](https://github.com/marmelab/react-admin/pull/3580)) ([jaytula](https://github.com/jaytula))
* Improve form look and feel ([3594](https://github.com/marmelab/react-admin/pull/3594)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `SelectArrayInput` to TypeScript ([3592](https://github.com/marmelab/react-admin/pull/3592)) ([djhi](https://github.com/djhi))
* Fix outdated comment on `withStyles` in `LinearProgress` ([3588](https://github.com/marmelab/react-admin/pull/3588)) ([jaytula](https://github.com/jaytula))
* Remove deprecated `LongTextInput` ([3586](https://github.com/marmelab/react-admin/pull/3586)) ([Kunnu01](https://github.com/Kunnu01))
* Update examples in `Theming.md` to use hooks ([3581](https://github.com/marmelab/react-admin/pull/3581)) ([m4theushw](https://github.com/m4theushw))
* Improve form performance ([3577](https://github.com/marmelab/react-admin/pull/3577)) ([fzaninotto](https://github.com/fzaninotto))

## v3.0.0-alpha.3

* Migrate `SelectArrayInput` to hooks ([3576](https://github.com/marmelab/react-admin/pull/3576)) ([djhi](https://github.com/djhi))
* Migrate `SelectArrayInput` to TypeScript ([3592](https://github.com/marmelab/react-admin/pull/3592)) ([djhi](https://github.com/djhi))
* Improve form performance ([3577](https://github.com/marmelab/react-admin/pull/3577)) ([fzaninotto](https://github.com/fzaninotto))
* Improve list performance ([3572](https://github.com/marmelab/react-admin/pull/3572)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `Inputs` To TypeScript/hooks ([3575](https://github.com/marmelab/react-admin/pull/3575)) ([djhi](https://github.com/djhi))
* Migrate `Field` Components ([3574](https://github.com/marmelab/react-admin/pull/3574)) ([djhi](https://github.com/djhi))
* Create/Edit allow changing success message ([3573](https://github.com/marmelab/react-admin/pull/3573)) ([natrim](https://github.com/natrim))
* Migrate `GET_MANY` accumulate saga to hooks ([3550](https://github.com/marmelab/react-admin/pull/3550)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `DragPreview`, `AppBar`, `Loading`, `TreeNode`, `Tree` and `NodeView` to hooks ([3589](https://github.com/marmelab/react-admin/pull/3589)) ([3582](https://github.com/marmelab/react-admin/pull/3582)) ([3583](https://github.com/marmelab/react-admin/pull/3583)) ([3570](https://github.com/marmelab/react-admin/pull/3570)) ([3569](https://github.com/marmelab/react-admin/pull/3569)) ([3568](https://github.com/marmelab/react-admin/pull/3568)) ([jaytula](https://github.com/jaytula))
* Fix typos in DataProvider's documentation ([3565](https://github.com/marmelab/react-admin/pull/3565)) ([pemoreau](https://github.com/pemoreau))
* Add `row` prop to `CheckboxGroupInput` ([3561](https://github.com/marmelab/react-admin/pull/3561)) ([Kunnu01](https://github.com/Kunnu01))
* Fix typo in comment ([3564](https://github.com/marmelab/react-admin/pull/3564)) ([pemoreau](https://github.com/pemoreau))
* [BC Break] Remove `DisabledInput` ([3549](https://github.com/marmelab/react-admin/pull/3549)) ([djhi](https://github.com/djhi))
* Migrate `SaveButton`, `Confirm`, `LinearProgress`, `CardContentInner`, `Error`, `NodeActions`, `LoadingIndicator`, and 10 other components to hooks ([3554](https://github.com/marmelab/react-admin/pull/3554)) ([3546](https://github.com/marmelab/react-admin/pull/3546)) ([3557](https://github.com/marmelab/react-admin/pull/3557)) ([3560](https://github.com/marmelab/react-admin/pull/3560)) ([3559](https://github.com/marmelab/react-admin/pull/3559)) ([3558](https://github.com/marmelab/react-admin/pull/3558)) ([3556](https://github.com/marmelab/react-admin/pull/3556)) ([3555](https://github.com/marmelab/react-admin/pull/3555)) ([jaytula](https://github.com/jaytula))
* `createAdminStore` - set initialState on logout ([3507](https://github.com/marmelab/react-admin/pull/3507)) ([natrim](https://github.com/natrim))
* Change `LongTextInput` to `TextInput` in examples/demo and example / simple ([3553](https://github.com/marmelab/react-admin/pull/3553)) ([3544](https://github.com/marmelab/react-admin/pull/3544)) ([jaytula](https://github.com/jaytula))
* [BC Break] Remove `BulkActions` in V3 ([3517](https://github.com/marmelab/react-admin/pull/3517)) ([Kunnu01](https://github.com/Kunnu01))
* Fix Login on Demo ([3537](https://github.com/marmelab/react-admin/pull/3537))
* Migrate `Input` components to `useInput` and TypeScript ([3566](https://github.com/marmelab/react-admin/pull/3566)) ([3563](https://github.com/marmelab/react-admin/pull/3563)) ([3548](https://github.com/marmelab/react-admin/pull/3548)) ([3539](https://github.com/marmelab/react-admin/pull/3539)) ([3538](https://github.com/marmelab/react-admin/pull/3538)) ([3540](https://github.com/marmelab/react-admin/pull/3540)) ([3523](https://github.com/marmelab/react-admin/pull/3523)) ([3512](https://github.com/marmelab/react-admin/pull/3512)) ([3525](https://github.com/marmelab/react-admin/pull/3525)) ([3527](https://github.com/marmelab/react-admin/pull/3527)) ([3526](https://github.com/marmelab/react-admin/pull/3526)) ([3524](https://github.com/marmelab/react-admin/pull/3524)) ([3522](https://github.com/marmelab/react-admin/pull/3522)) ([3520](https://github.com/marmelab/react-admin/pull/3520)) ([3516](https://github.com/marmelab/react-admin/pull/3516)) ([3511](https://github.com/marmelab/react-admin/pull/3511)) ([3514](https://github.com/marmelab/react-admin/pull/3514)) ([3504](https://github.com/marmelab/react-admin/pull/3504)) ([3513](https://github.com/marmelab/react-admin/pull/3513)) ([3515](https://github.com/marmelab/react-admin/pull/3515)) ([3502](https://github.com/marmelab/react-admin/pull/3502)) ([3501](https://github.com/marmelab/react-admin/pull/3501)) ([3500](https://github.com/marmelab/react-admin/pull/3500)) ([djhi](https://github.com/djhi))
* Temporary migration of `ra-tree` to v3 ([3510](https://github.com/marmelab/react-admin/pull/3510)) ([djhi](https://github.com/djhi))
* Introduce `useInput` hook ([3499](https://github.com/marmelab/react-admin/pull/3499)) ([djhi](https://github.com/djhi))
* Upgrade Cypress ([3528](https://github.com/marmelab/react-admin/pull/3528)) ([djhi](https://github.com/djhi))
* Set key prop on `CheckboxGroupInputItem` ([3536](https://github.com/marmelab/react-admin/pull/3536)) ([jaytula](https://github.com/jaytula))
* Fix typo in `package.json` ([3498](https://github.com/marmelab/react-admin/pull/3498)) ([Kmaschta](https://github.com/Kmaschta))
* Replace `withStyles` with `useStyles` ([3485](https://github.com/marmelab/react-admin/pull/3485)) ([m4theushw](https://github.com/m4theushw))
* Fix `theme.spacing` warning ([3492](https://github.com/marmelab/react-admin/pull/3492)) ([Luwangel](https://github.com/Luwangel))
* Update to `@testing-library/react` ([3489](https://github.com/marmelab/react-admin/pull/3489)) ([djhi](https://github.com/djhi))
* Add `emptyText` prop to `SelectInput` ([3444](https://github.com/marmelab/react-admin/pull/3444)) ([tdeo](https://github.com/tdeo))

## v2.9.6

* Fix too drastic validation of `DELETE` and `DELETE_MANY` dataProvider responses ([3441](https://github.com/marmelab/react-admin/pull/3441)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `SimpleList` showing `ListItem` as button even though `linkType` is false ([3543](https://github.com/marmelab/react-admin/pull/3543)) ([b-raines](https://github.com/b-raines))
* Fix infinite loading when declaring resource at runtime with no `authProvider` ([3505](https://github.com/marmelab/react-admin/pull/3505)) ([Kunnu01](https://github.com/Kunnu01))
* Fix typo in `ra-data-graphql` `README` ([3508](https://github.com/marmelab/react-admin/pull/3508)) ([bookvik](https://github.com/bookvik))
* Fix `<DeleteButton undoable={false} />` does not refresh `List` ([3506](https://github.com/marmelab/react-admin/pull/3506)) ([natrim](https://github.com/natrim))
* Fix typo in `README` ([3497](https://github.com/marmelab/react-admin/pull/3497)) ([arturcarvalho](https://github.com/arturcarvalho))
* Fix various typos in documentation and demo ([3493](https://github.com/marmelab/react-admin/pull/3493)) ([yumi2011](https://github.com/yumi2011))
* Fix `sortable` update has no effect in `Field` components ([3494](https://github.com/marmelab/react-admin/pull/3494)) ([Kunnu01](https://github.com/Kunnu01))
* Fix `AutocompleteArrayInput` not accepting options ([3479](https://github.com/marmelab/react-admin/pull/3479)) ([djhi](https://github.com/djhi))
* Fix `List` data does not update when default `filters` Change ([3308](https://github.com/marmelab/react-admin/pull/3308)) ([djhi](https://github.com/djhi))
* Fix missing imports in `List` documentation ([3469](https://github.com/marmelab/react-admin/pull/3469)) ([Kunnu01](https://github.com/Kunnu01))
* Add link to Swedish translation ([3466](https://github.com/marmelab/react-admin/pull/3466)) ([Kladdy](https://github.com/Kladdy))
* Improve bug report template ([3488](https://github.com/marmelab/react-admin/pull/3488)) ([Kmaschta](https://github.com/Kmaschta))
* Change documentation search engine to Algolia ([3459](https://github.com/marmelab/react-admin/pull/3459)) ([fzaninotto](https://github.com/fzaninotto))

## v3.0.0-alpha.2

* Fix regression in ability to inject a Redux store in `<Admin>` ([3482](https://github.com/marmelab/react-admin/pull/3482)) ([djhi](https://github.com/djhi))
* Fix regression in `<Datagrid>` row height when no bulk action is available ([3480](https://github.com/marmelab/react-admin/pull/3480)) ([djhi](https://github.com/djhi))
* [BC Break] Migrate from redux-form to react-final-form ([3455](https://github.com/marmelab/react-admin/pull/3455)) ([djhi](https://github.com/djhi))
* Fix regression in review accept / reject buttons in demo example ([3473](https://github.com/marmelab/react-admin/pull/3473)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Refactor `useDataProvider` so that it does not use `redux-saga` ([3468](https://github.com/marmelab/react-admin/pull/3468)) ([fzaninotto](https://github.com/fzaninotto))
* Add typechecking of `react-redux` functions and components([3463](https://github.com/marmelab/react-admin/pull/3463)) ([fzaninotto](https://github.com/fzaninotto))
* Upgrade `material-ui` to 4.2.1 ([3457](https://github.com/marmelab/react-admin/pull/3457)) ([djhi](https://github.com/djhi))
* Use `useStyles` in documentation ([3456](https://github.com/marmelab/react-admin/pull/3456)) ([fzaninotto](https://github.com/fzaninotto))

## v3.0.0-alpha.1

* Fix `ReferenceField` link ([3452](https://github.com/marmelab/react-admin/pull/3452)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Reference hooks cleanup ([3446](https://github.com/marmelab/react-admin/pull/3446)) ([fzaninotto](https://github.com/fzaninotto))
* Fix hide filter button isn't aligned with field ([3449](https://github.com/marmelab/react-admin/pull/3449)) ([fzaninotto](https://github.com/fzaninotto))
* Add `useDeleteMany` and useUpdateMany hooks ([3448](https://github.com/marmelab/react-admin/pull/3448)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `LongTextInput` isn't so long ([3450](https://github.com/marmelab/react-admin/pull/3450)) ([fzaninotto](https://github.com/fzaninotto))
* Declare `fetch` side effects as function ([3425](https://github.com/marmelab/react-admin/pull/3425)) ([fzaninotto](https://github.com/fzaninotto))
* Promoting `react-testing-library` as a dependency ([3442](https://github.com/marmelab/react-admin/pull/3442)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Delegate the redirection after logout to `authProvider` ([3269](https://github.com/marmelab/react-admin/pull/3269)) ([djhi](https://github.com/djhi))
* Add `useReferenceInput` ([3313](https://github.com/marmelab/react-admin/pull/3313)) ([ThieryMichel](https://github.com/ThieryMichel))
* Fix dependencies to 3.0.0 ([3440](https://github.com/marmelab/react-admin/pull/3440)) ([fzaninotto](https://github.com/fzaninotto))

## v3.0.0-alpha.0

* Add pagination and sorting params to GET_MANY_REFERENCE ([3412](https://github.com/marmelab/react-admin/pull/3412)) ([m4theushw](https://github.com/m4theushw))
* Use hooks on demo (last PR) ([3345](https://github.com/marmelab/react-admin/pull/3345)) ([zyhou](https://github.com/zyhou))
* Add `useCreateController` hook ([3409](https://github.com/marmelab/react-admin/pull/3409)) ([fzaninotto](https://github.com/fzaninotto))
* Add `useShowController` hook ([3406](https://github.com/marmelab/react-admin/pull/3406)) ([fzaninotto](https://github.com/fzaninotto))
* Add `useEditController` hook ([3398](https://github.com/marmelab/react-admin/pull/3398)) ([fzaninotto](https://github.com/fzaninotto))
* Prevents passing the `sidebarIsOpen` prop to the `<MenuItem>` component ([3393](https://github.com/marmelab/react-admin/pull/3393)) ([m4theushw](https://github.com/m4theushw))
* Add tooltip to menu entries on the sidebar ([3390](https://github.com/marmelab/react-admin/pull/3390)) ([m4theushw](https://github.com/m4theushw))
* Add `useListController` hook ([3377](https://github.com/marmelab/react-admin/pull/3377)) ([fzaninotto](https://github.com/fzaninotto))
* Add auth hooks (`useAuth` and `usePermissions`) ([3368](https://github.com/marmelab/react-admin/pull/3368)) ([fzaninotto](https://github.com/fzaninotto))
* Refactor validators to not return translated errors ([3339](https://github.com/marmelab/react-admin/pull/3339)) ([djhi](https://github.com/djhi))
* Upgrade `react-redux` to version 7.1 ([3349](https://github.com/marmelab/react-admin/pull/3349)) ([fzaninotto](https://github.com/fzaninotto))
* Backport changes from 2.9.2 and 2.9.3 to next ([3344](https://github.com/marmelab/react-admin/pull/3344)) ([fzaninotto](https://github.com/fzaninotto))
* Use `makeStyles` hook on examples demo ([3328](https://github.com/marmelab/react-admin/pull/3328)) ([zyhou](https://github.com/zyhou))
* Replace `tslint` with `eslint` ([3321](https://github.com/marmelab/react-admin/pull/3321)) ([djhi](https://github.com/djhi))
* Add link function to `<ReferenceField>` ([3282](https://github.com/marmelab/react-admin/pull/3282)) ([fargito](https://github.com/fargito))
* Add tabs prop to `<TabbedForm>` to allow injecting custom Tabs component([3288](https://github.com/marmelab/react-admin/pull/3288)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* Add `suggestionLimit` prop to `<AutocompleteArrayInput>` ([3326](https://github.com/marmelab/react-admin/pull/3326)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* [BC Break] Use theme to store sidebar width ([3323](https://github.com/marmelab/react-admin/pull/3323)) ([djhi](https://github.com/djhi))
* [BC Break] Replace `papaparse` with a lighter library ([3324](https://github.com/marmelab/react-admin/pull/3324)) ([djhi](https://github.com/djhi))
* Add `List` performance optimizations ([3320](https://github.com/marmelab/react-admin/pull/3320)) ([fzaninotto](https://github.com/fzaninotto))
* Upgrade, Configure & Apply `prettier` ([3317](https://github.com/marmelab/react-admin/pull/3317)) ([djhi](https://github.com/djhi))
* Add notification on `USER_CHECK` error ([3291](https://github.com/marmelab/react-admin/pull/3291)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* Fix `Layout` component injection ([3315](https://github.com/marmelab/react-admin/pull/3315)) ([djhi](https://github.com/djhi)
* Add `useReferenceArrayField` hook ([3294](https://github.com/marmelab/react-admin/pull/3294)) ([ThieryMichel](https://github.com/ThieryMichel))
* Add `useReferenceMany` hook ([3236](https://github.com/marmelab/react-admin/pull/3236)) ([ThieryMichel](https://github.com/ThieryMichel))
* Migrate simple example to hooks ([3225](https://github.com/marmelab/react-admin/pull/3225)) ([zyhou](https://github.com/zyhou))
* Authenticate `NotFound` page ([3243](https://github.com/marmelab/react-admin/pull/3243)) ([Kmaschta](https://github.com/Kmaschta))
* Add support for `<Datagrid rowClick="toggleSelection">` ([3270](https://github.com/marmelab/react-admin/pull/3270)) ([fargito](https://github.com/fargito))
* Add Crud hooks (`useQuery`, `usequeryWithStore`, `useMutation`, `useGetOne`, `useGetList`) ([3253](https://github.com/marmelab/react-admin/pull/3253)) ([fzaninotto](https://github.com/fzaninotto))
* Replace Headroom by native Material-ui solution for hiding the app bar on scroll ([3247](https://github.com/marmelab/react-admin/pull/3247)) ([fzaninotto](https://github.com/fzaninotto))
* Rename `appLayout` prop to `layout` in `<Admin>` component ([3055](https://github.com/marmelab/react-admin/pull/3055)) ([kopax](https://github.com/kopax))
* Upgrade cypress and add ability to run single test ([3235](https://github.com/marmelab/react-admin/pull/3235)) ([cherniavskii](https://github.com/cherniavskii))
* Add `useReference` hook ([3228](https://github.com/marmelab/react-admin/pull/3228)) ([ThieryMichel](https://github.com/ThieryMichel))
* Move Actions out of the Card ([3214](https://github.com/marmelab/react-admin/pull/3214)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useListParams` hook ([3233](https://github.com/marmelab/react-admin/pull/3233)) ([djhi](https://github.com/djhi))
* Add `useListParams` ([3217](https://github.com/marmelab/react-admin/pull/3217)) ([djhi](https://github.com/djhi))
* Use hooks in controllers ([3213](https://github.com/marmelab/react-admin/pull/3213)) ([djhi](https://github.com/djhi))
* [BC Break] Upgrade `redux-saga` ([3212](https://github.com/marmelab/react-admin/pull/3212)) ([djhi](https://github.com/djhi))
* [BC Break] Upgrade `material-ui` to v4 ([3191](https://github.com/marmelab/react-admin/pull/3191)) ([fzaninotto](https://github.com/fzaninotto))
* Add `useTranslate` hook ([3188](https://github.com/marmelab/react-admin/pull/3188)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Add `useDataProvider` hook ([3181](https://github.com/marmelab/react-admin/pull/3181)) ([fzaninotto](https://github.com/fzaninotto))
* [BC Break] Upgrade dependencies ([3170](https://github.com/marmelab/react-admin/pull/3170)) ([fzaninotto](https://github.com/fzaninotto))

## v2.9.5

* Fix data generator usage example ([3429](https://github.com/marmelab/react-admin/pull/3429)) ([mchaffotte](https://github.com/mchaffotte))
* Fix `<ReferenceArrayInput>` error message when given bad data ([3415](https://github.com/marmelab/react-admin/pull/3415)) ([Kmaschta](https://github.com/Kmaschta))
* Fix List does not update if `AUTH_GET_PERMISSIONS` is slow ([3408](https://github.com/marmelab/react-admin/pull/3408)) ([fzaninotto](https://github.com/fzaninotto))
* Fix click on `<EmailField>` triggers `rowClick` in `<Datagrid>` ([3426](https://github.com/marmelab/react-admin/pull/3426)) ([despatates](https://github.com/despatates))
* Fix click on confirmation dialog text triggers `rowClick` in `<Datagrid>` ([3407](https://github.com/marmelab/react-admin/pull/3407)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing id requirement for Reference fields in `ra-data-graphql-simple` documentation ([3391](https://github.com/marmelab/react-admin/pull/3391)) ([esistgut](https://github.com/esistgut))
* Fix type in `<Lists aside>` documentation ([3388](https://github.com/marmelab/react-admin/pull/3388)) ([firepol](https://github.com/firepol))
* Fix `callback` side effect is not called when using `withDataProvider` ([3385](https://github.com/marmelab/react-admin/pull/3385)) ([djhi](https://github.com/djhi))
* Add mention of `react-admin-google-maps` component library in the Ecosystem documentation ([3410](https://github.com/marmelab/react-admin/pull/3410)) ([gganebnyi](https://github.com/gganebnyi))

## v2.9.4

* Fix closing delete confirmation modal triggers `<Datagrid>` rowClick event ([3360](https://github.com/marmelab/react-admin/pull/3360)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `<DashboardMenuItem>` does not use `className` prop ([3357](https://github.com/marmelab/react-admin/pull/3357)) ([Kmaschta](https://github.com/Kmaschta))
* Fix unused import in tutorial ([3366](https://github.com/marmelab/react-admin/pull/3366)) ([jesseshieh](https://github.com/jesseshieh))
* Fix broken links to material-ui v1 documentation ([3365](https://github.com/marmelab/react-admin/pull/3365)) ([fzaninotto](https://github.com/fzaninotto))
* Fix broken link to Bulk Action Buttons in docs ([3361](https://github.com/marmelab/react-admin/pull/3361)) ([bmuthoga](https://github.com/bmuthoga))
* Fix dead link to material-ui doc in List customization ([3353](https://github.com/marmelab/react-admin/pull/3353)) ([Kmaschta](https://github.com/Kmaschta))
* Fix typo in Custom Input documentation ([3346](https://github.com/marmelab/react-admin/pull/3346)) ([CrossEye](https://github.com/CrossEye))

## v2.9.3

* Fix issue with `<TabbedForm>` when used inside a dialog ([3335](https://github.com/marmelab/react-admin/pull/3335)) ([griiettner](https://github.com/griiettner))
* Fix `<AutoCompleteArrayInput>` not showing error message ([3327](https://github.com/marmelab/react-admin/pull/3327)) ([hithacker](https://github.com/hithacker))
* Fix `<ListView>` component isn't exported ([3319](https://github.com/marmelab/react-admin/pull/3319)) ([cherniavskii](https://github.com/cherniavskii))
* Fix `<MenuItemLink>` `primaryText` documentation ([3316](https://github.com/marmelab/react-admin/pull/3316)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in `callback` side effect documentation ([3297](https://github.com/marmelab/react-admin/pull/3297)) ([0xflotus](https://github.com/0xflotus))
* Fix `<SelectInput>` is resettable even when it's disabled ([3293](https://github.com/marmelab/react-admin/pull/3293)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* Fix `<CheckboxGroupInput>` `options` documentation ([3292](https://github.com/marmelab/react-admin/pull/3292)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* Fix custom `<LogoutButton>` documentation ([3283](https://github.com/marmelab/react-admin/pull/3283)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* Fix posts list export in demo app ([3279](https://github.com/marmelab/react-admin/pull/3279)) ([fargito](https://github.com/fargito))
* Fix nested property filter is hidden on location change but still applied ([3274](https://github.com/marmelab/react-admin/pull/3274)) ([donatascn](https://github.com/donatascn))
* Fix duplicate API call in `<ReferenceArrayInput>` ([3252](https://github.com/marmelab/react-admin/pull/3252)) ([fargito](https://github.com/fargito))
* Fix `<RichTextInput>` validation bugs ([3223](https://github.com/marmelab/react-admin/pull/3223)) ([cherniavskii](https://github.com/cherniavskii))
* Fix `<AutocompleteInput>` popup re-renders after choice is selected ([3190](https://github.com/marmelab/react-admin/pull/3190)) ([FACOLOMBANI](https://github.com/FACOLOMBANI))
* Replace tslint with eslint (because tslint is deprecated) ([3322](https://github.com/marmelab/react-admin/pull/3322)) ([djhi](https://github.com/djhi))
* Update Prettier ([3304](https://github.com/marmelab/react-admin/pull/3304)) ([djhi](https://github.com/djhi))
* Add `ra-auth-acl` to the ecosystem ([3301](https://github.com/marmelab/react-admin/pull/3301)) ([Kmaschta](https://github.com/Kmaschta))
* Add pre-commit hooks to ensure code style is consistent on commits ([3306](https://github.com/marmelab/react-admin/pull/3306)) ([3334](https://github.com/marmelab/react-admin/pull/3334)) ([djhi](https://github.com/djhi))

## v2.9.2

* Fix spinner position in Login and Save buttons ([3276](https://github.com/marmelab/react-admin/pull/3276)) ([Luwangel](https://github.com/Luwangel))
* Fix slow List view when fetching lots of rows ([3275](https://github.com/marmelab/react-admin/pull/3275)) ([slecoustre](https://github.com/slecoustre))
* Fix `<BooleanInput>` does not show errors ([3271](https://github.com/marmelab/react-admin/pull/3271)) ([fargito](https://github.com/fargito))
* Fix `<Query>` component sending request on every update ([3267](https://github.com/marmelab/react-admin/pull/3267)) ([fargito](https://github.com/fargito))
* Fix duplicated entry in Reference documentation ([3259](https://github.com/marmelab/react-admin/pull/3259)) ([mabhub](https://github.com/mabhub))
* Fix duplicated code formatting rules ([3258](https://github.com/marmelab/react-admin/pull/3258)) ([fargito](https://github.com/fargito))
* Fix empty list after changing the items per page count ([3257](https://github.com/marmelab/react-admin/pull/3257)) ([sagarbakhtar](https://github.com/sagarbakhtar))
* Fix `<RichTextInput>` does not use theme color to show focus ([3231](https://github.com/marmelab/react-admin/pull/3231)) ([cherniavskii](https://github.com/cherniavskii))
* Add Bulgarian translation link ([3260](https://github.com/marmelab/react-admin/pull/3260)) ([ptodorov0](https://github.com/ptodorov0))

## v2.9.1

* Fix handling of deleted references ([3216](https://github.com/marmelab/react-admin/pull/3216)) ([djhi](https://github.com/djhi))
* Fix warning in Login page ([3195](https://github.com/marmelab/react-admin/pull/3195)) ([cherniavskii](https://github.com/cherniavskii))
* Fix improperly named `RejectButton` class name in demo ([3182](https://github.com/marmelab/react-admin/pull/3182)) ([ericwb](https://github.com/ericwb))
* Fix outdated mention in Authentication documentation ([3177](https://github.com/marmelab/react-admin/pull/3177)) ([joehillen](https://github.com/joehillen))
* Add link to NextJs Crud dataprovider ([3201](https://github.com/marmelab/react-admin/pull/3201)) ([gganebnyi](https://github.com/gganebnyi))
* Add markdown input package to the Ecosystem documentation ([3204](https://github.com/marmelab/react-admin/pull/3204)) ([maluramichael](https://github.com/maluramichael))

## v2.9.0

* Add support for styled `<ListView>`, `<EditView>`, `<CreateView>`, and `<ShowView>` components ([3161](https://github.com/marmelab/react-admin/pull/3161)) ([cherniavskii](https://github.com/cherniavskii))
* Add support for nested records in `source` prop of `<ReferenceManyField>` ([3159](https://github.com/marmelab/react-admin/pull/3159)) ([aramando](https://github.com/aramando))
* Add ability to reload translation without changing locale ([3152](https://github.com/marmelab/react-admin/pull/3152)) ([nik-lampe](https://github.com/nik-lampe))
* Add the ability to style the `Tab` contents in `Show` and `Edit` views ([2996](https://github.com/marmelab/react-admin/pull/2996)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to sort `<Datagrid>` by descending order by default ([2921](https://github.com/marmelab/react-admin/pull/2921)) ([frankPairs](https://github.com/frankPairs))
* Fix `propTypes` warning when using `<ArrayField sortable={false} />` ([3164](https://github.com/marmelab/react-admin/pull/3164)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid rowClick />` when using a function value returning empty redirect value ([3156](https://github.com/marmelab/react-admin/pull/3156)) ([tunglt1810](https://github.com/tunglt1810))
* Fix `<AutocompleteArrayInput>` wrapping when there are many selected options ([3131](https://github.com/marmelab/react-admin/pull/3131)) ([cherniavskii](https://github.com/cherniavskii))
* Fix circular dependency in `ra-data-graphql-simple` data provider ([3093](https://github.com/marmelab/react-admin/pull/3093)) ([GM-Alex](https://github.com/GM-Alex))
* Add `ra-cognito` authentication provider to the Ecosystem documentation ([3163](https://github.com/marmelab/react-admin/pull/3163)) ([anthonycmain](https://github.com/anthonycmain))

## v2.8.6

* Fix `<Mutation>` documentation showing wrong `notification` side effect syntax ([3147](https://github.com/marmelab/react-admin/pull/3147)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Query>` component does not fetch again when updated ([3146](https://github.com/marmelab/react-admin/pull/3146)) ([fzaninotto](https://github.com/fzaninotto))
* Allow to override `Popper` props in `<AutocompleteArrayInput>` ([3145](https://github.com/marmelab/react-admin/pull/3145)) ([cherniavskii](https://github.com/cherniavskii))
* Fix history console warnings ([3144](https://github.com/marmelab/react-admin/pull/3144)) ([fzaninotto](https://github.com/fzaninotto))
* Fix various typos in tutorial ([3135](https://github.com/marmelab/react-admin/pull/3135)) ([pemoreau](https://github.com/pemoreau))
* Fix undefined id in `<RadioButtonGroupInput>` ([3123](https://github.com/marmelab/react-admin/pull/3123)) ([johncalvinroberts](https://github.com/johncalvinroberts))
* Fix typo in `ra-input-rich-text` internal component name ([3109](https://github.com/marmelab/react-admin/pull/3109)) ([ruiyangliu](https://github.com/ruiyangliu))
* Fix unnecessary update of `<RichTextInput>` on edit ([3099](https://github.com/marmelab/react-admin/pull/3099)) ([roychoo](https://github.com/roychoo))
* Fix filter id applied incorrectly to get many ref in `ra-data-graphql-simple` ([2649](https://github.com/marmelab/react-admin/pull/2649)) ([redorb](https://github.com/redorb))
* Migrate `ra-ui-materialui` field components to TypeScript ([3091](https://github.com/marmelab/react-admin/pull/3091)) ([Kmaschta](https://github.com/Kmaschta))
* Migrate `ra-ui-materialui` auth components to TypeScript ([2984](https://github.com/marmelab/react-admin/pull/2984)) ([djhi](https://github.com/djhi))
* Add license scan report and status ([3100](https://github.com/marmelab/react-admin/pull/3100)) ([fossabot](https://github.com/fossabot))
* Add Hebrew translation ([3133](https://github.com/marmelab/react-admin/pull/3133)) ([ak-il](https://github.com/ak-il))

## v2.8.5

* Fix links to CodeSandbox become outdated rapidly ([3095](https://github.com/marmelab/react-admin/pull/3095)) ([fzaninotto](https://github.com/fzaninotto))
* Fix simple example dependencies ([3094](https://github.com/marmelab/react-admin/pull/3094)) ([fzaninotto](https://github.com/fzaninotto))
* Fix reducer test skipped because of bad suffix ([3092](https://github.com/marmelab/react-admin/pull/3092)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in `<DatagridRow>` ([3089](https://github.com/marmelab/react-admin/pull/3089)) ([romakv4](https://github.com/romakv4))
* Fix resource translation in delete confirmation dialog ([3086](https://github.com/marmelab/react-admin/pull/3086)) ([fzaninotto](https://github.com/fzaninotto))
* Fix deprecation warnings for recent react-router releases ([3085](https://github.com/marmelab/react-admin/pull/3085)) ([fzaninotto](https://github.com/fzaninotto))
* Fix demo uses deprecated menu customization syntax ([3084](https://github.com/marmelab/react-admin/pull/3084)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ExportButton>` ignores permanent `filter` from `<List>` ([3083](https://github.com/marmelab/react-admin/pull/3083)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid>` cells have non unique ids ([3082](https://github.com/marmelab/react-admin/pull/3082)) ([fzaninotto](https://github.com/fzaninotto))
* Fix delete confirmation dialog triggers `rowClick`([3080](https://github.com/marmelab/react-admin/pull/3080)) ([fzaninotto](https://github.com/fzaninotto))
* Fix expand icon overlaps actions in tree view ([3064](https://github.com/marmelab/react-admin/pull/3064)) ([macrozone](https://github.com/macrozone))
* Fix custom actions cannot override `basePath` ([3043](https://github.com/marmelab/react-admin/pull/3043)) ([kopax](https://github.com/kopax))
* Fix wrong scalar types into variables for `ra-data-graphql-simple` ([3036](https://github.com/marmelab/react-admin/pull/3036)) ([Artexoid](https://github.com/Artexoid))
* Improve drawer animation of review edition in Posters Galore demo ([2945](https://github.com/marmelab/react-admin/pull/2945)) ([djhi](https://github.com/djhi))
* Turn data generator for demo into a public repository ([3096](https://github.com/marmelab/react-admin/pull/3096)) ([fzaninotto](https://github.com/fzaninotto))

## v2.8.4

* Fix typo in ra-data-graphql documentation ([3074](https://github.com/marmelab/react-admin/pull/3074)) ([erichgoldman](https://github.com/erichgoldman))
* Fix missing dependencies breaking installation with pnpm ([3032](https://github.com/marmelab/react-admin/pull/3032)) ([cortopy](https://github.com/cortopy))
* Fix missing component import in tutorial ([3060](https://github.com/marmelab/react-admin/pull/3060)) ([matimendez88](https://github.com/matimendez88))
* Fix bad pluralization of the confirmation message in `<BulkDeleteWithConfirmButton>` ([3058](https://github.com/marmelab/react-admin/pull/3058)) ([Luwangel](https://github.com/Luwangel))
* Fix warning caused by passing `undoable` prop from `<Toolbar>` ([3057](https://github.com/marmelab/react-admin/pull/3057)) ([NikitaVlaznev](https://github.com/NikitaVlaznev))
* Fix warning caused by passing `submitOnEnter` prop from `<Toolbar>` ([3056](https://github.com/marmelab/react-admin/pull/3056)) ([NikitaVlaznev](https://github.com/NikitaVlaznev))
* Add links to 4 new advanced tutorials doc ([3063](https://github.com/marmelab/react-admin/pull/3063)) ([djhi](https://github.com/djhi))

## v2.8.3

* Fix `<Query>` does not pass `total` from `dataProvider` result ([3046](https://github.com/marmelab/react-admin/pull/3046)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `<WithPermissions>` documentation to explain `authParams` ([3053](https://github.com/marmelab/react-admin/pull/3053)) ([kopax](https://github.com/kopax))
* Fix custom `<LogoutButton>` documentation on redirection ([3044](https://github.com/marmelab/react-admin/pull/3044)) ([Kmaschta](https://github.com/Kmaschta))
* Fix useless template literal in `<ListController>` ([3039](https://github.com/marmelab/react-admin/pull/3039)) ([kopax](https://github.com/kopax))
* Fix typo in `customRoutes` code example in `<Admin>` component documentation ([3038](https://github.com/marmelab/react-admin/pull/3038)) ([farandal](https://github.com/farandal))
* Fix misleading example about logout action creator usage in Authentication documentation ([3034](https://github.com/marmelab/react-admin/pull/3034)) ([Kmaschta](https://github.com/Kmaschta))
* Fix unused `debounce` prop in `<Filter>` ([3015](https://github.com/marmelab/react-admin/pull/3015)) ([developerium](https://github.com/developerium))
* Fix PropTypes of `<RichTextInput>` `toolbar` prop ([3024](https://github.com/marmelab/react-admin/pull/3024)) ([batbyR](https://github.com/batbyR))
* Fix `<AutocompleteInput>` `helperText` not working inside `<ReferenceInput>` ([3023](https://github.com/marmelab/react-admin/pull/3023)) ([vdieulesaint](https://github.com/vdieulesaint))
* Add Taiwanese translation ([3054](https://github.com/marmelab/react-admin/pull/3054)) ([areyliu6](https://github.com/areyliu6))

## v2.8.2

* Fix `<CloneButton>` double redirection when used in `<Datagrid>` with `rowClick` ([3006](https://github.com/marmelab/react-admin/pull/3006)) ([akshah123](https://github.com/akshah123))
* Fix `<AutocompleteInput>` crashes when a choice doesn't have a string value ([3004](https://github.com/marmelab/react-admin/pull/3004)) ([developerium](https://github.com/developerium))
* Fix outdated i18n syntax in `ra-tree-material-ui` documentation ([3002](https://github.com/marmelab/react-admin/pull/3002)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ra-data-graphql-simple` handling of UPDATE mutations ([3001](https://github.com/marmelab/react-admin/pull/3001)) ([djhi](https://github.com/djhi))
* Fix missing mention of compulsory `buildQuery` param in `ra-data-graphql` ([2999](https://github.com/marmelab/react-admin/pull/2999)) ([fzaninotto](https://github.com/fzaninotto))
* Fix misleading documentation about auth failure redirection ([2997](https://github.com/marmelab/react-admin/pull/2997)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated screencast in `ra-tree` documentation ([2995](https://github.com/marmelab/react-admin/pull/2995)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning when creating custom `<Menu>` based on source ([2994](https://github.com/marmelab/react-admin/pull/2994)) ([fzaninotto](https://github.com/fzaninotto))
* Fix the graphql demo ([2993](https://github.com/marmelab/react-admin/pull/2993)) ([djhi](https://github.com/djhi))
* Fix `<AutocompleteInput>` choices are displayed again after selection ([2992](https://github.com/marmelab/react-admin/pull/2992)) ([djhi](https://github.com/djhi))
* Add German translation for the tree package ([3014](https://github.com/marmelab/react-admin/pull/3014)) ([straurob](https://github.com/straurob))

## v2.8.1

* Fix `<DeleteWithConfirmButton>` ([2989](https://github.com/marmelab/react-admin/pull/2989)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Typescript Import Errors ([2988](https://github.com/marmelab/react-admin/pull/2988)) ([fzaninotto](https://github.com/fzaninotto))

## v2.8.0

✨✨✨ React-admin has reached 7,000 stars on GitHub! Thank you all for your support; ✨✨✨

For highlights about this version, read [the react-admin 2.8 announcement blog post](https://marmelab.com/blog/2019/03/15/react-admin-2-8.html) on the Marmelab blog.

* Add `withDataProvider` HOC and `<Query>`/`<Mutation>` components to ease custom queries ([2899](https://github.com/marmelab/react-admin/pull/2899)) ([ThieryMichel](https://github.com/ThieryMichel))
* Add confirmation dialog to non-undoable delete buttons ([2955](https://github.com/marmelab/react-admin/pull/2955)) ([fzaninotto](https://github.com/fzaninotto))
* Add an optional `emptyValue` to `<SelectInput>` ([2780](https://github.com/marmelab/react-admin/pull/2780)) ([edy](https://github.com/edy))
* Add ability to pass `disableRemove` prop to `<SimpleFormIterator>` ([2850](https://github.com/marmelab/react-admin/pull/2850)) ([travisMichael](https://github.com/travisMichael))
* Add 6 new data providers to the ecosystem documentation ([2959](https://github.com/marmelab/react-admin/pull/2959)) ([fzaninotto](https://github.com/fzaninotto))
* Add search engine to documentation (powered by Qwant) ([2972](https://github.com/marmelab/react-admin/pull/2972)) ([fzaninotto](https://github.com/fzaninotto))
* Add arabic translation ([2987](https://github.com/marmelab/react-admin/pull/2987)) ([developerium](https://github.com/developerium))
* Migrate first ra-ui-materialui components to TypeScript ([2982](https://github.com/marmelab/react-admin/pull/2982)) ([djhi](https://github.com/djhi))
* Fix TypeScript false positives ([2979](https://github.com/marmelab/react-admin/pull/2979)) ([djhi](https://github.com/djhi))
* Fix typo in Tutorial ([2986](https://github.com/marmelab/react-admin/pull/2986)) ([KayO](https://github.com/KayO))-GH
* Fix `FormDataConsumer` TypeScript signature to prevent false positives on required props ([2974](https://github.com/marmelab/react-admin/pull/2974)) ([joehillen](https://github.com/joehillen))
* Fix typo in `<TranslationProvider>` JSDoc ([2973](https://github.com/marmelab/react-admin/pull/2973)) ([ruiyangliu](https://github.com/ruiyangliu))
* Fix IE11 layout problem ([2969](https://github.com/marmelab/react-admin/pull/2969)) ([batbyR](https://github.com/batbyR))
* Fix multiple redirect events on auth error ([2960](https://github.com/marmelab/react-admin/pull/2960)) ([fxzhukov](https://github.com/fxzhukov))

## v2.7.3

* Fix demo installation documentation ([2958](https://github.com/marmelab/react-admin/pull/2958)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated `<FlatButton>` mention in Actions documentation ([2956](https://github.com/marmelab/react-admin/pull/2956)) ([mvanmeerbeck](https://github.com/mvanmeerbeck))
* Fix outdated `<Menu>` component signature in Authorization documentation ([2948](https://github.com/marmelab/react-admin/pull/2948)) ([NikitaVlaznev](https://github.com/NikitaVlaznev))
* Fix button color prop example in the List documentation ([2946](https://github.com/marmelab/react-admin/pull/2946)) ([developerium](https://github.com/developerium))
* Fix build minification failing due to typo in `ra-language-french` ([2944](https://github.com/marmelab/react-admin/pull/2944)) ([vdieulesaint](https://github.com/vdieulesaint))
* Fix `<MenuItemLink>` propTypes and documentation ([2932](https://github.com/marmelab/react-admin/pull/2932)) ([djhi](https://github.com/djhi))
* Fix autocomplete height on `<AutocompleteArrayInput>` ([2914](https://github.com/marmelab/react-admin/pull/2914)) ([tiagoschenkel](https://github.com/tiagoschenkel))
* Fix `<RichTextInput>` does not update when content is changed outside the editor ([2930](https://github.com/marmelab/react-admin/pull/2930)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing export and documentation for `<TabbedShowLayoutTabs>` ([2929](https://github.com/marmelab/react-admin/pull/2929)) ([lucas2595](https://github.com/lucas2595))
* Fix position of suggestions container on `<AutocompleteInput>` ([2928](https://github.com/marmelab/react-admin/pull/2928)) ([tiagoschenkel](https://github.com/tiagoschenkel))
* Fix warning about missing translation for empty key ([2922](https://github.com/marmelab/react-admin/pull/2922)) ([Luwangel](https://github.com/Luwangel))
* Migrate Core Components to TypeScript ([2924](https://github.com/marmelab/react-admin/pull/2924)) ([djhi](https://github.com/djhi))
* Update dependencies in CodeSandbox ([2950](https://github.com/marmelab/react-admin/pull/2950)) ([Kmaschta](https://github.com/Kmaschta))

## v2.7.2

* Fix JSONPlaceHolder name typo in Tutorial ([2906](https://github.com/marmelab/react-admin/pull/2906)) ([noobling](https://github.com/noobling))
* Fix `<CloneButton>` documentation missing warning ([2904](https://github.com/marmelab/react-admin/pull/2904)) ([mnlbox](https://github.com/mnlbox))
* Fix prop types for `<ArrayInput>` ([2898](https://github.com/marmelab/react-admin/pull/2898)) ([kujon](https://github.com/kujon))
* Fix typo in jsDoc in Tutorial ([2882](https://github.com/marmelab/react-admin/pull/2882)) ([adibnaya](https://github.com/adibnaya))
* Fix `GET_MANY` in `ra-data-json-server` data provider returns too many results ([2873](https://github.com/marmelab/react-admin/pull/2873)) ([paradoxxxzero](https://github.com/paradoxxxzero))
* Fix import path typo in Unit Testing documentation ([2872](https://github.com/marmelab/react-admin/pull/2872)) ([mexitalian](https://github.com/mexitalian))
* Fix `<AutocompleteArrayInput>` throws an error when receiving an empty value ([2861](https://github.com/marmelab/react-admin/pull/2861)) ([tiagoschenkel](https://github.com/tiagoschenkel))
* Fix `<AutocompleteArrayInput>` shows choices in a wrong position when input element moves to another location ([2860](https://github.com/marmelab/react-admin/pull/2860)) ([tiagoschenkel](https://github.com/tiagoschenkel))
* Migrate `ra-core` controllers to TypeScript ([2881](https://github.com/marmelab/react-admin/pull/2881)) ([djhi](https://github.com/djhi))
* Migrate `ra-core` inference to TypeScript ([2879](https://github.com/marmelab/react-admin/pull/2879)) ([djhi](https://github.com/djhi))
* Migrate `ra-core` form to TypeScript ([2878](https://github.com/marmelab/react-admin/pull/2878)) ([djhi](https://github.com/djhi))
* Migrate `ra-core` i18n Migration to TypeScript ([2874](https://github.com/marmelab/react-admin/pull/2874)) ([djhi](https://github.com/djhi))

## v2.7.1

* Fix typo in `ra-data-graphql-simple` documentation ([2863](https://github.com/marmelab/react-admin/pull/2863)) ([EricTousignant](https://github.com/EricTousignant))
* Fix typo in French messages ([2858](https://github.com/marmelab/react-admin/pull/2858)) ([Benew](https://github.com/Benew))
* Fix `<SelectField>` example snippet on the docs ([2854](https://github.com/marmelab/react-admin/pull/2854)) ([ofpau](https://github.com/ofpau))
* Migrate reducers to TypeScript ([2857](https://github.com/marmelab/react-admin/pull/2857)) ([fzaninotto](https://github.com/fzaninotto))
* Add Parse Client to data providers ([2852](https://github.com/marmelab/react-admin/pull/2852)) ([almahdi](https://github.com/almahdi))
* Upgrade prettier and apply format ([2849](https://github.com/marmelab/react-admin/pull/2849)) ([fzaninotto](https://github.com/fzaninotto))

## v2.7.0

* Add support for `rowClick="expand"` in `<Datagrid>` ([2820](https://github.com/marmelab/react-admin/pull/2820)) ([fzaninotto](https://github.com/fzaninotto))
* Add an alert preventing data loss when a user closes the app while in optimistic mode ([2784](https://github.com/marmelab/react-admin/pull/2784)) ([fzaninotto](https://github.com/fzaninotto))
* Add the ability to customize the `<AppBar>` content ([2777](https://github.com/marmelab/react-admin/pull/2777)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `<Redirect>` in `customRoutes` ([2771](https://github.com/marmelab/react-admin/pull/2771)) ([kopax](https://github.com/kopax))
* Add accessibility to `<BooleanField>` ([2744](https://github.com/marmelab/react-admin/pull/2744)) ([djhi](https://github.com/djhi))
* Add `options` prop to `<TabbedShowLayout>` ([2740](https://github.com/marmelab/react-admin/pull/2740)) ([lucas2595](https://github.com/lucas2595))
* Add more examples to the Posters Galore demo ([2799](https://github.com/marmelab/react-admin/pull/2799)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `shouldRenderSuggestions` prop in `<AutocompleteArrayInput>` ([2720](https://github.com/marmelab/react-admin/pull/2720)) ([davidpicarra](https://github.com/davidpicarra))
* Update default list page name (remove "List") ([2801](https://github.com/marmelab/react-admin/pull/2801)) ([fzaninotto](https://github.com/fzaninotto))
* Remove Graphcool demo([2821](https://github.com/marmelab/react-admin/pull/2821)) ([fzaninotto](https://github.com/fzaninotto))
* Fix tests disabled by mistake may hide failing test cases ([2845](https://github.com/marmelab/react-admin/pull/2845)) ([Luwangel](https://github.com/Luwangel))

## v2.6.4

* Fix `<CreateButton>` not being re-translated when language changes at runtime ([2842](https://github.com/marmelab/react-admin/pull/2842)) ([maoueh](https://github.com/maoueh))
* Fix `prettier` maintenance command ([2839](https://github.com/marmelab/react-admin/pull/2839)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` reopens after selection ([2836](https://github.com/marmelab/react-admin/pull/2836)) ([djhi](https://github.com/djhi))
* Fix e2e tests fail on Chrome 72 ([2834](https://github.com/marmelab/react-admin/pull/2834)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` issues by removing auto selection ([2833](https://github.com/marmelab/react-admin/pull/2833)) ([djhi](https://github.com/djhi))
* Fix default values for `<Filter>` cannot be removed by user ([2831](https://github.com/marmelab/react-admin/pull/2831)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing `formMiddleware` export preventing custom apps to work ([2828](https://github.com/marmelab/react-admin/pull/2828)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RichTextInput>` adds extra paragraph element after list items ([2826](https://github.com/marmelab/react-admin/pull/2826)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `asyncValidation` issue for `<SelectInput>` ([2825](https://github.com/marmelab/react-admin/pull/2825)) ([erkimiilberg](https://github.com/erkimiilberg))
* Migrate remaining actions and side effects to Typescript ([2824](https://github.com/marmelab/react-admin/pull/2824)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated documentation about `messages` prop in `<Admin>` ([2822](https://github.com/marmelab/react-admin/pull/2822)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning when using `<Pagination>` in `<ReferenceManyField>` ([2819](https://github.com/marmelab/react-admin/pull/2819)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning in `<CloneButton>` when used inside `<Toolbar>` ([2818](https://github.com/marmelab/react-admin/pull/2818)) ([fzaninotto](https://github.com/fzaninotto))
* Fix error when using `<Edit>` component as `expand` in `<List>` ([2817](https://github.com/marmelab/react-admin/pull/2817)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DeleteButton undoable={false} />` in `<List />` does not refresh List ([2662](https://github.com/marmelab/react-admin/pull/2662)) ([BartoGabriel](https://github.com/BartoGabriel))
* Update link to Dutch translation package ([2814](https://github.com/marmelab/react-admin/pull/2814)) ([nickwaelkens](https://github.com/nickwaelkens))
* Add mention of new data provider `ra-strapi-rest` ([2796](https://github.com/marmelab/react-admin/pull/2796)) ([nazirov91](https://github.com/nazirov91))
* Remove mention of react Context in the translation documentation ([2841](https://github.com/marmelab/react-admin/pull/2841)) ([maoueh](https://github.com/maoueh))

## v2.6.3

* Fix sanitization of `<DeleteButton>` props ([2810](https://github.com/marmelab/react-admin/pull/2810)) ([djhi](https://github.com/djhi))
* Fix display order of selected choices in their in `<SelectArrayInput>` ([2806](https://github.com/marmelab/react-admin/pull/2806)) ([Luwangel](https://github.com/Luwangel))
* Add explanation about Material UI version on the FAQ ([2797](https://github.com/marmelab/react-admin/pull/2797)) ([Kmaschta](https://github.com/Kmaschta))
* Add Firestore Data Provider ([2778](https://github.com/marmelab/react-admin/pull/2778)) ([rafalzawadzki](https://github.com/rafalzawadzki))

## v2.6.2

* Fix prop type warning in `Datagrid` sort prop ([2794](https://github.com/marmelab/react-admin/pull/2794)) ([santaclauze](https://github.com/santaclauze))
* Fix vulnerability in webpack development tools (did not affect production builds) ([2788](https://github.com/marmelab/react-admin/pull/2788)) ([fzaninotto](https://github.com/fzaninotto))
* Fix optimistic actions never get sent when changing tabs ([2785](https://github.com/marmelab/react-admin/pull/2785)) ([fzaninotto](https://github.com/fzaninotto))
* Fix bulk deletion keeps deleted items in selected ids ([2774](https://github.com/marmelab/react-admin/pull/2774)) ([g3offrey](https://github.com/g3offrey))
* Fix `ReferenceInput` documentation mentions wrong data provider verb ([2764](https://github.com/marmelab/react-admin/pull/2764)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RichTextInput>` not working on IE11 ([2676](https://github.com/marmelab/react-admin/pull/2676)) ([phacks](https://github.com/phacks))
* Fix missing translation key in `Pagination` ([2762](https://github.com/marmelab/react-admin/pull/2762)) ([kopax](https://github.com/kopax))
* Add explicit error message when required props are missing in `Create`, `Edit`, `Show`, and `List` controllers ([2782](https://github.com/marmelab/react-admin/pull/2782)) ([Kmaschta](https://github.com/Kmaschta))
* Add documentation about dispatching actions within `<FormDataConsumer>` ([2775](https://github.com/marmelab/react-admin/pull/2775)) ([fzaninotto](https://github.com/fzaninotto))
* Add Hasura data provider ([2791](https://github.com/marmelab/react-admin/pull/2791)) ([praveenweb](https://github.com/praveenweb))
* Add JSDoc to validators for easier debugging ([2773](https://github.com/marmelab/react-admin/pull/2773)) ([fzaninotto](https://github.com/fzaninotto))
* Migrate `ra-core` util scripts to TypeScript ([2787](https://github.com/marmelab/react-admin/pull/2787)) ([fzaninotto](https://github.com/fzaninotto))

## v2.6.1

* Fix welcome message appears in production when permissions lead to no resource ([2759](https://github.com/marmelab/react-admin/pull/2759)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning when using `fullWidth` with `BooleanInput` ([2758](https://github.com/marmelab/react-admin/pull/2758)) ([djhi](https://github.com/djhi))
* Fix incomplete optimistic handling in delete and update ([2756](https://github.com/marmelab/react-admin/pull/2756)) ([djhi](https://github.com/djhi))
* Fix double attribute declaration in `LoginForm` causes error in IE11 ([2754](https://github.com/marmelab/react-admin/pull/2754)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ReferenceManyField` doesn't rerender when the filter props changes ([2753](https://github.com/marmelab/react-admin/pull/2753)) ([kandebr](https://github.com/kandebr))
* Fix `CheckboxGroupInput` design ([2751](https://github.com/marmelab/react-admin/pull/2751)) ([Luwangel](https://github.com/Luwangel))
* Fix propType warning when using `exporter false` in List ([2746](https://github.com/marmelab/react-admin/pull/2746)) ([afilp](https://github.com/afilp))
* Fix `<Confirm>` element isn't translatable ([2739](https://github.com/marmelab/react-admin/pull/2739)) ([djhi](https://github.com/djhi))
* Improve documentation about unit testing authorization logic ([2728](https://github.com/marmelab/react-admin/pull/2728)) ([Kmaschta](https://github.com/Kmaschta))
* Update italian translation url ([2725](https://github.com/marmelab/react-admin/pull/2725)) ([stefsava](https://github.com/stefsava))

## v2.6.0

For highlights about this version, read [the react-admin 2.6 announcement blog post](https://marmelab.com/blog/2019/01/09/react-admin-2-6.html) on the Marmelab blog.

* Add skeleton to `<Datagrid>` when loading the data for the first time ([2706](https://github.com/marmelab/react-admin/pull/2706)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to attach an expansion panel to a `<Datagrid>` row ([2634](https://github.com/marmelab/react-admin/pull/2634)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to hide the `<ExportButton>` in the `<List>` ([2638](https://github.com/marmelab/react-admin/pull/2638)) ([afilp](https://github.com/afilp))
* Add the current record as parameter to the `rowClick` function ([2625](https://github.com/marmelab/react-admin/pull/2625)) ([djhi](https://github.com/djhi))
* Add logged out notification when the `authProvider` throws a fetch error ([2733](https://github.com/marmelab/react-admin/pull/2733)) ([ThieryMichel](https://github.com/ThieryMichel))
* Add ability to extend the buttons `onClick` handlers ([2640](https://github.com/marmelab/react-admin/pull/2640)) ([djhi](https://github.com/djhi))
* Add ability to override `<Datagrid>` header style ([2709](https://github.com/marmelab/react-admin/pull/2709)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to override the `<Popper>` props in `<AutocompleteInput>` ([2678](https://github.com/marmelab/react-admin/pull/2678)) ([djhi](https://github.com/djhi))
* Add the ability to disable the `/login` route and component ([2622](https://github.com/marmelab/react-admin/pull/2622)) ([djhi](https://github.com/djhi))
* Add `enableReducers` and `renderProp` options to `<TestContext>` to help with integration testing ([2614](https://github.com/marmelab/react-admin/pull/2614)) ([peter-mouland](https://github.com/peter-mouland))
* Disable the `<ExportButton>` when there is nothing to export ([2595](https://github.com/marmelab/react-admin/pull/2595)) ([Luwangel](https://github.com/Luwangel))
* Update dependencies of secondary packages to `ra-core` ([2606](https://github.com/marmelab/react-admin/pull/2606)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ShowButton>` in `<Datagrid>` when using `rowClick` ([2716](https://github.com/marmelab/react-admin/pull/2716)) ([plattdl](https://github.com/plattdl))
* Fix list e2e test ([2713](https://github.com/marmelab/react-admin/pull/2713)) ([JacquesBonet](https://github.com/JacquesBonet))
* Fix warnings about `peerDependencies` on install ([2626](https://github.com/marmelab/react-admin/pull/2626)) ([fzaninotto](https://github.com/fzaninotto))
* Fix warning when disabling a button on small devices ([2731](https://github.com/marmelab/react-admin/pull/2731)) ([Luwangel](https://github.com/Luwangel))

## v2.5.3

* Fix Chinese Locale name ([#2710](https://github.com/marmelab/react-admin/pull/2710)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `ra-data-simple-rest` dependency ([#2708](https://github.com/marmelab/react-admin/pull/2708)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated `<SimpleShowLayout>` doc about custom styles ([#2707](https://github.com/marmelab/react-admin/pull/2707)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<EditButton>` in `<Datagrid>` when using `rowClick` ([#2686](https://github.com/marmelab/react-admin/pull/2686)) ([plattdl](https://github.com/plattdl))
* Fix custom fetch actions can't benefit from optimistic rendering ([#2684](https://github.com/marmelab/react-admin/pull/2684)) ([djhi](https://github.com/djhi))
* Fix outdated Codesandbox link ([#2682](https://github.com/marmelab/react-admin/pull/2682)) ([Kmaschta](https://github.com/Kmaschta))
* Fix missing `<Resource>` documentation without list prop / Menu ([#2679](https://github.com/marmelab/react-admin/pull/2679)) ([Kmaschta](https://github.com/Kmaschta))
* Fix outdated documentation on `ra-lanhuage-english` and `ra-language-french` ([#2674](https://github.com/marmelab/react-admin/pull/2674)) ([sovattha](https://github.com/sovattha))
* Fix accessibility on `<FileInput>` delete button ([#2666](https://github.com/marmelab/react-admin/pull/2666)) ([djhi](https://github.com/djhi))
* Fix custom material-ui input documentation ([#2664](https://github.com/marmelab/react-admin/pull/2664)) ([fzaninotto](https://github.com/fzaninotto))
* Fix extra `<FormTab>`/`<Tab>` props are passed to two different components ([#2654](https://github.com/marmelab/react-admin/pull/2654)) ([waynebloss](https://github.com/waynebloss))
* Fix arrow in sorted column header when field uses `sortBy` props ([#2600](https://github.com/marmelab/react-admin/pull/2600)) ([louisbl](https://github.com/louisbl))

## v2.5.2

* Fix demo application for IE 11 ([#2661](https://github.com/marmelab/react-admin/pull/2661)) ([phacks](https://github.com/phacks))
* Fix validation errors are not displayed in `<FileInput>` ([#2660](https://github.com/marmelab/react-admin/pull/2660)) ([djhi](https://github.com/djhi))
* Fix `<ArrayInput>` error format ([#2655](https://github.com/marmelab/react-admin/pull/2655)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FormDataConsumer>` not working with custom form name ([#2656](https://github.com/marmelab/react-admin/pull/2656)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing documentation for `ra-data-fakerest` logging abilities ([#2652](https://github.com/marmelab/react-admin/pull/2652)) ([fzaninotto](https://github.com/fzaninotto))
* Fix syntax error with `shouldRenderSuggestions` ([#2648](https://github.com/marmelab/react-admin/pull/2648)) ([nacimgoura](https://github.com/nacimgoura))
* Fix deprecated Redux Dev Tools extension warning ([#2646](https://github.com/marmelab/react-admin/pull/2646)) ([phacks](https://github.com/phacks))
* Fix `<DataGrid>` export ([#2644](https://github.com/marmelab/react-admin/pull/2644)) ([hamidfzm](https://github.com/hamidfzm))
* Fix broken link to default layout in Theming documentation ([#2627](https://github.com/marmelab/react-admin/pull/2627)) ([fzaninotto](https://github.com/fzaninotto))
* Fix mobile toolbar overlays on last input ([#2620](https://github.com/marmelab/react-admin/pull/2620)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteArrayInput>` crash when selecting value ([#2616](https://github.com/marmelab/react-admin/pull/2616)) ([fzaninotto](https://github.com/fzaninotto))
* Add Loopback data provider to docs ([#2633](https://github.com/marmelab/react-admin/pull/2633)) ([darthwesker](https://github.com/darthwesker))

## v2.5.1

* Fix warning in `SelectInput` test ([2608](https://github.com/marmelab/react-admin/pull/2608)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Autocomplete suggestions positioning is sometimes not recalculated properly ([2607](https://github.com/marmelab/react-admin/pull/2607)) ([djhi](https://github.com/djhi))
* Fix login background style ([2594](https://github.com/marmelab/react-admin/pull/2594), [2596](https://github.com/marmelab/react-admin/pull/2596)) ([Kmaschta](https://github.com/Kmaschta))

## v2.5.0

* Add support for custom theme in Login page ([#2591](https://github.com/marmelab/react-admin/pull/2591)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to paginate `<ReferenceManyField>` ([#2580](https://github.com/marmelab/react-admin/pull/2580)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for custom `icon` on all buttons ([#2556](https://github.com/marmelab/react-admin/pull/2556)) ([afilp](https://github.com/afilp))
* Add ability to override Datagrid Body and Row elements ([#2575](https://github.com/marmelab/react-admin/pull/2575)) ([fzaninotto](https://github.com/fzaninotto))
* Add background to `<Edit>` toolbar ([#2568](https://github.com/marmelab/react-admin/pull/2568)) ([fzaninotto](https://github.com/fzaninotto))
* Add autofocus to login and creation forms in examples ([#2560](https://github.com/marmelab/react-admin/pull/2560)) ([fzaninotto](https://github.com/fzaninotto))
* Add autofocus to 1st input of login form ([#2530](https://github.com/marmelab/react-admin/pull/2530)) ([afilp](https://github.com/afilp))
* Add ability to disable some options in `<SelectInput>` ([#2555](https://github.com/marmelab/react-admin/pull/2555)) ([mikaoelitiana](https://github.com/mikaoelitiana))
* Update routing state key from `routing` to `router` ([#2553](https://github.com/marmelab/react-admin/pull/2553)) ([AleBlondin](https://github.com/AleBlondin))
* Add ability to pass custom props to react-autosuggest from `<AutocompleteInput>>` ([#2410](https://github.com/marmelab/react-admin/pull/2410)) ([AskseL](https://github.com/AskseL))
* Add ability to hide some suggestions in `<AutocompleteInput>` ([#2502](https://github.com/marmelab/react-admin/pull/2502)) ([ginman86](https://github.com/ginman86))
* Add ability to override `<SnackBar>` style in `<Notification>` component ([#2405](https://github.com/marmelab/react-admin/pull/2405)) ([rameshsyn](https://github.com/rameshsyn))
* Add support for arrays of references in exporter `fetchRelatedRecords` ([#2461](https://github.com/marmelab/react-admin/pull/2461)) ([fzaninotto](https://github.com/fzaninotto))
* Remove outdated graphcool demo link ([#2592](https://github.com/marmelab/react-admin/pull/2592)) ([fzaninotto](https://github.com/fzaninotto))
* Improve time to interactive in default Login page ([#2589](https://github.com/marmelab/react-admin/pull/2589)) ([Kmaschta](https://github.com/Kmaschta))
* Fix `UPDATE_MANY` mapping for `ra-data-json-server` data provider ([#2382](https://github.com/marmelab/react-admin/pull/2382)) ([Mclovinn](https://github.com/Mclovinn))
* Fix `MenuItemLink` click handler not passing the event ([#2588](https://github.com/marmelab/react-admin/pull/2588)) ([afilp](https://github.com/afilp))

## v2.4.4

* Fix `to` prop propType `<MenuItemLink>` ([#2584](https://github.com/marmelab/react-admin/pull/2584)) ([afilp](https://github.com/afilp))
* Fix `<ReferenceArrayInput>` ignores default filter on search ([#2583](https://github.com/marmelab/react-admin/pull/2583)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Error when using `<CheckboxGroupInput>` with wrong source attribute ([#2582](https://github.com/marmelab/react-admin/pull/2582)) ([afilp](https://github.com/afilp))
* Fix breaking change in `material-ui-chip-input` breaks compilation ([#2579](https://github.com/marmelab/react-admin/pull/2579)) ([fzaninotto](https://github.com/fzaninotto))
* Fix node polyglot dependency tag ([#2577](https://github.com/marmelab/react-admin/pull/2577)) ([hamidfzm](https://github.com/hamidfzm))
* Fix package install instructions from dev to production ([#2574](https://github.com/marmelab/react-admin/pull/2574)) ([ajhool](https://github.com/ajhool))
* Fix JSX syntax error in code suggested `<EditGuesser>` ([#2569](https://github.com/marmelab/react-admin/pull/2569)) ([fzaninotto](https://github.com/fzaninotto))
* Fix translation provider first loads with identity translate ([#2563](https://github.com/marmelab/react-admin/pull/2563)) ([fzaninotto](https://github.com/fzaninotto))
* Fix custom app snippet leads to warnings for missing props ([#2558](https://github.com/marmelab/react-admin/pull/2558)) ([fzaninotto](https://github.com/fzaninotto))

## v2.4.3

* Add types to side effects ([#2535](https://github.com/marmelab/react-admin/pull/2535)) ([fzaninotto](https://github.com/fzaninotto))
* Add documentation for unit testing custom views ([#2554](https://github.com/marmelab/react-admin/pull/2554)) ([kierenhughes](https://github.com/kierenhughes))
* Fix `TablePaginationAction` using private material-ui API ([#2551](https://github.com/marmelab/react-admin/pull/2551)) ([phacks](https://github.com/phacks))
* Fix typo in tutorial ([#2529](https://github.com/marmelab/react-admin/pull/2529)) ([Shaglock](https://github.com/Shaglock))
* Fix click on `DeleteButton` in `List` redirects to `Edit` ([#2526](https://github.com/marmelab/react-admin/pull/2526)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Datagrid header cell padding ([#2522](https://github.com/marmelab/react-admin/pull/2522)) ([aliang](https://github.com/aliang))
* Fix example code for adding upload feature in `DataProviders` documentation ([#2503](https://github.com/marmelab/react-admin/pull/2503)) ([misino](https://github.com/misino))

## v2.4.2

* Fix example code in List documentation ([#2518](https://github.com/marmelab/react-admin/pull/2518)) ([pastparty](https://github.com/pastparty))
* Fix `<Aside>` documentation for undefined record ([#2513](https://github.com/marmelab/react-admin/pull/2513)) ([fzaninotto](https://github.com/fzaninotto))
* Fix incorrect quotes in custom `<RichTextInput>` styles ([#2505](https://github.com/marmelab/react-admin/pull/2505)) ([moklick](https://github.com/moklick)
* Fix non-Admin snippet in custom app documentation ([#2493](https://github.com/marmelab/react-admin/pull/2493)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceManyField>` does not pass total to children ([#2487](https://github.com/marmelab/react-admin/pull/2487)) ([fzaninotto](https://github.com/fzaninotto))
* Fix production build problem with graphql-ast-types package ([#2486](https://github.com/marmelab/react-admin/pull/2486)) ([Kmaschta](https://github.com/Kmaschta))
* Migrate non-data actions of `ra-core` package to Typescript ([#2521](https://github.com/marmelab/react-admin/pull/2521)) ([xavierhans](https://github.com/xavierhans))
* Migrate i18n and auth directories of `ra-core` package to TypeScript ([#2508](https://github.com/marmelab/react-admin/pull/2508)) ([djhi](https://github.com/djhi))
* Add Catalan translation ([#2488](https://github.com/marmelab/react-admin/pull/2488)) ([sergioedo](https://github.com/sergioedo))

## v2.4.1

* Fix link for graphcool data provider in docs ([#2476](https://github.com/marmelab/react-admin/pull/2476)) ([bamorim](https://github.com/bamorim)
* Fix instructions to develop react-admin using npm link ([#2473](https://github.com/marmelab/react-admin/pull/2473)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing styles in rendered documentation ([#2474](https://github.com/marmelab/react-admin/pull/2474)) ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated screenshots in Tutorial ([#2470](https://github.com/marmelab/react-admin/pull/2470)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Edit>` toolbar hides the last form item on mobile ([#2466](https://github.com/marmelab/react-admin/pull/2466)) ([vedmalex](https://github.com/vedmalex))
* Fix create URL in `ra-data-simple-rest` documentation ([#2468](https://github.com/marmelab/react-admin/pull/2468)) ([maruware](https://github.com/maruware))
* Fix `<ReferenceField>` in Datagrids using `rowClick` ([#2457](https://github.com/marmelab/react-admin/pull/2457)) ([fzaninotto](https://github.com/fzaninotto))
* Fix hardcoded query and mutation types in GraphQL introspection ([#2454](https://github.com/marmelab/react-admin/pull/2454)) ([yishus](https://github.com/yishus))
* Fix bug in exporter `fetchRelatedRecords` ([#2450](https://github.com/marmelab/react-admin/pull/2450)) ([fzaninotto](https://github.com/fzaninotto))
* Add link to news in `README` and documentation ([#2445](https://github.com/marmelab/react-admin/pull/2445)) ([fzaninotto](https://github.com/fzaninotto))
* Fix wrong PropType warning in `<ShowView>` ([#2444](https://github.com/marmelab/react-admin/pull/2444)) ([fzaninotto](https://github.com/fzaninotto))
* Add an explicit error if the developer used the wrong prop name for filters ([#2451](https://github.com/marmelab/react-admin/pull/2451)) ([fzaninotto](https://github.com/fzaninotto))
* Add jsonapi data provider to documentation ([#2455](https://github.com/marmelab/react-admin/pull/2455)) ([henvo](https://github.com/henvo)
* Add Norwegian translation to docs and removed old translation (aor) ([#2481](https://github.com/marmelab/react-admin/pull/2481)) ([jon](https://github.com/jon-harald))

## v2.4.0

For highlights about this version, read the [react-admin 2.4 announcement blog post](https://marmelab.com/blog/2018/10/18/react-admin-2-4.html) on the marmelab blog.

* Bootstrap TypeScript migration ([#2426](https://github.com/marmelab/react-admin/pull/2426)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<ListGuesser>`, `<EditGuesser>`, and `<ShowGuesser>` to facilitate CRUD bootstrap and prototyping ([#2376](https://github.com/marmelab/react-admin/pull/2376)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to use custom icon in `<UserMenu>` ([#2391](https://github.com/marmelab/react-admin/pull/2391)) ([Luwangel](https://github.com/Luwangel))
* Add `id` attribute on input if not specified and other accessibility fixes ([#2351](https://github.com/marmelab/react-admin/pull/2351)) ([djhi](https://github.com/djhi))
* Add `aside` support in `List`, `Edit`, and `Show` views ([#2304](https://github.com/marmelab/react-admin/pull/2304)) ([fzaninotto](https://github.com/fzaninotto))
* Add warning when the `translate` higher-order component is used directly to translate a string ([#2318](https://github.com/marmelab/react-admin/pull/2318)) ([djhi](https://github.com/djhi))
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

* Fix double asterix on required RadioButtonGroupInput ([2417](https://github.com/marmelab/react-admin/pull/2417)) ([fzaninotto](https://github.com/fzaninotto))
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
* Fix trailing whitespaces in documentation ([#2359](https://github.com/marmelab/react-admin/pull/2359)) ([josx](https://github.com/josx))
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
* [GraphQL] Add 'How does it work' section to the `ra-data-graphql` `README` ([Weakky](https://github.com/Weakky))
* [GraphQL] Add a link to a Prisma `dataProvider` ([Weakky](https://github.com/Weakky))
* [GraphQL] Allow easier per-query override ([djhi](https://github.com/djhi))
* [npm] Expose `esm` modules to enable tree shaking (and smaller bundle size) ([Kmaschta](https://github.com/Kmaschta))
* [npm] Remove babel `stage-0` preset and use `preset-env` instead ([Kmaschta](https://github.com/Kmaschta))
* [redux] Allow to use `<Admin>` inside an external `<Provider>` ([fzaninotto](https://github.com/fzaninotto))

Deprecations:

* `<Admin>` `menu` prop. To override the menu component, use a [custom layout](./docs/Admin.md#layout) instead.
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
* Fix `handleSubmit` should not be overridden in `<Toolbar>` children ([djhi](https://github.com/djhi))
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
* Fix documentation links not working when browsing the docs via GitHub ([fzaninotto](https://github.com/fzaninotto))
* Fix link in `CreateEdit` documentation ([JulienMattiussi](https://github.com/JulienMattiussi))
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
* Fix e2e tests failing on Chrome 68 ([djhi](https://github.com/djhi))
* Add Vietnamese translation ([hieunguyendut](https://github.com/hieunguyendut))
* Fix `<ReferenceInput>` when used inside `<ArrayInput>` ([djhi](https://github.com/djhi))
* Fix broken link in Actions documentation ([djhi](https://github.com/djhi))

## v2.1.4

* Fix link color in `<ReferenceField>` ([fzaninotto](https://github.com/fzaninotto))
* Fix form does not display data when coming from another form ([fzaninotto](https://github.com/fzaninotto))
* Revert Fix form resetting when an input with defaultValue is dynamically added ([fzaninotto](https://github.com/fzaninotto))
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
* Fix form resetting when an input with `defaultValue` is dynamically added ([djhi](https://github.com/djhi))
* Fix validators memoization ([Bnaya](https://github.com/Bnaya))
* Add Chinese translation ([chen4w](https://github.com/chen4w))
* Add API Platform Admin and the JSON-LD Data Provider to the `Ecosystem` doc ([dunglas](https://github.com/dunglas))

## v2.1.1

* Fix FormInput not passing `resource` to `Labeled` inputs ([djhi](https://github.com/djhi))
* Add documentation on how to prefill a `<Create>` form based on another record ([fzaninotto](https://github.com/fzaninotto))
* Add polish translations ([tskorupka](https://github.com/tskorupka))
* Add documentation on tabs routing ([djhi](https://github.com/djhi))

## v2.1.0

For highlights about this version, read [the 2.1 release announcement post](https://marmelab.com/blog/2018/07/02/react-admin-2-1.html) on the marmelab blog.

* [`TabbedForm`, `TabbedShowLayout`] Add routing support for tab navigation ([djhi](https://github.com/djhi))
* [`SimpleForm`, `TabbedForm`] Add ability to customize the redux form ([djhi](https://github.com/djhi))
* [`ReferenceField`] Add optional `sortBy` prop to allow sorting by another field than `id` ([ArneZsng](https://github.com/ArneZsng))
* [`SaveButton`, `SimpleForm`, `TabbedForm`] Add support for function as `redirect` value ([fzaninotto](https://github.com/fzaninotto))
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
* Fix multiple broken links in DataProviders doc ([alireza](https://github.com/alireza)-ahmadi))
* Fix missing resource in ArrayInput iterator ([fzaninotto](https://github.com/fzaninotto))
* Fix outdated mention of `aor-embedded-array` in Ecosystem doc ([vascofg](https://github.com/vascofg))

## v2.0.3

* Add Russian translation package to the docs ([fzaninotto](https://github.com/fzaninotto))
* Add Indonesian translation package to the docs ([ronadi](https://github.com/ronadi))
* Add media to demo dashboard to make it better-looking ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Labeled>` to correctly pass `<FormControl>` props for full width and validation ([djhi](https://github.com/djhi))
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
* Fix `yarn.lock` to match `packages.json` ([fzaninotto](https://github.com/fzaninotto))
* Fix select all checkbox selects rows twice ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in Inputs documentation ([afilp](https://github.com/afilp))
* Fix custom `<Datagrid>` style function example ([afilp](https://github.com/afilp))

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

* Documentation: change extraction of status for `AUTH_ERROR` ([zifnab87](https://github.com/zifnab87))
* Add Slovak translation ([zavadpe](https://github.com/zavadpe))
* Documentation: Use standard es6 in docs and example ([djhi](https://github.com/djhi))
* Fix: Ensure validation custom messages without translation don't add warnings ([djhi](https://github.com/djhi))
* Fix: Ensure children are filtered when mapping on them ([djhi](https://github.com/djhi))
* Fix: Redirect to correct page after Delete ([alexisjanvier](https://github.com/alexisjanvier))
* Fix warnings in React 16 ([djhi](https://github.com/djhi))
* Documentation: Update CreateEdit.md for 'number' validation ([afilp](https://github.com/afilp))
* Fix Edit view refresh does not cancel changes ([djhi](https://github.com/djhi))
* Fix form default values can't be changed once mounted ([djhi](https://github.com/djhi))
* Documentation: Add a FAQ entry about unique child key in `<Datagrid>` ([djhi](https://github.com/djhi))
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
* Fix mention of `<ReferenceManyInput>` ([djhi](https://github.com/djhi))
* Fix multiple `<ReferenceManyField>` on same resource with different filter ([ThieryMichel](https://github.com/ThieryMichel))
* Fix trailing slash in `<EditButton>` link ([ThieryMichel](https://github.com/ThieryMichel))
* Fix Optimistic rendering of List may create errors due to outdated data ([ThieryMichel](https://github.com/ThieryMichel))
* Fix documentation about `onTouchTap`, replaced by `onClick` ([djhi](https://github.com/djhi))
* Fix List button displayed in show view even when no List component defined ([ThieryMichel](https://github.com/ThieryMichel))
* Fix `<AutocompleteInput>` cannot be changed once a value is selected ([ThieryMichel](https://github.com/ThieryMichel))
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

## v1.3.0

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
* Add instructions to run the example app in `README` ([juanda99](https://github.com/juanda99))
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
* Explain branches in `README`
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
* Add ability to disable sorting on `<Datagrid>` headers
* Add `perPage`, `sort`, and `filter` props to `<ReferenceManyField>`
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

* [BC Break] The `filter` prop of the `<List>` component now expects an element rather than a component (`<List filter={<MyFilter/>} >` rather than `<List filter={MyFilter} >`)
* [BC Break] The `title` prop of all view components now expect an element rather than a component (`<List title={<MyTitle/>} >` rather than `<List title={MyTitle} >`)
* [BC Break] Rename `style` to `elStyle` and let style override container element
* Add special design for non-sortable columns in `<Datagrid>`
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
* Align `<Datagrid>` first column to the page title
* Hide resources in the Menu when they don't have a list view
* Fix warning for fields with no source and no label
* Fix `<FilterButton>` for fields without label

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
* Fix `<Datagrid>` margins to accomodate more content
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
* Fix `<Datagrid>` layout to make columns adapt width to content
* Fix doc on reducers in CustomApp (by [ArnaudD](https://github.com/ArnaudD))
* Fix custom app docs now that redux form is required
* Fix `<RadioButtonGroupInput>`
* Fix Pagination when list has no filter
* Fix clearing text filter doesn't fetch the unfiltered list
* Fix Warning when `<Datagrid>` contains two action buttons

## v0.4.0

* [BC Break] Pass Headers object to `restClient`
* Add loads of documentation
* Use `source` as implicit `label` in fields and input components
* Add `<RichTextField>` and `<RichTextInput>` components (powered by [quill](https://quilljs.com/))
* Add `<UrlField>` component
* Add Form Validation in `<Edit>` and `<Create>` views (powered by [redux-form](https://redux-form.com/))
* Add material-ui theme support in the `<Admin>` component (by [fnberta](https://github.com/fnberta))
* Add option to show date with time (by [fnberta](https://github.com/fnberta))
* Add UUID support (by [bjet007](https://github.com/bjet007))
* Add deep field selection
* Add unit tests
* Fix form display issue when single or no fields
* Fix and speedup filters
* Fix create form
* Fix filter value reset when filter is removed

## v0.3.0

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
