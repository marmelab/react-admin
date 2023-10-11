# Changelog

## v4.14.5

* Fix `<FilterForm>` freezes the app when a deeply nested filters are reset ([#9337](https://github.com/marmelab/react-admin/pull/9337)) ([djhi](https://github.com/djhi))
* Fix `useUnique` send request even if the field value is empty ([#9334](https://github.com/marmelab/react-admin/pull/9334)) ([adguernier](https://github.com/adguernier))
* Fix `<RichTextInput>` does not update when its `editorOptions` prop changes ([#9289](https://github.com/marmelab/react-admin/pull/9289)) ([djhi](https://github.com/djhi))
* [Docs] Update Remix Instructions ([#9329](https://github.com/marmelab/react-admin/pull/9329)) ([djhi](https://github.com/djhi))
* [Docs] Update third-party component section; new date/time inputs ([#9326](https://github.com/marmelab/react-admin/pull/9326)) ([ZachSelindh](https://github.com/ZachSelindh))

## v4.14.4

* Fix inputs with `disabled={false}` throw an error (workaround) ([#9313](https://github.com/marmelab/react-admin/pull/9313)) ([slax57](https://github.com/slax57))
* Fix `useCreate` does not refresh the list cache ([#9312](https://github.com/marmelab/react-admin/pull/9312)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add i18n `InputHelperText` section to Inputs/useInputs docs ([#9315](https://github.com/marmelab/react-admin/pull/9315)) ([ZachSelindh](https://github.com/ZachSelindh))
* [Doc] Add beginner mode to hide advanced doc chapters ([#9306](https://github.com/marmelab/react-admin/pull/9306)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix anchors ([#9305](https://github.com/marmelab/react-admin/pull/9305)) ([WiXSL](https://github.com/WiXSL))

## v4.14.3

* Fix `<PrevNextButton>` default style ([#9290](https://github.com/marmelab/react-admin/pull/9290)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add `<SolarLayout>` component ([#9282](https://github.com/marmelab/react-admin/pull/9282)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add link to ra-auth-google, authProvider for Google Identity ([#9284](https://github.com/marmelab/react-admin/pull/9284)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Improve tutorial screencast ([#9298](https://github.com/marmelab/react-admin/pull/9298)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Explain how to disable menu item with RBAC ([#9293](https://github.com/marmelab/react-admin/pull/9293)) ([adguernier](https://github.com/adguernier))
* [Doc] Add Real Time Notifications section in Realtime introduction ([#9304](https://github.com/marmelab/react-admin/pull/9304)) ([djhi](https://github.com/djhi))
* [Doc] Update `<CreateDialog>` documentation about `edit` conflict ([#9295](https://github.com/marmelab/react-admin/pull/9295)) ([djhi](https://github.com/djhi))
* [Doc] Update `<ReferenceManyToManyInput>` documentation about children default value ([#9294](https://github.com/marmelab/react-admin/pull/9294)) ([djhi](https://github.com/djhi))
* [Doc] Fix typo in useRegisterMutationMiddleware introduction part ([#9291](https://github.com/marmelab/react-admin/pull/9291)) ([youjin-10](https://github.com/youjin-10))
* [Doc] Fix typo in Features example ([#9286](https://github.com/marmelab/react-admin/pull/9286)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix ReviewList shows horizontal scrollbar on mobile ([#9297](https://github.com/marmelab/react-admin/pull/9297)) ([fzaninotto](https://github.com/fzaninotto))

## v4.14.2

Failed release, do not use.

## v4.14.1

* Fix filters not matching inputs are ignored without `syncWithLocation` ([#9283](https://github.com/marmelab/react-admin/pull/9283)) ([djhi](https://github.com/djhi))
* Fix `create-react-admin` does not include `gitignore` ([#9280](https://github.com/marmelab/react-admin/pull/9280)) ([djhi](https://github.com/djhi))
* Fix `<RichTextInput>` does not trigger `onBlur` ([#9272](https://github.com/marmelab/react-admin/pull/9272)) ([slax57](https://github.com/slax57))
* Fix `<TopToolbar>`: React does not recognize the hasCreate prop on a DOM element ([#9267](https://github.com/marmelab/react-admin/pull/9267)) ([slax57](https://github.com/slax57))
* Fix `usePermissions` should only log errors in development mode ([#9262](https://github.com/marmelab/react-admin/pull/9262)) ([NidhiSharma63](https://github.com/NidhiSharma63))
* [Doc] Improve Example REST Implementation when calling create with partial data ([#9276](https://github.com/marmelab/react-admin/pull/9276)) ([slax57](https://github.com/slax57))
* [Doc] Improve `<Breadcrumb>` documentation ([#9271](https://github.com/marmelab/react-admin/pull/9271)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Improve `<ReferenceManyToManyInput>` documentation ([#9270](https://github.com/marmelab/react-admin/pull/9270)) ([adguernier](https://github.com/adguernier))
* [Doc] Improve and reorder `<ReferenceManyToManyField>` documentation ([#9269](https://github.com/marmelab/react-admin/pull/9269)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix external link in `<FileInput>` and `<ImageInput>` ([#9268](https://github.com/marmelab/react-admin/pull/9268)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<SaveButton>` example ([#9266](https://github.com/marmelab/react-admin/pull/9266)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Explain how to lazy load `<RichTextInput>` ([#9263](https://github.com/marmelab/react-admin/pull/9263)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos on Admin, Architecture, EditTutorial, Features, Fields, Inputs, and Tutorial pages ([#9259](https://github.com/marmelab/react-admin/pull/9259)) ([mchaffotte](https://github.com/mchaffotte))
* [Demo] Fix preferences are shared between demos ([#9264](https://github.com/marmelab/react-admin/pull/9264)) ([mchaffotte](https://github.com/mchaffotte))

## v4.14.0

* Add support for lazy-loaded React components ([#9260](https://github.com/marmelab/react-admin/pull/9260)) ([fzaninotto](https://github.com/fzaninotto))
* Include full record in `<AutocompleteInput>` and `<AutocompleteArrayInput>`'s `onChange` ([#9245](https://github.com/marmelab/react-admin/pull/9245)) ([slax57](https://github.com/slax57))
* Fix top margin of `<TopToolbar>` to move content up when there is no filter ([#9232](https://github.com/marmelab/react-admin/pull/9232)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<SortButton sx>` prop to customize button style ([#9223](https://github.com/marmelab/react-admin/pull/9223)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<ResourceMenuItems>` to facilitate custom menus ([#9212](https://github.com/marmelab/react-admin/pull/9212)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<PrevNextButtons>` for `<Show>` and `<Edit>` views ([#9165](https://github.com/marmelab/react-admin/pull/9165)) ([adguernier](https://github.com/adguernier))
* Fix Filter Form to show remove button after the input ([#9224](https://github.com/marmelab/react-admin/pull/9224)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<PrevNextButtons>` to fetch less aggressively ([#9209](https://github.com/marmelab/react-admin/pull/9209)) ([fzaninotto](https://github.com/fzaninotto))
* Change the definition of sort order to `ASC|DESC` ([#8466](https://github.com/marmelab/react-admin/pull/8466)) ([zhujinxuan](https://github.com/zhujinxuan))

## v4.13.4

* Fix `<AutocompleteInput>`'s `onInputChange` is never called ([#9240](https://github.com/marmelab/react-admin/pull/9240)) ([tdnl](https://github.com/tdnl))
* Fix typo in deprecated `<Datagrid>` `rowStyle` message ([#9252](https://github.com/marmelab/react-admin/pull/9252)) ([onefifth](https://github.com/onefifth))
* [Demo] Add lazy loading to CRM demo to illustrate code splitting ([#9255](https://github.com/marmelab/react-admin/pull/9255)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo double text ([#9253](https://github.com/marmelab/react-admin/pull/9253)) ([oxwazz](https://github.com/oxwazz))
* [Doc] Fix typo in `<RichTextInput>` documentation ([#9244](https://github.com/marmelab/react-admin/pull/9244)) ([mhfortuna](https://github.com/mhfortuna))
* [Doc] Fix typos and invalid code fences languages ([#9238](https://github.com/marmelab/react-admin/pull/9238)) ([djhi](https://github.com/djhi))

## v4.13.3

* Fix `<NumberInput>` and `<BooleanInput>` programmatic focus ([#9221](https://github.com/marmelab/react-admin/pull/9221)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useReferenceManyFieldController` fails with error when the record is not yet present ([#9236](https://github.com/marmelab/react-admin/pull/9236)) ([djhi](https://github.com/djhi))
* Fix bulk actions toolbar styling issue on mobile ([#9222](https://github.com/marmelab/react-admin/pull/9222)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Add inline documentation for most common components ([#9234](https://github.com/marmelab/react-admin/pull/9234)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Update sx sections to point to the new SX documentation ([#9233](https://github.com/marmelab/react-admin/pull/9233)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix docs anchors and typos ([#9235](https://github.com/marmelab/react-admin/pull/9235)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix explanations context in `<ReferenceManyToManyInput>` documentation ([#9228](https://github.com/marmelab/react-admin/pull/9228)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `<List actions>` example throws an error ([#9220](https://github.com/marmelab/react-admin/pull/9220)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix startup command in project Readme file ([#9231](https://github.com/marmelab/react-admin/pull/9231)) ([azizChebbi](https://github.com/azizChebbi))

## v4.13.2

* Fix Guessers should not log in CI by default ([#9218](https://github.com/marmelab/react-admin/pull/9218)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `package.json` should mention peer dependency on `react-is` ([#9201](https://github.com/marmelab/react-admin/pull/9201)) ([kamiyo](https://github.com/kamiyo))
* Fix validation errors from resolvers are not translated ([#9191](https://github.com/marmelab/react-admin/pull/9191)) ([djhi](https://github.com/djhi))
* [Doc] WizardForm: document ability to pass `progress={false}` ([#9216](https://github.com/marmelab/react-admin/pull/9216)) ([slax57](https://github.com/slax57))
* [Doc] Fix typo in useInfiniteGetList doc ([#9210](https://github.com/marmelab/react-admin/pull/9210)) ([codyavila](https://github.com/codyavila))
* [Doc] Convert `<Datagrid>` documentation to TS ([#9207](https://github.com/marmelab/react-admin/pull/9207)) ([djhi](https://github.com/djhi))
* [Doc] Convert `<Admin>` documentation to TS ([#9206](https://github.com/marmelab/react-admin/pull/9206)) ([djhi](https://github.com/djhi))
* [Doc] display a comment inviting to switch to TS if transpiled code is empty ([#9205](https://github.com/marmelab/react-admin/pull/9205)) ([adguernier](https://github.com/adguernier))
* [Doc] Add screenshot and screencast for `<ReferenceManyToManyInput>` and `<ReferenceManyToManyField>` ([#9204](https://github.com/marmelab/react-admin/pull/9204)) ([adguernier](https://github.com/adguernier))
* [Doc] Update the Data Fetching documentation ([#9200](https://github.com/marmelab/react-admin/pull/9200)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `withLifecycleCallbacks` `beforeSave` return type ([#9199](https://github.com/marmelab/react-admin/pull/9199)) ([djhi](https://github.com/djhi))

## v4.13.1

* Fix `<ArrayInput>` does not apply default values set on inputs ([#9198](https://github.com/marmelab/react-admin/pull/9198)) ([djhi](https://github.com/djhi))
* Fix `<ReferenceInput queryOptions>` does not apply to `getMany` query ([#9197](https://github.com/marmelab/react-admin/pull/9197)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<UpdateButton>` with custom notification doesn't close the confirmation dialog ([#9196](https://github.com/marmelab/react-admin/pull/9196)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FilterLiveSearch>` uses label as placeholder by default ([#9185](https://github.com/marmelab/react-admin/pull/9185)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix missing types for `TranslationMessages` ([#9187](https://github.com/marmelab/react-admin/pull/9187)) ([bicstone](https://github.com/bicstone))
* [Doc] Refactor Theming documentation ([#9193](https://github.com/marmelab/react-admin/pull/9193)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<NumberInput>` usage in Filter Forms ([#9186](https://github.com/marmelab/react-admin/pull/9186)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Convert Inputs Tutorial Examples to TS ([#9183](https://github.com/marmelab/react-admin/pull/9183)) ([djhi](https://github.com/djhi))
* [Doc] Convert List Tutorial Examples to TS ([#9181](https://github.com/marmelab/react-admin/pull/9181)) ([djhi](https://github.com/djhi))

## v4.13.0

* Add `<FilterListItem icon>` prop to show an icon for each filter list item ([#9150](https://github.com/marmelab/react-admin/pull/9150)) ([Guy-Adler](https://github.com/Guy-Adler))
* Add `transform` prop to `<DateField>` and `<NumberField>` ([#9147](https://github.com/marmelab/react-admin/pull/9147)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<RecordRepresentation>` to streamline rendering a record as string ([#9095](https://github.com/marmelab/react-admin/pull/9095)) ([djhi](https://github.com/djhi))
* Add `<UpdateButton>` to let users update the current record ([#9088](https://github.com/marmelab/react-admin/pull/9088)) ([djhi](https://github.com/djhi))
* Add `<CheckForApplicationUpdate>` to suggest a reload when the application code has changed ([#9059](https://github.com/marmelab/react-admin/pull/9059)) ([djhi](https://github.com/djhi))
* Add `<Datagrid rowSx>` prop to customize row style for each record ([#8925](https://github.com/marmelab/react-admin/pull/8925)) ([zhujinxuan](https://github.com/zhujinxuan))
* Update `<SimpleList>` to fallback to `recordRepresentation` when not given `primaryText` ([#9172](https://github.com/marmelab/react-admin/pull/9172)) ([fzaninotto](https://github.com/fzaninotto))
* Update `<TitlePortal>` to allow customization of the page title style ([#9171](https://github.com/marmelab/react-admin/pull/9171)) ([fzaninotto](https://github.com/fzaninotto))
* Update `<List>` mobile layout to display actions first ([#9170](https://github.com/marmelab/react-admin/pull/9170)) ([fzaninotto](https://github.com/fzaninotto))
* Update `<Input>` components width on mobile to make them full width by default ([#9169](https://github.com/marmelab/react-admin/pull/9169)) ([fzaninotto](https://github.com/fzaninotto))
* Update `<TranslatableInputs>` to allow vertical layout ([#9126](https://github.com/marmelab/react-admin/pull/9126)) ([slax57](https://github.com/slax57))
* Update `<Confirm>` to accept a React node as `confirmTitle` or `confirmContent` ([#9115](https://github.com/marmelab/react-admin/pull/9115)) ([yurassic](https://github.com/yurassic))
* Fix `<SelectInput>` throws error when fetching choices manually ([#9179](https://github.com/marmelab/react-admin/pull/9179)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SelectInput>` translates choices even inside a `<ReferenceInput>` ([#9176](https://github.com/marmelab/react-admin/pull/9176)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SingleFieldList>` children don't use default link color ([#9174](https://github.com/marmelab/react-admin/pull/9174)) ([fzaninotto](https://github.com/fzaninotto))
* Fix ra-data-provider-fakerest getMany doesn't preserve the ids order ([#9168](https://github.com/marmelab/react-admin/pull/9168)) ([fzaninotto](https://github.com/fzaninotto))
* Fix Fields Record Type Parameter ([#9092](https://github.com/marmelab/react-admin/pull/9092)) ([djhi](https://github.com/djhi))
* [Doc] Fix tutorial misses step to link references together ([#9167](https://github.com/marmelab/react-admin/pull/9167)) ([fzaninotto](https://github.com/fzaninotto))

## v4.12.4

* Fix `<FilterLiveSearch>` reset button does not reset the value ([#9149](https://github.com/marmelab/react-admin/pull/9149)) ([fzaninotto](https://github.com/fzaninotto))
* Fix deprecated `defaultProps` warnings in React 18 ([#9124](https://github.com/marmelab/react-admin/pull/9124)) ([adguernier](https://github.com/adguernier))
* [Doc] Add documentation about `<BulkUpdateFormButton>` and `<InputSelectorForm>` ([#9145](https://github.com/marmelab/react-admin/pull/9145)) ([adguernier](https://github.com/adguernier))
* [Doc] Improve `<TranslatableFields>` chapter ([#9154](https://github.com/marmelab/react-admin/pull/9154)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix Next.js tutorial for app and pages router ([#9131](https://github.com/marmelab/react-admin/pull/9131)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `<Admin loginPage={false}>` leads to an infinite loop ([#9166](https://github.com/marmelab/react-admin/pull/9166)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<AutoSaveToolbar>` should be used as a `ReactElement` ([#9157](https://github.com/marmelab/react-admin/pull/9157)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `<WizardForm>` snippet to use a custom progress bar ([#9163](https://github.com/marmelab/react-admin/pull/9163)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `canAccess` and `<IfCanAccess>` documentation about wildcard action fallback ([#9144](https://github.com/marmelab/react-admin/pull/9144)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix default `perPage` value in `useList` ([#9139](https://github.com/marmelab/react-admin/pull/9139)) ([smeng9](https://github.com/smeng9))
* [Doc] Fix `<Confirm>` description of confirm and cancel icon types ([#9140](https://github.com/marmelab/react-admin/pull/9140)) ([smeng9](https://github.com/smeng9))

## v4.12.3

* Fix `<FileField>` should not propagate click ([#9133](https://github.com/marmelab/react-admin/pull/9133)) ([slax57](https://github.com/slax57))
* [TypeScript] Fix TS errors with `<ArrayField>` and `<ChipField>` in stories ([#9132](https://github.com/marmelab/react-admin/pull/9132)) ([slax57](https://github.com/slax57))
* [Doc] Rename Architecture page to Key Concepts ([#9078](https://github.com/marmelab/react-admin/pull/9078)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix HowTos order and syntax in various chapters ([#9123](https://github.com/marmelab/react-admin/pull/9123)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix deprecated bulkActionButtons prop of List component ([#9135](https://github.com/marmelab/react-admin/pull/9135)) ([smeng9](https://github.com/smeng9))
* [chore] Bump semver from 5.7.1 to 5.7.2 ([#9091](https://github.com/marmelab/react-admin/pull/9091)) ([dependabot[bot]](https://github.com/apps/dependabot))

## v4.12.2

* Fix `useUnique` should allow value if the only matching record is the current one ([#9118](https://github.com/marmelab/react-admin/pull/9118)) ([djhi](https://github.com/djhi))
* Call `checkError` when `getPermissions` fails ([#9117](https://github.com/marmelab/react-admin/pull/9117)) ([djhi](https://github.com/djhi))
* Fix `useGetManyReference` default `onSuccess` throws when the query is disabled ([#9116](https://github.com/marmelab/react-admin/pull/9116)) ([slax57](https://github.com/slax57))
* Fix `<TranslatableInputs>` should support `fullWitdh` and `sx` props ([#9104](https://github.com/marmelab/react-admin/pull/9104)) ([djhi](https://github.com/djhi))
* Fix remove unsupported propTypes on `<List>` ([#9101](https://github.com/marmelab/react-admin/pull/9101)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SimpleFormIterator>` with `<FormDataConsumer>` should not re-apply default values ([#9094](https://github.com/marmelab/react-admin/pull/9094)) ([slax57](https://github.com/slax57))
* [Demo] Improve CRM Demo Kanban code ([#9114](https://github.com/marmelab/react-admin/pull/9114)) ([slax57](https://github.com/slax57))
* [Demo] Replace `react-beautiful-dnd` by `@hello-pangea/dnd` to support React 18 ([#9097](https://github.com/marmelab/react-admin/pull/9097)) ([slax57](https://github.com/slax57))
* [Doc] add sections to explain explicitly how to disable features like bulk actions ([#9086](https://github.com/marmelab/react-admin/pull/9086)) ([adguernier](https://github.com/adguernier))
* [Doc] Remove `emptyText` prop from `<AutoCompleteArrayInput>` doc as it is not supported ([#9073](https://github.com/marmelab/react-admin/pull/9073)) ([gitstart](https://github.com/gitstart))

## v4.12.1

* Fix closing browser tab loses undoable mutations without warning ([#9072](https://github.com/marmelab/react-admin/pull/9072)) ([adguernier](https://github.com/adguernier))
* [Doc] Improve a bit reference to Material UI ([#9087](https://github.com/marmelab/react-admin/pull/9087)) ([oliviertassinari](https://github.com/oliviertassinari))
* [Doc] Fix code examples syntax errors ([#9083](https://github.com/marmelab/react-admin/pull/9083)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing close tag in `<List>` `aside` snippet ([#9082](https://github.com/marmelab/react-admin/pull/9082)) ([slax57](https://github.com/slax57))
* [Doc] fix a typo: replace ise by use in NumberInput doc ([#9081](https://github.com/marmelab/react-admin/pull/9081)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix react-router outdated doc links ([#9079](https://github.com/marmelab/react-admin/pull/9079)) ([slax57](https://github.com/slax57))
* [Doc] Add doc for `<BulkUpdateButton>` ([#9077](https://github.com/marmelab/react-admin/pull/9077)) ([slax57](https://github.com/slax57))
* [Doc] fix a typo in variable template example using polyglot ([#9076](https://github.com/marmelab/react-admin/pull/9076)) ([adguernier](https://github.com/adguernier))
* [Doc] Add missing backticks for default empty value example ([#9075](https://github.com/marmelab/react-admin/pull/9075)) ([adguernier](https://github.com/adguernier))
* [Doc] Update Tutorial to use TypeScript by default ([#9074](https://github.com/marmelab/react-admin/pull/9074)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `<AutompleteInput create>` prop example ([#9071](https://github.com/marmelab/react-admin/pull/9071)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `<ReferenceManyField>` chapter snippets to match the example data  ([#9067](https://github.com/marmelab/react-admin/pull/9067)) ([eboss-dev](https://github.com/eboss-dev))

## v4.12.0

* Add unique validator ([#8999](https://github.com/marmelab/react-admin/pull/8999)) ([djhi](https://github.com/djhi))
* Allow disabling store persistence of the list parameters ([#9019](https://github.com/marmelab/react-admin/pull/9019)) ([djhi](https://github.com/djhi))
* Add ability to refetch permissions on demand ([#8955](https://github.com/marmelab/react-admin/pull/8955)) ([mmateja](https://github.com/mmateja))
* Add support for `mutationOptions` in `<BulkUpdateButton>` ([#9035](https://github.com/marmelab/react-admin/pull/9035)) ([KonkretneKosteczki](https://github.com/KonkretneKosteczki))
* Add eslint, prettier and default vite gitignore to create-react-admin ([#9055](https://github.com/marmelab/react-admin/pull/9055)) ([djhi](https://github.com/djhi))
* Memoize `<AutocompleteInput>`'s `filterToQuery` and improve `<AutocompleteInput>` and `<AutocompleteArrayInput>`'s docs about props stability ([#9046](https://github.com/marmelab/react-admin/pull/9046)) ([djhi](https://github.com/djhi))
* Update `<Link>` to honor the `underline` prop ([#8977](https://github.com/marmelab/react-admin/pull/8977)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DeleteButton>` doesn't allow to override the text color ([#9060](https://github.com/marmelab/react-admin/pull/9060)) ([adguernier](https://github.com/adguernier))
* Fix warning about string value passed to `BooleanInput` ([#9056](https://github.com/marmelab/react-admin/pull/9056)) ([adguernier](https://github.com/adguernier))
* Fix demos don't allow to visualize source maps ([#9047](https://github.com/marmelab/react-admin/pull/9047)) ([fzaninotto](https://github.com/fzaninotto))
* Fix custom input's onChange handlers should have access to updated context value ([#8910](https://github.com/marmelab/react-admin/pull/8910)) ([WiXSL](https://github.com/WiXSL))
* Upgrade to TS 5 ([#8937](https://github.com/marmelab/react-admin/pull/8937)) ([djhi](https://github.com/djhi))
* [Doc] Add SmartRichTextInput, an AI assistant for rich text content ([#9052](https://github.com/marmelab/react-admin/pull/9052)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Document useRegisterMutationMiddleware ([#9031](https://github.com/marmelab/react-admin/pull/9031)) ([djhi](https://github.com/djhi))
* [Doc] Better explain input's default label ([#9069](https://github.com/marmelab/react-admin/pull/9069)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix `sortBy` prop value in "Combining Two Fields" chapter ([#9048](https://github.com/marmelab/react-admin/pull/9048)) ([adguernier](https://github.com/adguernier))
* [Doc] fix links to TanStack Query V3 doc ([#9057](https://github.com/marmelab/react-admin/pull/9057)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix explanations in "Controlled Mode" section of `TabbedShowLayout.md` ([#9045](https://github.com/marmelab/react-admin/pull/9045)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix anchors and typos ([#9054](https://github.com/marmelab/react-admin/pull/9054)) ([WiXSL](https://github.com/WiXSL))
* [Doc] fix a typo in ReferenceOneField documentation ([#9053](https://github.com/marmelab/react-admin/pull/9053)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix a typo in `FieldsForRelationships.md` ([#9049](https://github.com/marmelab/react-admin/pull/9049)) ([adguernier](https://github.com/adguernier))
* [Doc] Fix a typo in `TabbedForm.md` ([#9041](https://github.com/marmelab/react-admin/pull/9041)) ([adguernier](https://github.com/adguernier))

## v4.11.4

 * Fix Input components add a bottom margin even when `helperText` is `false` ([#9037](https://github.com/marmelab/react-admin/pull/9037)) ([adguernier](https://github.com/adguernier))
 * Fix `<Loading>` custom message raises a missing translation key warning ([#9036](https://github.com/marmelab/react-admin/pull/9036)) ([adossas-spdrm](https://github.com/adossas-spdrm))
 * Fix linter warnings ([#9033](https://github.com/marmelab/react-admin/pull/9033)) ([fzaninotto](https://github.com/fzaninotto))
 * Fix `<RadioButtonGroupInput>` does not honor `id` prop in option labels ([#9025](https://github.com/marmelab/react-admin/pull/9025)) ([fzaninotto](https://github.com/fzaninotto))
 * Fix linter warnings ([#9024](https://github.com/marmelab/react-admin/pull/9024)) ([fzaninotto](https://github.com/fzaninotto))
 * Fix `<RichTextInput>` toolbar appearance ([#9018](https://github.com/marmelab/react-admin/pull/9018)) ([fzaninotto](https://github.com/fzaninotto))
 * [Doc] Fix `useList` example, with page option ([#9040](https://github.com/marmelab/react-admin/pull/9040)) ([adguernier](https://github.com/adguernier))
 * [Doc] Fix missing constant in List tutorial example ([#9032](https://github.com/marmelab/react-admin/pull/9032)) ([adguernier](https://github.com/adguernier))
 * [Doc] Improve description of RBAC tab, panel, section, and step ([#9030](https://github.com/marmelab/react-admin/pull/9030)) ([adguernier](https://github.com/adguernier))
 * [Doc] Fix link to German translation package ([#9028](https://github.com/marmelab/react-admin/pull/9028)) ([tommylenz](https://github.com/tommylenz))
 * [DOC] - Fix typo on `useGetTree` documentation ([#9027](https://github.com/marmelab/react-admin/pull/9027)) ([adguernier](https://github.com/adguernier))
 * [Doc] Update DataProvider file upload documentation to leverage `withLifeCycleCallbacks` ([#9022](https://github.com/marmelab/react-admin/pull/9022)) ([djhi](https://github.com/djhi))
## v4.11.3

* Fix Save button might stay disabled when using `<ArrayInput>` with default values ([#8971](https://github.com/marmelab/react-admin/pull/8971)) ([henryhobhouse](https://github.com/henryhobhouse))
* Fix `<Admin>` should call `authProvider.getPermissions` only when given a child function ([#9001](https://github.com/marmelab/react-admin/pull/9001)) ([adguernier](https://github.com/adguernier))
* Fix `<ListView>` does not apply CSS classes to its child components ([#8995](https://github.com/marmelab/react-admin/pull/8995)) ([djhi](https://github.com/djhi))
* Update ra-input-rich-text tiptap dependencies ([#8997](https://github.com/marmelab/react-admin/pull/8997)) ([djhi](https://github.com/djhi))
* [Doc] Add PredictiveTextInput chapter ([#9016](https://github.com/marmelab/react-admin/pull/9016)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Automatically convert TS examples to JS ([#9005](https://github.com/marmelab/react-admin/pull/9005)) ([djhi](https://github.com/djhi))
* [Doc] Mention RBAC forms in documentation ([#8996](https://github.com/marmelab/react-admin/pull/8996)) ([djhi](https://github.com/djhi))
* [Doc] Add documentation for Remix v2 routing conventions ([#9017](https://github.com/marmelab/react-admin/pull/9017)) ([djhi](https://github.com/djhi))
* [Doc] Add references throughout the documentation about linking two inputs ([#9015](https://github.com/marmelab/react-admin/pull/9015)) ([djhi](https://github.com/djhi))
* [Doc] Fix Next.js pages router installation misses src directory ([#9012](https://github.com/marmelab/react-admin/pull/9012)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix broken link in Next installation tutorial ([#9011](https://github.com/marmelab/react-admin/pull/9011)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Use WebM and MP4 videos instead of GIF for EE components ([#9006](https://github.com/marmelab/react-admin/pull/9006)) ([slax57](https://github.com/slax57))
* [Doc] Fix broken link to `useLockOnMount` in `useLock` ([#9002](https://github.com/marmelab/react-admin/pull/9002)) ([slax57](https://github.com/slax57))
* [Doc] Fix missing closing tag in custom AppBar example code ([#9000](https://github.com/marmelab/react-admin/pull/9000)) ([adguernier](https://github.com/adguernier))
* [Doc] Update links to the React documentation ([#8998](https://github.com/marmelab/react-admin/pull/8998)) ([adguernier](https://github.com/adguernier))
* [JSDoc] Fix `<ToggleThemeButton>` deprecated props JSDoc ([#8994](https://github.com/marmelab/react-admin/pull/8994)) ([slax57](https://github.com/slax57))

## v4.11.2

* Fix `<ReferenceField>` line height isn't consistent with other fields ([#8976](https://github.com/marmelab/react-admin/pull/8976)) ([fzaninotto](https://github.com/fzaninotto))
* Fix configurable does not have a targetable root class ([#8980](https://github.com/marmelab/react-admin/pull/8980)) ([djhi](https://github.com/djhi))
* Fix `<Admin>` fails when used in Next.js server components ([#8990](https://github.com/marmelab/react-admin/pull/8990)) ([fzaninotto](https://github.com/fzaninotto))
* Fix English translation of auth error message ([#8970](https://github.com/marmelab/react-admin/pull/8970)) ([joebordes](https://github.com/joebordes))
* Fix linter warnings ([#8978](https://github.com/marmelab/react-admin/pull/8978)) ([fzaninotto](https://github.com/fzaninotto))
* Bump vite from 3.2.0 to 3.2.7 ([#8981](https://github.com/marmelab/react-admin/pull/8981)) (dependabot)
* Fix `<AutocompleteArrayInput>` 'custom options' story ([#8983](https://github.com/marmelab/react-admin/pull/8983)) ([slax57](https://github.com/slax57))
* [TypeScript] Fix `<WithRecord>` `render` prop type ([#8993](https://github.com/marmelab/react-admin/pull/8993)) ([slax57](https://github.com/slax57))
* [TypeScript] Fix FunctionField render function type expects a nullable record ([#8963](https://github.com/marmelab/react-admin/pull/8963)) ([elstgav](https://github.com/elstgav))
* [Doc] Add `<AutoSave>` documentation ([#8969](https://github.com/marmelab/react-admin/pull/8969)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add `<TreeInput>` and `<ReferenceNodeInput>` chapters ([#8974](https://github.com/marmelab/react-admin/pull/8974)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Better explain the type of `getSource` and `scopedFormData` in `<FormDataConsumer>` ([#8979](https://github.com/marmelab/react-admin/pull/8979)) ([slax57](https://github.com/slax57))
* [Doc] Fix broken link in Realtime documentation ([#8991](https://github.com/marmelab/react-admin/pull/8991)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ReferenceArrayInput>` section about custom query filter ([#8989](https://github.com/marmelab/react-admin/pull/8989)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<CreateInDialogButton>` usage example ([#8988](https://github.com/marmelab/react-admin/pull/8988)) ([slax57](https://github.com/slax57))
* [Doc] Fix links to react-hook-form's doc ([#8984](https://github.com/marmelab/react-admin/pull/8984)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<Confirm>` prop table overflows ([#8985](https://github.com/marmelab/react-admin/pull/8985)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Remix tutorial mentions outdated postgrest adapter ([#8982](https://github.com/marmelab/react-admin/pull/8982)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix tag list on Mobile ([#8975](https://github.com/marmelab/react-admin/pull/8975)) ([fzaninotto](https://github.com/fzaninotto))

## v4.11.1

* Fix `<AutocompleteInput>` should not use `matchSuggestion` when in a `<ReferenceInput>` ([#8956](https://github.com/marmelab/react-admin/pull/8956)) ([slax57](https://github.com/slax57))
* Fix `<ListView>` should show custom empty component with partial pagination ([#8945](https://github.com/marmelab/react-admin/pull/8945)) ([yanchesky](https://github.com/yanchesky))
* [TypeScript] Fix inference errors in Field components ([#8962](https://github.com/marmelab/react-admin/pull/8962)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix regression in type of `<FunctionField>` `render` ([#8964](https://github.com/marmelab/react-admin/pull/8964)) ([slax57](https://github.com/slax57))
* [Doc] Add Next.js app router install instructions ([#8965](https://github.com/marmelab/react-admin/pull/8965)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix NextJS tutorial for the latest version of create-next-app ([#8938](https://github.com/marmelab/react-admin/pull/8938)) ([djhi](https://github.com/djhi))
* [Doc] Fix `dataProvider.getList()` response format error message does not take partial pagination into account ([#8957](https://github.com/marmelab/react-admin/pull/8957)) ([yanchesky](https://github.com/yanchesky))
* [Doc] Fix create-react-admin usage with npx ([#8961](https://github.com/marmelab/react-admin/pull/8961)) ([fzaninotto](https://github.com/fzaninotto))

## v4.11.0

* Add `<WithListContext>` component ([#8917](https://github.com/marmelab/react-admin/pull/8917)) ([fzaninotto](https://github.com/fzaninotto))
* Expose `setNotifications` callback in `<NotificationContext>` to allow for a custom notifications center ([#8914](https://github.com/marmelab/react-admin/pull/8914)) ([smeng9](https://github.com/smeng9))
* Add `purifyOptions` prop to `<RichTextField>` ([#8905](https://github.com/marmelab/react-admin/pull/8905)) ([slax57](https://github.com/slax57))
* Add `queryOptions` prop to `<ReferenceField>` ([#8895](https://github.com/marmelab/react-admin/pull/8895)) ([WiXSL](https://github.com/WiXSL))
* Add ability to default to dark mode when users prefer it ([#8874](https://github.com/marmelab/react-admin/pull/8874)) ([fzaninotto](https://github.com/fzaninotto))
* Simplify form reset on record change, and forward supported props from `useAugmentedForm` to `useForm` ([#8911](https://github.com/marmelab/react-admin/pull/8911)) ([slax57](https://github.com/slax57))
* Fix `useGetList` default `onSuccess` throws when the query is disabled ([#8941](https://github.com/marmelab/react-admin/pull/8941)) ([slax57](https://github.com/slax57))
* Fix `<SimpleForm>` and `<TabbedForm>` do not sanitize the `resetOptions` prop ([#8915](https://github.com/marmelab/react-admin/pull/8915)) ([slax57](https://github.com/slax57))
* [TypeScript] Allow to provide the record type to fields and validate the `source` and `sortBy` prop ([#8863](https://github.com/marmelab/react-admin/pull/8863)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix types that should accept a react-admin record ([#8862](https://github.com/marmelab/react-admin/pull/8862)) ([djhi](https://github.com/djhi))

## v4.10.6

* Fix ra-language-french package.json to avoid including tsconfig ([#8939](https://github.com/marmelab/react-admin/pull/8939)) ([djhi](https://github.com/djhi))
* Fix create-react-admin adds unnecessary files ([#8935](https://github.com/marmelab/react-admin/pull/8935)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `<Create>` generic record type should not require an `id` field ([#8923](https://github.com/marmelab/react-admin/pull/8923)) ([djhi](https://github.com/djhi))
* [Doc] Fix tutorial with create-react-admin ([#8934](https://github.com/marmelab/react-admin/pull/8934)) ([fzaninotto](https://github.com/fzaninotto))
* [chore] Update Storybook to v7 & Cypress to use Vite ([#8936](https://github.com/marmelab/react-admin/pull/8936)) ([djhi](https://github.com/djhi))

## v4.10.5

* Fix create and edit controller's save callback should use calltime meta param ([#8933](https://github.com/marmelab/react-admin/pull/8933)) ([slax57](https://github.com/slax57))
* Fix create-react-admin does not include its templates ([#8932](https://github.com/marmelab/react-admin/pull/8932)) ([djhi](https://github.com/djhi))

## v4.10.4

* Fix `<DatagridConfigurable>` inspector hides the wrong column when using empty children ([#8929](https://github.com/marmelab/react-admin/pull/8929)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DatagridConfigurable>` fails to render when using a Field with a label element ([#8928](https://github.com/marmelab/react-admin/pull/8928)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<TextField>` and `<RichTextField>` don't translate the `emptyText` ([#8924](https://github.com/marmelab/react-admin/pull/8924)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SaveButton>` spinner while submitting ([#8920](https://github.com/marmelab/react-admin/pull/8920)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix video playback on iOS ([#8922](https://github.com/marmelab/react-admin/pull/8922)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<List disableSyncWithLocation>` doc about persisting list params in the store ([#8919](https://github.com/marmelab/react-admin/pull/8919)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Document type parameter in generic hooks ([#8916](https://github.com/marmelab/react-admin/pull/8916)) ([djhi](https://github.com/djhi))

## v4.10.3

* Fix `<ReferenceField>` link function is called with referencing record instead of referenced record ([#8899](https://github.com/marmelab/react-admin/pull/8899)) ([djhi](https://github.com/djhi))
* Fix `ReferenceFieldView` backwards compatibility ([#8912](https://github.com/marmelab/react-admin/pull/8912)) ([djhi](https://github.com/djhi))
* Fix `create-react-admin` requires node 16 ([#8902](https://github.com/marmelab/react-admin/pull/8902)) ([fzaninotto](https://github.com/fzaninotto))
* [Typescript] Fix Layout's `sidebar` prop type ([#8887](https://github.com/marmelab/react-admin/pull/8887)) ([smeng9](https://github.com/smeng9))
* [Doc] Add Advanced Tutorial about Custom Tags Selector ([#8906](https://github.com/marmelab/react-admin/pull/8906)) ([slax57](https://github.com/slax57))
* [Doc] Update Datagrid's `isRowSelectable` description and examples ([#8901](https://github.com/marmelab/react-admin/pull/8901)) ([WiXSL](https://github.com/WiXSL))
* [Doc] fix import statements in example code ([#8896](https://github.com/marmelab/react-admin/pull/8896)) ([charlie-ac](https://github.com/charlie-ac))
* [Doc] add casdoor auth provider ([#8894](https://github.com/marmelab/react-admin/pull/8894)) ([akriventsev](https://github.com/akriventsev))
* [Doc] Add Supabase realtime adapter ([#8893](https://github.com/marmelab/react-admin/pull/8893)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Update tutorial to use `create-react-admin` ([#8881](https://github.com/marmelab/react-admin/pull/8881)) ([djhi](https://github.com/djhi))

## v4.10.2

* Fix custom redirect in pessimistic `<Edit>` or `<Create>` when using `warnWhenUnsavedChanges` ([#8882](https://github.com/marmelab/react-admin/pull/8882)) ([slax57](https://github.com/slax57))
* Fix `create-react-admin` package manifest ([#8888](https://github.com/marmelab/react-admin/pull/8888)) ([djhi](https://github.com/djhi))
* [Doc] Fix `<Menu.ResourceItem>` example should use the `name` prop ([#8886](https://github.com/marmelab/react-admin/pull/8886)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Update DataProvider List with `ra-strapi-rest` v4 ([#8865](https://github.com/marmelab/react-admin/pull/8865)) ([nazirov91](https://github.com/nazirov91))

## v4.10.1

* Republish all packages, including the `create-react-admin` installer ([fzaninotto](https://github.com/fzaninotto))

## v4.10.0

Note: This release wasn't published to npm, use version 4.10.1 or higher.

* Add `create-react-admin` installer ([#8833](https://github.com/marmelab/react-admin/pull/8833)) ([djhi](https://github.com/djhi))
* Add `<InfiniteList>` and `<InfinitePagination>` components ([#8781](https://github.com/marmelab/react-admin/pull/8781)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to change the sort, filter and selection of `<ArrayField>` ([#8802](https://github.com/marmelab/react-admin/pull/8802)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to configure the remove icon of `<FileInputPreview>` ([#8756](https://github.com/marmelab/react-admin/pull/8756)) ([PennyJeans](https://github.com/PennyJeans))
* Fix `<Datagrid>` does not apply `className` to its root element (minor BC) ([#8804](https://github.com/marmelab/react-admin/pull/8804)) ([slax57](https://github.com/slax57))
* Fix `useHandleCallback` sometimes causes infinite redirection loop ([#8861](https://github.com/marmelab/react-admin/pull/8861)) ([djhi](https://github.com/djhi))
* Fix `<AppBar alwaysOn>` hides sidebar menu on scroll ([#8856](https://github.com/marmelab/react-admin/pull/8856)) ([slax57](https://github.com/slax57))
* Fix `<SimpleFormIterator>` new item's fields default empty string instead of null ([#8792](https://github.com/marmelab/react-admin/pull/8792)) ([kriskw1999](https://github.com/kriskw1999))
* [Doc] Fix reference to Material UI ([#8857](https://github.com/marmelab/react-admin/pull/8857)) ([oliviertassinari](https://github.com/oliviertassinari))
* [Doc] Fix Show documentation misses the `aside` prop ([#8855](https://github.com/marmelab/react-admin/pull/8855)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Convert GIF files to WebM ([#8767](https://github.com/marmelab/react-admin/pull/8767)) ([slax57](https://github.com/slax57))
* [TypeScript] Add some utilities to improve generics ([#8815](https://github.com/marmelab/react-admin/pull/8815)) ([IAmVisco](https://github.com/IAmVisco))
* [TypeScript] Improve `useRedirect` and `useCreatePath` types ([#8811](https://github.com/marmelab/react-admin/pull/8811)) ([djhi](https://github.com/djhi))

## v4.9.4

* Fix GraphQL data provider when using different a custom credential type ([#8847](https://github.com/marmelab/react-admin/pull/8847)) ([@rlucia](https://github.com/rlucia))
* Fix `<AppBar>` title disappears on locale change ([#8846](https://github.com/marmelab/react-admin/pull/8846)) ([@slax57](https://github.com/slax57))
* Fix empty `<ImageField>` does not apply `sx` prop ([#8850](https://github.com/marmelab/react-admin/pull/8850)) ([@RoBYCoNTe](https://github.com/RoBYCoNTe))
* [Doc] Replace codesandbox links by stackblitz for issue reproduction ([#8853](https://github.com/marmelab/react-admin/pull/8853)) ([@slax57](https://github.com/slax57))
* [Doc] Fix examples of custom UserMenu items across the docs to support keyboard navigation ([#8837](https://github.com/marmelab/react-admin/pull/8837)) ([@smeng9](https://github.com/smeng9))
* [Doc] Fix WithRecord usage in Datagrid to remind the label requirement ([#8851](https://github.com/marmelab/react-admin/pull/8851)) ([@fzaninotto](https://github.com/fzaninotto))
* [Doc] Add more details about `useDefineAppLocation` in the `MultiLevelMenu` docs ([#8841](https://github.com/marmelab/react-admin/pull/8841)) ([@slax57](https://github.com/slax57))
* [TypeScript] Fix `<Button>` should accept user defined Material UI color palettes as `color` prop ([#8832](https://github.com/marmelab/react-admin/pull/8832)) ([@septentrion-730n](https://github.com/septentrion-730n))
* [TypeScript] Fix `<DateField>` props types ([#8844](https://github.com/marmelab/react-admin/pull/8844)) ([@elstgav](https://github.com/elstgav))

## v4.9.3

* Fix `useInput` callbacks are mutable ([#8824](https://github.com/marmelab/react-admin/pull/8824)) ([@fzaninotto](https://github.com/fzaninotto))
* Fix `<Form>` should only trigger field validation on submit if not told otherwise ([#8826](https://github.com/marmelab/react-admin/pull/8826)) ([@slax57](https://github.com/slax57))
* Fix `<ReferenceOneField>` shows wrong sort order when used in a `<Datagrid>` ([#8825](https://github.com/marmelab/react-admin/pull/8825)) ([@fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid rowClick>` PropTypes ([#8823](https://github.com/marmelab/react-admin/pull/8823)) ([@slax57](https://github.com/slax57))
* [Doc] Fix typo in EditGuesser ([#8834](https://github.com/marmelab/react-admin/pull/8834)) ([@thatzacdavis](https://github.com/thatzacdavis))
* [Doc] Improve usage examples for `<ReferenceInput>` and `<ReferenceArrayInput>` ([#8821](https://github.com/marmelab/react-admin/pull/8821)) ([@fzaninotto](https://github.com/fzaninotto))

## v4.9.2

* Fix `addRefreshAuthToAuthProvider` should not try to call `getIdentity` if it does not exist on the original `AuthProvider` ([#8810](https://github.com/marmelab/react-admin/pull/8810)) ([djhi](https://github.com/djhi))
* Fix `editorProps` prop is ignored in `<RichTextInput>` ([#8809](https://github.com/marmelab/react-admin/pull/8809)) ([ArnaudD](https://github.com/ArnaudD))
* Fix `useReferenceArrayInputController` does not pass `meta` to `getMany` ([#8803](https://github.com/marmelab/react-admin/pull/8803)) ([djhi](https://github.com/djhi))
* Fix `<FilterForm>` infinite loop when used in a `<ReferenceManyField>` ([#8800](https://github.com/marmelab/react-admin/pull/8800)) ([fzaninotto](https://github.com/fzaninotto))
* Fix layout padding inconsistency on low resolution screens ([#8794](https://github.com/marmelab/react-admin/pull/8794)) ([soullivaneuh](https://github.com/soullivaneuh))
* [Doc] Fix various markdown syntax warnings causing incorrect HTML ([#8818](https://github.com/marmelab/react-admin/pull/8818)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Update chinese(zh) locale package ([#8813](https://github.com/marmelab/react-admin/pull/8813)) ([haxqer](https://github.com/haxqer))

## v4.9.1

* Fix `<ReferenceInput>` logs warning on deselection ([#8788](https://github.com/marmelab/react-admin/pull/8788)) ([slax57](https://github.com/slax57))
* Fix form `validate` function no longer applies translation ([#8746](https://github.com/marmelab/react-admin/pull/8746)) ([slax57](https://github.com/slax57))
* [Doc] Add `<ReferenceOneInput>` ([#8783](https://github.com/marmelab/react-admin/pull/8783)) ([slax57](https://github.com/slax57))
* [Doc] Fix typo in `<AppBar>` example ([#8775](https://github.com/marmelab/react-admin/pull/8775)) ([davidhenley](https://github.com/davidhenley))
* [Doc] Fix missing `<Layout sidebar>` prop ([#8777](https://github.com/marmelab/react-admin/pull/8777)) ([smeng9](https://github.com/smeng9))
* [Doc] Fix typo in `<FilterList>` example ([#8773](https://github.com/marmelab/react-admin/pull/8773)) ([davidhenley](https://github.com/davidhenley))
* [Doc] Fix typo in `withLifecycleCallbacks` example ([#8769](https://github.com/marmelab/react-admin/pull/8769)) ([afilp](https://github.com/afilp))
* [Docs] Fix broken index page links ([#8768](https://github.com/marmelab/react-admin/pull/8768)) ([carlos-duran](https://github.com/carlos-duran))
* [TypeScript] Fix `UpdateParams` id type doesn't use generic type ([#8782](https://github.com/marmelab/react-admin/pull/8782)) ([zhujinxuan](https://github.com/zhujinxuan))

## v4.9.0

- Add ability to pass `null` to `TrueIcon` or `FalseIcon` in `<BooleanField>` ([#8760](https://github.com/marmelab/react-admin/pull/8760)) ([slax57](https://github.com/slax57))
- Improve `AppBar` Customization ([#8681](https://github.com/marmelab/react-admin/pull/8681)) ([fzaninotto](https://github.com/fzaninotto))
- Allow to customize how `<FilterListItem>` applies filters ([#8676](https://github.com/marmelab/react-admin/pull/8676)) ([djhi](https://github.com/djhi))
- Introduce `withRefreshAuth` ([#8574](https://github.com/marmelab/react-admin/pull/8574)) ([djhi](https://github.com/djhi))
- Add ability to change `<SelectArrayInput>`'s `size` prop and fix `outlined` variant ([#8562](https://github.com/marmelab/react-admin/pull/8562)) ([amilosmanli](https://github.com/amilosmanli))
- Add server side validation support ([#7938](https://github.com/marmelab/react-admin/pull/7938)) ([djhi](https://github.com/djhi))
- Add a codesandbox config for the tutorial ([#8753](https://github.com/marmelab/react-admin/pull/8753)) ([djhi](https://github.com/djhi))
- Fix `<ReferenceManyCount>` rendering link incorrectly ([#8752](https://github.com/marmelab/react-admin/pull/8752)) ([oleg-semyonov](https://github.com/oleg-semyonov))
- [Doc] Update grammar in README.md ([#8747](https://github.com/marmelab/react-admin/pull/8747)) ([tylertyssedal](https://github.com/tylertyssedal))
- [Doc] Fix `useRecordContext` explanation for forms ([#8743](https://github.com/marmelab/react-admin/pull/8743)) ([fzaninotto ](https://github.com/fzaninotto))
- [Doc] Add Directus data and auth providers ([#8759](https://github.com/marmelab/react-admin/pull/8759)) ([djhi](https://github.com/djhi))

We released [`ra-directus`](https://github.com/marmelab/ra-directus/) that contains a `DataProvider` and an `AuthProvider` to work with [Directus](https://directus.io/).

We also released new landing pages for both [React-admin](https://marmelab.com/react-admin/) and the [Enterprise Edition](https://marmelab.com/ra-enterprise/). Check them out!

## v4.8.4

* Include the `to` prop in memoization check of `<CreateButton>` and `<ShowButton>`. ([#8741](https://github.com/marmelab/react-admin/pull/8741)) ([djhi](https://github/djhi))
* Fix graphql global introspection caching. ([#8740](https://github.com/marmelab/react-admin/pull/8740)) ([djhi](https://github/djhi))
* Fix `<Count>` and `<ReferenceManyCount>` should allow to override the default `sort`. ([#8732](https://github.com/marmelab/react-admin/pull/8732)) ([slax57](https://github/slax57))
* [Doc] Add AuthProvider and DataProvider for SurrealDB. ([#8739](https://github.com/marmelab/react-admin/pull/8739)) ([djedi23 ](https://github/djedi23 ))
* [Doc] Fix missing await in fetchJson doc. ([#8733](https://github.com/marmelab/react-admin/pull/8733)) ([slax57](https://github/slax57))

## v4.8.3

* Fix `<FilterFormInput>` should not override its children's `size` if they provide one explicitly ([#8693](https://github.com/marmelab/react-admin/pull/8693)) ([slax57](https://github.com/slax57))
* Fix `<ReferenceInput>` throws an error when referencing the same resource as `<Edit>` and the reference is undefined ([#8719](https://github.com/marmelab/react-admin/pull/8719)) ([slax57](https://github.com/slax57))
* Fix some components are translating labels twice ([#8700](https://github.com/marmelab/react-admin/pull/8700)) ([djhi](https://github.com/djhi))
* Fix `<SelectArrayInput>` does not display its label correctly in outlined variant ([#8705](https://github.com/marmelab/react-admin/pull/8705)) ([sebastianbuechler](https://github.com/sebastianbuechler))
* Fix `<UrlField>` click should cancel Datagrid's row click ([#8708](https://github.com/marmelab/react-admin/pull/8708)) ([slax57](https://github.com/slax57))
* [Doc] Better document `<ReferenceManyField>`'s `source` prop ([#8726](https://github.com/marmelab/react-admin/pull/8726)) ([slax57](https://github.com/slax57))
* [Doc] add Strapi v4 provider ([#8725](https://github.com/marmelab/react-admin/pull/8725)) ([garridorafa](https://github.com/garridorafa))
* [Doc] Add documentation for `fetchJson` ([#8712](https://github.com/marmelab/react-admin/pull/8712)) ([slax57](https://github.com/slax57))
* [Doc] Fix documentation regarding `<RecordContextProvider>` usage ([#8716](https://github.com/marmelab/react-admin/pull/8716)) ([postor ](https://github.com/postor ))
* [Doc] Improve `<Confirm>` documentation ([#8711](https://github.com/marmelab/react-admin/pull/8711)) ([fzaninotto](https://github.com/fzaninotto))
* Use Vite for the CRM demo ([#8696](https://github.com/marmelab/react-admin/pull/8696)) ([djhi](https://github.com/djhi))

## v4.8.2

* Fix `<Labeled>` ignores `fullWidth` when `label` is false ([#8689](https://github.com/marmelab/react-admin/pull/8689)) ([slax57](https://github.com/slax57))
* Fix `<AutocompleteInput>` when record has a different shape between `getList` and `getMany` ([#8687](https://github.com/marmelab/react-admin/pull/8687)) ([slax57](https://github.com/slax57))
* Fix `<Configurable>` elements don't allow to edit a text field ([#8682](https://github.com/marmelab/react-admin/pull/8682)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<DatagridConfigurable>` column ordering feature does not work in Firefox ([#8673](https://github.com/marmelab/react-admin/pull/8673)) ([slax57](https://github.com/slax57))
* [Typescript] Fix `<Datagrid rowClick>` type and documentation ([#8677](https://github.com/marmelab/react-admin/pull/8677)) ([djhi](https://github.com/djhi))
* [TypeScript] Add type to `downloadCSV` function ([#8686](https://github.com/marmelab/react-admin/pull/8686)) ([zhujinxuan](https://github.com/zhujinxuan))
* [Doc] Add `ra-auth-msal` to the authProvider list ([#8703](https://github.com/marmelab/react-admin/pull/8703)) ([slax57](https://github.com/slax57))
* [Doc] Fix typo in Vite documentation ([#8692](https://github.com/marmelab/react-admin/pull/8692)) ([djhi](https://github.com/djhi))
* [Doc] Add `global` definition to the Vite example, and offer to install the Roboto font locally ([#8680](https://github.com/marmelab/react-admin/pull/8680)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<MenuItem>` example usage in Upgrade guide ([#8678](https://github.com/marmelab/react-admin/pull/8678)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add troubleshooting section to the Routing chapter ([#8669](https://github.com/marmelab/react-admin/pull/8669)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Remove Webpack bundler in simple example ([#8694](https://github.com/marmelab/react-admin/pull/8694)) ([djhi](https://github.com/djhi))

## v4.8.1

* Fix `<Notification>` raises a Material UI warning when message is a string ([#8666](https://github.com/marmelab/react-admin/pull/8666)) ([slax57](https://github.com/slax57))
* Fix `<ArrayField>` breaks when value is `null` ([#8659](https://github.com/marmelab/react-admin/pull/8659)) ([slax57](https://github.com/slax57))
* Fix `<SimpleForm>` save toolbar hides content on mobile ([#8656](https://github.com/marmelab/react-admin/pull/8656)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix bad type deprecation on `onError` type ([#8668](https://github.com/marmelab/react-admin/pull/8668)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix bad casing on `onError` type ([#8667](https://github.com/marmelab/react-admin/pull/8667)) ([djhi](https://github.com/djhi))
* [Doc] Explain `<ReferenceOneField>` usage with one-to-many relationships ([#8660](https://github.com/marmelab/react-admin/pull/8660)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Remix installation instructions to avoid react-router error ([#8655](https://github.com/marmelab/react-admin/pull/8655)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos, snippets and file extensions in Tutorial ([#8607](https://github.com/marmelab/react-admin/pull/8607)) ([erikvanderwerf](https://github.com/erikvanderwerf))
* [Doc] Improve `<CheckboxGroupInput translateChoice>` code example ([#8657](https://github.com/marmelab/react-admin/pull/8657)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Fix Datagrid shows gutter on last row ([#8661](https://github.com/marmelab/react-admin/pull/8661)) ([slax57](https://github.com/slax57))

## v4.8.0

* Add ability for `<List>` children to handle the empty state ([#8585](https://github.com/marmelab/react-admin/pull/8585)) ([djhi](https://github.com/djhi))
* Add ability to override available routes for a `<Resource>` ([#8640](https://github.com/marmelab/react-admin/pull/8640)) ([slax57](https://github.com/slax57))
* Add support for `<ExportButton meta>` and `<BulkExportButton meta>` ([#8636](https://github.com/marmelab/react-admin/pull/8636)) ([fkowal](https://github.com/fkowal))
* Add ability to use a React Node as `useNotify` message ([#8580](https://github.com/marmelab/react-admin/pull/8580)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability for `<Datagrid isRowSelectable>` to show a disabled checkbox for unselectable rows ([#8650](https://github.com/marmelab/react-admin/pull/8650)) ([WiXSL](https://github.com/WiXSL))
* Improve performance by memoizing mutation callbacks ([#8526](https://github.com/marmelab/react-admin/pull/8526)) ([rkfg](https://github.com/rkfg))
* Fix `shouldUnregister` prop used in an Input logs a DOM warning ([#8653](https://github.com/marmelab/react-admin/pull/8653)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<CheckboxGroupInput helperText>` placement and color ([#8652](https://github.com/marmelab/react-admin/pull/8652)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useList` filter option not working with nested objects ([#8646](https://github.com/marmelab/react-admin/pull/8646)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Make `<FormDataConsumer>` generic ([#8389](https://github.com/marmelab/react-admin/pull/8389)) ([Gabriel-Malenowitch](https://github.com/Gabriel-Malenowitch))
* [Doc] Add section in `<Breadcrumb>` documentation about nested resources ([#8648](https://github.com/marmelab/react-admin/pull/8648)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `useMutation` usage examples use the wrong syntax ([#8647](https://github.com/marmelab/react-admin/pull/8647)) ([WiXSL](https://github.com/WiXSL))

## v4.7.6

**This release contains a security fix.** You must upgrade to this version if you use `<RichTextField>` with rich text data that isn't sanitized server-side.

* [Security] Fix XSS vulnerability in `<RichTextField>` ([#8644](https://github.com/marmelab/react-admin/pull/8644)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FilterForm>` cannot clear filter with complex object value ([#8637](https://github.com/marmelab/react-admin/pull/8637)) ([slax57](https://github.com/slax57))
* [Doc] Add `<StackedFilters>` chapter ([#8631](https://github.com/marmelab/react-admin/pull/8631)) ([fzaninotto](https://github.com/fzaninotto))

## v4.7.5

* Fix `<FileInput>` label color ([#8625](https://github.com/marmelab/react-admin/pull/8625)) ([fzaninotto](https://github.com/fzaninotto))
* Fix cannot override `<CreateButton>` and `<EditButton>` style with a theme ([#8624](https://github.com/marmelab/react-admin/pull/8624)) ([IAmVisco](https://github.com/IAmVisco))
* Fix `ra-input-rich-text` dependencies on tiptap ([#8622](https://github.com/marmelab/react-admin/pull/8622)) ([slax57](https://github.com/slax57))
* [Doc] Fix `useList` with `useGetList` example ([#8634](https://github.com/marmelab/react-admin/pull/8634)) ([slax57](https://github.com/slax57))
* Bump http-cache-semantics from 4.1.0 to 4.1.1 ([#8620](https://github.com/marmelab/react-admin/pull/8620)) ([dependabot](https://github.com/dependabot))

## v4.7.4

* [Doc] Improve the community page ([#8617](https://github.com/marmelab/react-admin/pull/8617)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix nested routes explanation and add more examples ([#8616](https://github.com/marmelab/react-admin/pull/8616)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix useless `useEffect` in CRM demo ([#8614](https://github.com/marmelab/react-admin/pull/8614)) ([fzaninotto](https://github.com/fzaninotto))

## v4.7.3

* Fix `<AutocompleteArrayInput>` when value is not an array ([#8608](https://github.com/marmelab/react-admin/pull/8608)) ([djhi](https://github.com/djhi))
* Fix `<NumberInput>` should support entering a decimal number with a transitory invalid value ([#8610](https://github.com/marmelab/react-admin/pull/8610)) ([slax57](https://github.com/slax57))

## v4.7.2

* Fix `useGetManyAggregate` error when ids is not an array ([#8603](https://github.com/marmelab/react-admin/pull/8603)) ([djhi](https://github.com/djhi))
* Fix `<AutocompleteInput>` when multiple is true and value is not an array ([#8602](https://github.com/marmelab/react-admin/pull/8602)) ([djhi](https://github.com/djhi))
* Fix `<SelectArrayInput>` error when value is not an array ([#8601](https://github.com/marmelab/react-admin/pull/8601)) ([djhi](https://github.com/djhi))
* Fix `<AutocompleteInput>` flickers inside `<ReferenceInput>` ([#8599](https://github.com/marmelab/react-admin/pull/8599)) ([djhi](https://github.com/djhi))
* [Doc] Fix typo in `<Search>` example ([#8579](https://github.com/marmelab/react-admin/pull/8579)) ([AdamMcquiff](https://github.com/AdamMcquiff))
* [Doc] Add Features chapter ([#8598](https://github.com/marmelab/react-admin/pull/8598)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add illustration to list and edit tutorials ([#8588](https://github.com/marmelab/react-admin/pull/8588)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add HelpDesk demo ([#8583](https://github.com/marmelab/react-admin/pull/8583)) ([fzaninotto](https://github.com/fzaninotto))
* Bump ua-parser-js from 0.7.31 to 0.7.33 ([#8600](https://github.com/marmelab/react-admin/pull/8600)) ([dependabot](https://github.com/dependabot))

## v4.7.1

* Fix `<LoginForm>` logs a warning in latest Chrome ([#8559](https://github.com/marmelab/react-admin/pull/8559)) ([fayazpn](https://github.com/fayazpn))
* [Doc] Add new authProviders (auth0, cognito) ([#8558](https://github.com/marmelab/react-admin/pull/8558)) ([djhi](https://github.com/djhi))
* [Doc] Fix typos in v4 Upgrade instructions ([#8577](https://github.com/marmelab/react-admin/pull/8577)) ([harryghgim](https://github.com/harryghgim))
* [Doc] Fix `<AutoCompleteArrayInput>` doc about `disableCloseOnSelect` ([#8569](https://github.com/marmelab/react-admin/pull/8569)) ([TurtIeSocks](https://github.com/TurtIeSocks))
* [Doc] Fix various typos ([#8568](https://github.com/marmelab/react-admin/pull/8568)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing `<Show disableAuthentication>` prop description ([#8565](https://github.com/marmelab/react-admin/pull/8565)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Fix Data Providers doc about typed `fetchJson` utility ([#8563](https://github.com/marmelab/react-admin/pull/8563)) ([slax57](https://github.com/slax57))
* [TypeScript] Fix `<DatagridRowR rowClick>` type ([#8561](https://github.com/marmelab/react-admin/pull/8561)) ([stesie](https://github.com/stesie))
* Bump json5 from 1.0.1 to 1.0.2  dependenciesPull requests that update a dependency([#8552](https://github.com/marmelab/react-admin/pull/8552)) ([dependabot](https://github.com/dependabot))

## v4.7.0

* Add lifecycle callbacks (`beforeDelete`, `afterUpdate`, etc.) to facilitate dataProvider customization ([#8511](https://github.com/marmelab/react-admin/pull/8511)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<Count>` and `<ReferenceManyCount>` components ([#8492](https://github.com/marmelab/react-admin/pull/8492)) ([fzaninotto](https://github.com/fzaninotto))
* Add `/login-callback` route and new optional `authProvider.handleLoginCalback()` method ([#8457](https://github.com/marmelab/react-admin/pull/8457)) ([djhi](https://github.com/djhi))
* Add ability to set `anchorOrigin` in `useNotify` ([#8541](https://github.com/marmelab/react-admin/pull/8541)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to pass multiple children to `<List>` and `<Create>` ([#8533](https://github.com/marmelab/react-admin/pull/8533)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<TabbedForm.Tab>` and `<TabbedShowLayout.Tab>` shortcuts ([#8525](https://github.com/marmelab/react-admin/pull/8525)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to pass a tab count in `<TabbedForm.Tab>` and `<TabbedShowLayout.Tab>` ([#8543](https://github.com/marmelab/react-admin/pull/8543)) ([fzaninotto](https://github.com/fzaninotto))
* Add data sharing across tabs in `ra-data-local-storage` ([#8542](https://github.com/marmelab/react-admin/pull/8542)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput create>` does not support nested `optionText` ([#8556](https://github.com/marmelab/react-admin/pull/8556)) ([slax57](https://github.com/slax57))
* Use react-query for `useAuthState` and `useAuthenticated` ([#8496](https://github.com/marmelab/react-admin/pull/8496)) ([djhi](https://github.com/djhi))
* Deprecate `usePermissionsOptimised` ([#8521](https://github.com/marmelab/react-admin/pull/8521)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Add ability to extend the authProvider ([#8551](https://github.com/marmelab/react-admin/pull/8551)) ([djhi](https://github.com/djhi))
* [Doc] Add Realtime documentation ([#8555](https://github.com/marmelab/react-admin/pull/8555)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add `<DataTimeInput>` section about how to build a parse function ([#8553](https://github.com/marmelab/react-admin/pull/8553)) ([slax57](https://github.com/slax57))
* [Doc] Fix instructions for setting up a redirection url for third-party auth ([#8494](https://github.com/marmelab/react-admin/pull/8494)) ([fzaninotto](https://github.com/fzaninotto))

## 4.6.3

* Fix `<ListGuesser>` links to Edit view even though there is only a ShowView ([#8546](https://github.com/marmelab/react-admin/pull/8546)) ([WiXSL](https://github.com/WiXSL))
* Fix notifications with type 'warning' should use the warning text color from the Material UI palette ([#8532](https://github.com/marmelab/react-admin/pull/8532)) ([Seojun-Park](https://github.com/Seojun-Park))
* Fix notifications with type 'warning' should use the warning color from the Material UI palette ([#8519](https://github.com/marmelab/react-admin/pull/8519)) ([Seojun-Park](https://github.com/Seojun-Park))
* [Doc] Improve Index/Reference page ([#8550](https://github.com/marmelab/react-admin/pull/8550)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Improve `<Search>` usage documentation ([#8527](https://github.com/marmelab/react-admin/pull/8527)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ContainerLayout>` is hard to find ([#8547](https://github.com/marmelab/react-admin/pull/8547)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Theming doc does not mention limitations of custom error page ([#8538](https://github.com/marmelab/react-admin/pull/8538)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<XXXInput helperText>` description to explain that it cannot be used inside a filter ([#8531](https://github.com/marmelab/react-admin/pull/8531)) ([slax57](https://github.com/slax57))
* [Doc] Fix `useList` hook doc contains wrong examples ([#8524](https://github.com/marmelab/react-admin/pull/8524)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ImageInput accept>` prop examples ([#8514](https://github.com/marmelab/react-admin/pull/8514)) ([slax57](https://github.com/slax57))
* [Doc] Show nav sidebar on main navigation page ([#8461](https://github.com/marmelab/react-admin/pull/8461)) ([fzaninotto](https://github.com/fzaninotto))

## 4.6.2

* Fix `<ReferenceArrayInput>` and `<AutoCompleteInput>` when identifiers have the wrong type ([#8500](https://github.com/marmelab/react-admin/pull/8500)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `warnWhenUnsavedChanges` when navigating to the Show view ([#8512](https://github.com/marmelab/react-admin/pull/8512)) ([slax57](https://github.com/slax57))
* Fix `useGetIdentity` throws an error when no `authProvider.getIdentity` is defined ([#8509](https://github.com/marmelab/react-admin/pull/8509)) ([slax57](https://github.com/slax57))
* Fix `<Datagrid>` positioning of bulk action buttons ([#8504](https://github.com/marmelab/react-admin/pull/8504)) ([fzaninotto](https://github.com/fzaninotto))
* Fix incorrect `<Ready>` page when dynamically load routes with no resources ([#8490](https://github.com/marmelab/react-admin/pull/8490)) ([smeng9](https://github.com/smeng9))
* Fix `<Ready>` page points to the wrong documentation URL ([#8495](https://github.com/marmelab/react-admin/pull/8495)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix return type of `useShowContext`, `useEditContext`, and `useCreateContext` ([#8497](https://github.com/marmelab/react-admin/pull/8497)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `useReferenceManyFieldController` argument type ([#8491](https://github.com/marmelab/react-admin/pull/8491)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<LocalesMenuButton>`'s custom AppBar example and `polyglotI18nProvider` documentation ([#8452](https://github.com/marmelab/react-admin/pull/8452)) ([smeng9](https://github.com/smeng9))
* [Doc] Fix `<Menu>` donc contains invalid code example ([#8502](https://github.com/marmelab/react-admin/pull/8502)) ([Aikain](https://github.com/Aikain))
* [Doc] Fix `<Menu>` example misses JSX closing tag  ([#8493](https://github.com/marmelab/react-admin/pull/8493)) ([the133448](https://github.com/the133448))
* Bump express from 4.16.4 to 4.17.3 ([#8487](https://github.com/marmelab/react-admin/pull/8487)) ([dependabot](https://github.com/dependabot))

## 4.6.1

* Fix `<SelectColumnsButton referenceKey>` prop handling ([#8432](https://github.com/marmelab/react-admin/pull/8432)) ([wcoppens](https://github.com/wcoppens))
* Fix `<TextInput>` missing placeholder with Material UI v5.4 ([#8439](https://github.com/marmelab/react-admin/pull/8439)) ([kosmotema](https://github.com/kosmotema))
* Fix `<ResourceMenuItem>` throws an error when used with only `<Resource>` as `<Admin>` children ([#8473](https://github.com/marmelab/react-admin/pull/8473)) ([slax57](https://github.com/slax57))
* Fix `useReferenceInputController` does not pass meta to `useReference` ([#8477](https://github.com/marmelab/react-admin/pull/8477)) ([stesie](https://github.com/stesie))
* Fix `ra-input-richtext` TipTap dependencies on prosemirror ([#8470](https://github.com/marmelab/react-admin/pull/8470)) ([slax57](https://github.com/slax57))
* Fix `setSubmissionErrors` contains unused code ([#8482](https://github.com/marmelab/react-admin/pull/8482)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<Datagrid>` doc contains invalid code example ([#8474](https://github.com/marmelab/react-admin/pull/8474)) ([Aikain](https://github.com/Aikain))
* [Doc] Fix `<ArrayInput>` preview misses clear all button ([#8467](https://github.com/marmelab/react-admin/pull/8467)) ([slax57](https://github.com/slax57))
* [TypeScript] Fiw `TranslationMessages` missing types ([#8462](https://github.com/marmelab/react-admin/pull/8462)) ([Aikain](https://github.com/Aikain))
* Bump decode-uri-component from 0.2.0 to 0.2.2  dependenciesPull requests that update a dependency file ([#8460](https://github.com/marmelab/react-admin/pull/8460)) ([dependabot](https://github.com/dependabot))

## 4.6.0

* Add UI to reorder fields in `<DatagridConfigurable>` and `<SimpleFormConfigurable>` ([#8416](https://github.com/marmelab/react-admin/pull/8416)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<SimpleFormConfigurable>` component ([#8395](https://github.com/marmelab/react-admin/pull/8395)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<Menu.ResourceItem>` component to facilitate menu customization ([#8392](https://github.com/marmelab/react-admin/pull/8392)) ([fzaninotto](https://github.com/fzaninotto))
* Add "clear all" button in `<SimpleFormIterator>` ([#8302](https://github.com/marmelab/react-admin/pull/8302)) ([Seojun-Park](https://github.com/Seojun-Park))
* Add ability to refresh the user identity in `useGetIdentity` ([#8372](https://github.com/marmelab/react-admin/pull/8372)) ([fzaninotto](https://github.com/fzaninotto))
* Add `<ReferenceOneField queryOptions>` support ([#8348](https://github.com/marmelab/react-admin/pull/8348)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for GraphQL v16 in ra-data-graphql  ([#8421](https://github.com/marmelab/react-admin/pull/8421)) ([arjunyel](https://github.com/arjunyel))
* Fix `<SavedQueryFilterListItem>` sets wrong value for displayedFilters query parameter  ([#8459](https://github.com/marmelab/react-admin/pull/8459)) ([groomain](https://github.com/groomain))
* Fix `<ToggleThemeButton>` requires an extra click when initial value is dark ([#8455](https://github.com/marmelab/react-admin/pull/8455)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix` <NumberInput parse>` parses 0 as string ([#8454](https://github.com/marmelab/react-admin/pull/8454)) ([slax57](https://github.com/slax57))
* Fix `<NumberInput format>` does not get triggered after function change ([#8453](https://github.com/marmelab/react-admin/pull/8453)) ([smeng9](https://github.com/smeng9))
* Fix `<ArrayInput>` doesn't allow `null` as value ([#8449](https://github.com/marmelab/react-admin/pull/8449)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ResettableTextfield>` does not show focus on clear buttons ([#8447](https://github.com/marmelab/react-admin/pull/8447)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<FormDataConsumer>` usage with Field children ([#8445](https://github.com/marmelab/react-admin/pull/8445)) ([WiXSL](https://github.com/WiXSL))
* Fix `<UserEdit>` save usage in simple example ([#8435](https://github.com/marmelab/react-admin/pull/8435)) ([WiXSL](https://github.com/WiXSL))
* Fix `useFormGroup` isDirty / isTouched state cannot have non-boolean values ([#8433](https://github.com/marmelab/react-admin/pull/8433)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<Datagrid>` expand screen capture with expand all button ([#8456](https://github.com/marmelab/react-admin/pull/8456)) ([slax57](https://github.com/slax57))
* [Doc] Fix `useEditContext` example typo ([#8444](https://github.com/marmelab/react-admin/pull/8444)) ([guilbill](https://github.com/guilbill))

## v4.5.4

* Fix `<NumberInput>` applies `format` and `parse` twice ([#8442](https://github.com/marmelab/react-admin/pull/8442)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `<ReferenceArrayInput>` props type marks children as required ([##8440](https://github.com/marmelab/react-admin/pull/#8440)) ([fzaninotto](https://github.com/fzaninotto))

## v4.5.3

* Fix `<TabbedFormView toolbar>` prop type validation ([#8436](https://github.com/marmelab/react-admin/pull/8436)) ([kosmotema](https://github.com/kosmotema))
* Fix `<NumberInput>` does not pass `format` and `parse` props to `useInput` ([#8422](https://github.com/marmelab/react-admin/pull/8422)) ([WiXSL](https://github.com/WiXSL))
* Fix `<NumberInput>` does not show `helperText` with an `onBlur` prop and `mode='onBlur'` ([#8403](https://github.com/marmelab/react-admin/pull/8403)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectInput>` does not sanitize the `shouldUnregister` prop ([#8413](https://github.com/marmelab/react-admin/pull/8413)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SimpleForm>` and `<TabbedForm>` use outdated prop types ([#8414](https://github.com/marmelab/react-admin/pull/8414)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<AutocompleteInput>` wrongly references react-autosuggest props ([#8424](https://github.com/marmelab/react-admin/pull/8424)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<SelectColumnsButton>` usage example in List view ([#8417](https://github.com/marmelab/react-admin/pull/8417)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `useList` `filterCallback` prop description ([#8404](https://github.com/marmelab/react-admin/pull/8404)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<FormDataConsumer>` usage example for `<SimpleFormIterator>` ([#8359](https://github.com/marmelab/react-admin/pull/8359)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Vite tutorial misses Roboto font ([#8419](https://github.com/marmelab/react-admin/pull/8419)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Vite tutorial CSS setup ([#8415](https://github.com/marmelab/react-admin/pull/8415)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Next.js tutorial uses CamelCase for folder name ([#8437](https://github.com/marmelab/react-admin/pull/8437)) ([jayenashar](https://github.com/jayenashar))

## v4.5.2

* Fix `authProvider` hooks support for redirectTo: absolute URL ([#8382](https://github.com/marmelab/react-admin/pull/8382)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `authProvider` hooks support for redirectTo: false ([#8381](https://github.com/marmelab/react-admin/pull/8381)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FormDataConsumer>` values not being up-to-date on mount ([#8340](https://github.com/marmelab/react-admin/pull/8340)) ([WiXSL](https://github.com/WiXSL))
* Fix `<DatagridConfigurable>` ignores children without label or source ([#8376](https://github.com/marmelab/react-admin/pull/8376)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectColumnsButton>` styles ([#8391](https://github.com/marmelab/react-admin/pull/8391)) ([WiXSL](https://github.com/WiXSL))
* Bump loader-utils from 1.4.1 to 1.4.2  dependenciesPull requests that update a dependency file([#8396](https://github.com/marmelab/react-admin/pull/8396)) ([dependabot](https://github.com/dependabot))
* [Doc] Fix `<FilterList>` example and anchor ([#8401](https://github.com/marmelab/react-admin/pull/8401)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `useReference` hook docs ([#8385](https://github.com/marmelab/react-admin/pull/8385)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<AutocompleteInput optionText>` defaultValue ([#8386](https://github.com/marmelab/react-admin/pull/8386)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing error type in `useNotify` ([#8398](https://github.com/marmelab/react-admin/pull/8398)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Improve server side validation example ([#8378](https://github.com/marmelab/react-admin/pull/8378)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add mention about asterix decoration in required inputs ([#8383](https://github.com/marmelab/react-admin/pull/8383)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add AppWrite data provider ([#8399](https://github.com/marmelab/react-admin/pull/8399)) ([fzaninotto](https://github.com/fzaninotto))

## 4.5.1

* Fix `<RichTextInput>` cursor moves to the end while typing ([#8365](https://github.com/marmelab/react-admin/pull/8365)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectColumnsButton>` not being responsive ([#8362](https://github.com/marmelab/react-admin/pull/8362)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Appbar>` buttons don't have consistent spacing ([#8356](https://github.com/marmelab/react-admin/pull/8356)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<BulkDeleteButton>` doesn't clear selection when used inside `<ReferenceManyField>` ([#8358](https://github.com/marmelab/react-admin/pull/8358)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceManyField>` does not show pagination when using partial pagination ([#8354](https://github.com/marmelab/react-admin/pull/8354)) ([fzaninotto](https://github.com/fzaninotto))
* Fix typo in `ra-language-french` translations ([#8349](https://github.com/marmelab/react-admin/pull/8349)) ([asurare](https://github.com/asurare))
* Fix Inputs layout is broken when rendering the Login page first ([#8368](https://github.com/marmelab/react-admin/pull/8368)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `no-code` example codesandbox ([#8352](https://github.com/marmelab/react-admin/pull/8352)) ([fzaninotto](https://github.com/fzaninotto))
* Bump loader-utils from 1.4.0 to 1.4.1 ([#8371](https://github.com/marmelab/react-admin/pull/8371)) ([dependabot](https://github.com/dependabot))
* [Doc] Add missing `<Admin notification>` prop ([#8369](https://github.com/marmelab/react-admin/pull/8369)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `<InspectorButton>` documentation ([#8346](https://github.com/marmelab/react-admin/pull/8346)) ([smeng9](https://github.com/smeng9))
* [Doc] Update the tutorial to use Vite instead of create-react-app ([#8351](https://github.com/marmelab/react-admin/pull/8351)) ([fzaninotto](https://github.com/fzaninotto))
* [Demo] Fix demos use different versions of Vite ([#8345](https://github.com/marmelab/react-admin/pull/8345)) ([fzaninotto](https://github.com/fzaninotto))

## v4.5.0

* Add `<SelectColumnsButton>` and `<DatagridConfigurable>` components ([#8274](https://github.com/marmelab/react-admin/pull/8274)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `<ReferenceArrayInput queryOptions>` ([#8339](https://github.com/marmelab/react-admin/pull/8339)) ([WiXSL](https://github.com/WiXSL))
* Add the ability to use `<ReferenceArrayInput>` without child ([#8332](https://github.com/marmelab/react-admin/pull/8332)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for `<ReferenceOneField>` `sort` and `filter` props ([#8306](https://github.com/marmelab/react-admin/pull/8306)) ([nicgirault](https://github.com/nicgirault))
* Add `<CSSBaseline>` to the default layout for better UI ([#8216](https://github.com/marmelab/react-admin/pull/8216)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SelectInput>` throws `cannot read property map of undefined` error on undefined choices ([#8309](https://github.com/marmelab/react-admin/pull/8309)) ([thdk](https://github.com/thdk))
* Fix `<AutocompleteInput>` should only add an empty option when there is an `emptyText` ([#8305](https://github.com/marmelab/react-admin/pull/8305)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AutocompleteInput>` does not repopulate suggestions on blur in when used inside `<ReferenceInput>` ([#8303](https://github.com/marmelab/react-admin/pull/8303)) ([slax57](https://github.com/slax57))
* Fix `<AutocompleteInput validate={required()}>` displays empty choice ([#8296](https://github.com/marmelab/react-admin/pull/8296)) ([slax57](https://github.com/slax57))
* Fix `<RadioButtonGroupInput options>` prop was ignored ([#8299](https://github.com/marmelab/react-admin/pull/8299)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteArrayInput>` shows `undefined` on blur ([#8331](https://github.com/marmelab/react-admin/pull/8331)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<CheckboxGroupInput labelPlacement>` prop throws a DOM error ([#8294](https://github.com/marmelab/react-admin/pull/8294)) ([WiXSL](https://github.com/WiXSL))
* Fix `<CheckboxGroupInput options>` prop is ignored ([#8291](https://github.com/marmelab/react-admin/pull/8291)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FilterList>` custom label raises a missing translation key warning ([#8325](https://github.com/marmelab/react-admin/pull/8325)) ([slax57](https://github.com/slax57))
* Fix `<ListButton>` doesn't show "Remove all filters" item when using `alwaysOn` filters ([#8324](https://github.com/marmelab/react-admin/pull/8324)) ([WiXSL](https://github.com/WiXSL))
* Fix `<List>` page display on dataProvider error ([#8319](https://github.com/marmelab/react-admin/pull/8319)) ([WiXSL](https://github.com/WiXSL))
* Fix `<RichTextInput>` doesn't update when record field updates ([#8314](https://github.com/marmelab/react-admin/pull/8314)) ([WiXSL](https://github.com/WiXSL))
* Fix `localStorageStore` deletes non-react-admin items on version change ([#8315](https://github.com/marmelab/react-admin/pull/8315)) ([fzan](https://github.com/fzan))
* Bump `terser` from 5.10.0 to 5.15.1 ([#8323](https://github.com/marmelab/react-admin/pull/8323)) ([dependabot](https://github.com/dependabot))
* Bump `ansi-regex` from 4.1.0 to 4.1.1 ([#8321](https://github.com/marmelab/react-admin/pull/8321)) ([dependabot](https://github.com/dependabot))
* [Doc] Add `<ContainerLayout>` and `<HorizontalMenu>` documentation ([#8342](https://github.com/marmelab/react-admin/pull/8342)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add Discord server reference in the issue template ([#8298](https://github.com/marmelab/react-admin/pull/8298)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add tutorial about changing the form validation mode ([#8307](https://github.com/marmelab/react-admin/pull/8307)) ([slax57](https://github.com/slax57))
* [Doc] Add example API calls to `ra-data-simplerest` ([#8301](https://github.com/marmelab/react-admin/pull/8301)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix JsDoc snippets to access `record` from context instead of props ([#8337](https://github.com/marmelab/react-admin/pull/8337)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix examples to access `record` and `id` from context instead of props ([#8335](https://github.com/marmelab/react-admin/pull/8335)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Theming typos ([#8334](https://github.com/marmelab/react-admin/pull/8334)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Vite tutorial default style ([#8333](https://github.com/marmelab/react-admin/pull/8333)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix anchors and typos ([#8330](https://github.com/marmelab/react-admin/pull/8330)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Tutorial to better explain component composition ([#8327](https://github.com/marmelab/react-admin/pull/8327)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<AutocompleteArrayInput>` doc ([#8322](https://github.com/marmelab/react-admin/pull/8322)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Input docs ([#8316](https://github.com/marmelab/react-admin/pull/8316)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Store snippet about versionning ([#8313](https://github.com/marmelab/react-admin/pull/8313)) ([fzan](https://github.com/fzan))
* [Doc] Fix navigation panel version in 404 page ([#8311](https://github.com/marmelab/react-admin/pull/8311)) ([slax57](https://github.com/slax57))
* [Doc] Fix typo in `useListContext` and `useChoicesContext` hooks ([#8310](https://github.com/marmelab/react-admin/pull/8310)) ([cinaaaa](https://github.com/cinaaaa))
* [Doc] Fix typo in Create chapter mentioning the `<TextInput multiline>` prop ([#8290](https://github.com/marmelab/react-admin/pull/8290)) ([thdk](https://github.com/thdk))
* [Doc] Fix Forms documentation to clarify incompatibility of `<SaveButton type='button'>` with custom Form's `onSubmit` ([#8286](https://github.com/marmelab/react-admin/pull/8286)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Move e-commerce demo from `webpack` to `vite` ([#8317](https://github.com/marmelab/react-admin/pull/8317)) ([fzaninotto](https://github.com/fzaninotto))

## v4.4.4

* Fix `<ArrayInput>` throws an error when providing a helperText ([#8276](https://github.com/marmelab/react-admin/pull/8276)) ([slax57](https://github.com/slax57))
* Fix `<ArrayInput>` makes edited form always dirty on input blur ([#8275](https://github.com/marmelab/react-admin/pull/8275)) ([WiXSL](https://github.com/WiXSL))
* Fix label position config in `<CheckboxGroupInput>` ([#8260](https://github.com/marmelab/react-admin/pull/8260)) ([zhujinxuan](https://github.com/zhujinxuan))
* Fix `warnWhenUnsavedChange` crashes the app when using `react-router` >= 6.4 ([#8272](https://github.com/marmelab/react-admin/pull/8272)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useGetRecordId` missing export ([#8283](https://github.com/marmelab/react-admin/pull/8283)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix missing upgrade information about `<Field>` in `<SimpleForm>` ([#8280](https://github.com/marmelab/react-admin/pull/8280)) ([clement-escolano](https://github.com/clement-escolano))
* [Doc] Add `<CreateInDialogButton>`, `<EditInDialogButton>` and `<ShowInDialogButton>` to docs ([#8271](https://github.com/marmelab/react-admin/pull/8271)) ([slax57](https://github.com/slax57))
* [Doc] Fix links to `<EditInDialogButton>` and `<CreateInDialogButton>` ([#8284](https://github.com/marmelab/react-admin/pull/8284)) ([fzaninotto](https://github.com/fzaninotto))
* Bump prismjs from 1.25.0 to 1.27.0 ([#8268](https://github.com/marmelab/react-admin/pull/8268)) ([dependabot](https://github.com/dependabot))
* Bump node-forge from 1.2.1 to 1.3.1 ([#8267](https://github.com/marmelab/react-admin/pull/8267)) ([dependabot](https://github.com/dependabot))
* Bump async from 2.6.3 to 2.6.4 ([#8266](https://github.com/marmelab/react-admin/pull/8266)) ([dependabot](https://github.com/dependabot))

## v4.4.3

* Fix `<Loading>` component doesn't translate messages ([#8269](https://github.com/marmelab/react-admin/8269)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typos in Input chapter ([#8270](https://github.com/marmelab/react-admin/8270)) ([WiXSL](https://github.com/WiXSL))

## v4.4.2

* Fix `null` value support in inputs ([#8262](https://github.com/marmelab/react-admin/pull/8262)) ([slax57](https://github.com/slax57))
* Fix `<AutocompleteInput>` doesn't allow clearing the inputs in certain scenarios ([#8238](https://github.com/marmelab/react-admin/pull/8238)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Loading>` displays translation messages even though it should not ([#8261](https://github.com/marmelab/react-admin/pull/8261)) ([alioguzhan](https://github.com/alioguzhan))
* Fix `<Loading>` message contains trailing dot ([#8257](https://github.com/marmelab/react-admin/pull/8257)) ([alioguzhan](https://github.com/alioguzhan))
* Fix internal code workflow for tighter permissions ([#8253](https://github.com/marmelab/react-admin/pull/8253)) ([slax57](https://github.com/slax57))
* [Doc] Add ra-keycloak authProvider ([#8263](https://github.com/marmelab/react-admin/pull/8263)) ([slax57](https://github.com/slax57))
* [Doc] Fix missing `filterToQuery` prop in `<AutocompleteInput>` and `<AutocompleteArrayInput>` components ([#8251](https://github.com/marmelab/react-admin/pull/8251)) ([WiXSL](https://github.com/WiXSL))

## v4.4.1

* Fix `format` and `parse` on `<AutocompleteInput>` and `<SelectInput>` ([#8237](https://github.com/marmelab/react-admin/pull/8237)) ([byymster](https://github.com/byymster))
* Fix `<SelectInput>` and `<AutocompleteInput>` change empty references ([#8234](https://github.com/marmelab/react-admin/pull/8234)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SelectInput emptyValue>` accepts null value ([#8235](https://github.com/marmelab/react-admin/pull/8235)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<RadioButtonGroupInput>` inside `<ReferenceInput>` when reference ids are numbers ([#8229](https://github.com/marmelab/react-admin/pull/8229)) ([slax57](https://github.com/slax57))
* Fix `useEditController` returns wrong `redirectTo` value ([#8243](https://github.com/marmelab/react-admin/pull/8243)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Datagrid>`'s ExpandAllButton conflicts with expandSingle prop ([#8221](https://github.com/marmelab/react-admin/pull/8221)) ([WiXSL](https://github.com/WiXSL))
* Fix development dependencies causing security alerts ([#8230](https://github.com/marmelab/react-admin/pull/8230)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ReferenceInput>` story contains a non-story ([#8228](https://github.com/marmelab/react-admin/pull/8228)) ([WiXSL](https://github.com/WiXSL))
* Fix missing test for `<SimpleFormIterator>` ([#8215](https://github.com/marmelab/react-admin/pull/8215)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix `useCreateController` parameter type for onError effect ([#8242](https://github.com/marmelab/react-admin/pull/8242)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix unused TranslationMessage ([#8223](https://github.com/marmelab/react-admin/pull/8223)) ([bicstone](https://github.com/bicstone))
* [Doc] Fix `<RichTextInput>` example ([#8245](https://github.com/marmelab/react-admin/pull/8245)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<RichTextInput>` toolbar customization example ([#8239](https://github.com/marmelab/react-admin/pull/8239)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<List perPage>` doc misses mention of `<Pagination rowsPerPages>` relationship ([#8244](https://github.com/marmelab/react-admin/pull/8244)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix Upgrade guide typo ([#8240](https://github.com/marmelab/react-admin/pull/8240)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix CHANGELOG ([#8219](https://github.com/marmelab/react-admin/pull/8219)) ([WiXSL](https://github.com/WiXSL))

## v4.4.0

* Add `<Configurable>` components, make `<SimpleList>` accept template strings ([#8145](https://github.com/marmelab/react-admin/pull/8145)) ([fzaninotto](https://github.com/fzaninotto))
* Add `useInfiniteGetList` hook ([#8063](https://github.com/marmelab/react-admin/pull/8063)) ([arimet](https://github.com/arimet))
* Add `sanitizeEmptyValues` prop to Form components to replace empty values by null ([#8188](https://github.com/marmelab/react-admin/pull/8188)) ([fzaninotto](https://github.com/fzaninotto))
* Add `emptyText` and `emptyValue` support in `<AutocompleteInput>` ([#8162](https://github.com/marmelab/react-admin/pull/8162)) ([WiXSL](https://github.com/WiXSL))
* Add cache to `usePermissions` ([#8196](https://github.com/marmelab/react-admin/pull/8196)) ([hiaselhans](https://github.com/hiaselhans))
* Add ability to create independent store configurations for different lists of same resource ([#8073](https://github.com/marmelab/react-admin/pull/8073)) ([septentrion-730n](https://github.com/septentrion-730n))
* Add `emptyText` translation on Field components ([#8132](https://github.com/marmelab/react-admin/pull/8132)) ([oguhpereira](https://github.com/oguhpereira))
* Add `ra-data-localforage` data provider ([#7959](https://github.com/marmelab/react-admin/pull/7959)) ([arimet](https://github.com/arimet))
* Add `queryOptions` support in `<ReferenceInput>` ([#8192](https://github.com/marmelab/react-admin/pull/8192)) ([WiXSL](https://github.com/WiXSL))
* Add better UI to `<SimpleFormIterator>` ([#8124](https://github.com/marmelab/react-admin/pull/8124)) ([fzaninotto](https://github.com/fzaninotto))
* Add expand/collapse all toggle to `<Datagrid>` header ([#8152](https://github.com/marmelab/react-admin/pull/8152)) ([hiaselhans](https://github.com/hiaselhans))
* Add submit event as second argument of `<Form>` submit handler ([#8199](https://github.com/marmelab/react-admin/pull/8199)) ([djhi](https://github.com/djhi))
* Add ability to have custom `dataProvider` method that don't return a `data` object ([#8159](https://github.com/marmelab/react-admin/pull/8159)) ([oguhpereira](https://github.com/oguhpereira))
* Add ability to set custom routes as `<Resource>` children ([#8079](https://github.com/marmelab/react-admin/pull/8079)) ([hiaselhans](https://github.com/hiaselhans))
* Add support for `getLocales` in Polyglot i18nProvider ([#8143](https://github.com/marmelab/react-admin/pull/8143)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for filter callbacks in `useList` ([#8116](https://github.com/marmelab/react-admin/pull/8116)) ([oguhpereira](https://github.com/oguhpereira))
* Add ability to hide saved queries in `<FilterButton>` ([#8113](https://github.com/marmelab/react-admin/pull/8113)) ([oguhpereira](https://github.com/oguhpereira))
* Add `useGetRecordId` hook to make react-admin components more versatile ([#8103](https://github.com/marmelab/react-admin/pull/8103)) ([arimet](https://github.com/arimet))
* Fix null values cause warning in forms ([#8212](https://github.com/marmelab/react-admin/pull/8212)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SimpleFormIterator>` defaultValues when adding a record ([#8204](https://github.com/marmelab/react-admin/pull/8204)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceField>` generates a link even though there is nothing to link to ([#8202](https://github.com/marmelab/react-admin/pull/8202)) ([thibault-barrat](https://github.com/thibault-barrat))
* Fix `<FormTab>` not turning red after `<ArrayInput>` global validation error ([#8198](https://github.com/marmelab/react-admin/pull/8198)) ([thibault-barrat](https://github.com/thibault-barrat))
* Fix warning in Field components ([#8158](https://github.com/marmelab/react-admin/pull/8158)) ([fzaninotto](https://github.com/fzaninotto))
* Update Cypress to 10.9.0 ([#8211](https://github.com/marmelab/react-admin/pull/8211)) ([arimet](https://github.com/arimet))
* [TypeScript] Fix `<Layout>` misses sx prop ([#8209](https://github.com/marmelab/react-admin/pull/8209)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `useDelete` id type doesn't use generic type ([#8208](https://github.com/marmelab/react-admin/pull/8208)) ([zhujinxuan](https://github.com/zhujinxuan))
* [Doc] Fix outdated tip related to unsupported feature in Server Side validation ([#8205](https://github.com/marmelab/react-admin/pull/8205)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix broken links in Show documentation ([#8203](https://github.com/marmelab/react-admin/pull/8203)) ([LabisAnargyrou](https://github.com/LabisAnargyrou))
* [Doc] Add `useGetRecordId` section ([#8107](https://github.com/marmelab/react-admin/pull/8107)) ([arimet](https://github.com/arimet))

## v4.3.4

* Fix `<SimpleForm>` does not sanitize react-hook-form props ([#8186](https://github.com/marmelab/react-admin/pull/8186)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceInput>` fetching error makes `<AutocompleteInput>` unusable ([#8183](https://github.com/marmelab/react-admin/pull/8183)) ([fzaninotto](https://github.com/fzaninotto))
* Fix cannot let anonymous users access dashboard ([#8180](https://github.com/marmelab/react-admin/pull/8180)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid>` error when `queryOptions` contains `enable: false` ([#7987](https://github.com/marmelab/react-admin/pull/7987)) ([yanchesky](https://github.com/yanchesky))
* [Doc] Fix `<FormDataConsumer>` usage example ([#8189](https://github.com/marmelab/react-admin/pull/8189)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add community page ([#8187](https://github.com/marmelab/react-admin/pull/8187)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix "Linking two inputs" code snippet ([#8184](https://github.com/marmelab/react-admin/pull/8184)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Custom Filter Form example ([#8177](https://github.com/marmelab/react-admin/pull/8177)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `linkType` prop doc for `<SimpleList>` and `<SingleFieldList>` ([#8171](https://github.com/marmelab/react-admin/pull/8171)) ([riexn](https://github.com/riexn))

## v4.3.3

* Fix `<Confirm>` doesn't pass props to the underlying Material UI `<Dialog>` component ([#8176](https://github.com/marmelab/react-admin/pull/8176)) ([WiXSL](https://github.com/WiXSL))
* Fix performance issue in `useGetList` and `useGetManyReferences` ([#8174](https://github.com/marmelab/react-admin/pull/8174)) ([djhi](https://github.com/djhi))
* Fix `localStorageStore.reset()` does not remove all items ([#8161](https://github.com/marmelab/react-admin/pull/8161)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix upgrade doc mentions wrong syntax for `<Admin layout>` prop ([#8169](https://github.com/marmelab/react-admin/pull/8169)) ([herndlm](https://github.com/herndlm))
* [doc] Fix custom layout examples miss props forwarding ([#8170](https://github.com/marmelab/react-admin/pull/8170)) ([herndlm](https://github.com/herndlm))
* [Doc] Fix Input chapter example about sanitizing empty values ([#8167](https://github.com/marmelab/react-admin/pull/8167)) ([Cimanel](https://github.com/Cimanel))
* [Doc] Fix missing import in Routing chapter ([#8164](https://github.com/marmelab/react-admin/pull/8164)) ([herndlm](https://github.com/herndlm))
* [Doc] Fix `useDelete` usage in JSDoc ([#8160](https://github.com/marmelab/react-admin/pull/8160)) ([slax57](https://github.com/slax57))

## v4.3.2

* Fix `useFormState` sometimes returns outdated state ([#8138](https://github.com/marmelab/react-admin/pull/8138)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ArrayInput>` not showing validation error message ([#8154](https://github.com/marmelab/react-admin/pull/8154)) ([WiXSL](https://github.com/WiXSL))
* Fix `<FileInput>` and `<ImageInput>` not showing validation error message ([#8150](https://github.com/marmelab/react-admin/pull/8150)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AppBar className>` prop is ignored ([#8148](https://github.com/marmelab/react-admin/pull/8148)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceManyField>` row selection is shared for a given resources ([#8149](https://github.com/marmelab/react-admin/pull/8149)) ([WiXSL](https://github.com/WiXSL))
* Fix `useNotify()` triggers useless rerenders ([#8136](https://github.com/marmelab/react-admin/pull/8136)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` does not allow zero as value ([#8144](https://github.com/marmelab/react-admin/pull/8144)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add documentation for the `<SavedQueriesList>` component ([#8157](https://github.com/marmelab/react-admin/pull/8157)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix tutorial about sanitizing empty values ([#8156](https://github.com/marmelab/react-admin/pull/8156)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Theming doc mentions old syntax of `<Menu.Item>` ([#8137](https://github.com/marmelab/react-admin/pull/8137)) ([fzaninotto](https://github.com/fzaninotto))

## v4.3.1

* Fix `<SelectInput>` reorders choices by id ([#8135](https://github.com/marmelab/react-admin/pull/8135)) ([fzaninotto](https://github.com/fzaninotto))
* Fix global validation not firing after submit with `<ArrayInput>` ([#8118](https://github.com/marmelab/react-admin/pull/8118)) ([slax57](https://github.com/slax57))
* Fix `useGetManyAggregate` throws "filter is not a function" when getting 401 ([#8131](https://github.com/marmelab/react-admin/pull/8131)) ([matthieuMay](https://github.com/matthieuMay))
* Fix `<AutocompleteInput clearOnBlur>` has no effect ([#8123](https://github.com/marmelab/react-admin/pull/8123)) ([WiXSL](https://github.com/WiXSL))
* Fix dataProvider hooks do not handle `pageInfo` when updating `getList` query cache ([#8105](https://github.com/marmelab/react-admin/pull/8105)) ([slax57](https://github.com/slax57))
* Fix guesser for of `<ReferenceField>` and `<ReferenceArrayField>` do not use `recordRepresentation` ([#8104](https://github.com/marmelab/react-admin/pull/8104)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useGetList`'s onSuccess side effect overriding internal one ([#8102](https://github.com/marmelab/react-admin/pull/8102)) ([slax57](https://github.com/slax57))
* [Doc] Fix ambiguity about `<ReferenceInput>` label prop ([#8128](https://github.com/marmelab/react-admin/pull/8128)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc]: Fix `ra-rbac` links ([#8127](https://github.com/marmelab/react-admin/pull/8127)) ([slax57](https://github.com/slax57))
* [Doc] Fix code error in usage example of `ra-data-localstorage` README ([#8122](https://github.com/marmelab/react-admin/pull/8122)) ([rnllv](https://github.com/rnllv))
* [Doc] Fix outdated link to `ra-data-postgrest` data provider ([#8111](https://github.com/marmelab/react-admin/pull/8111)) ([scheiblr](https://github.com/scheiblr))
* [Doc] Fix `<ReferenceArrayField>` doc to use a child-less syntax first ([#8117](https://github.com/marmelab/react-admin/pull/8117)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix package name for `<JsonSchemaForm>` ([#8106](https://github.com/marmelab/react-admin/pull/8106)) ([arimet](https://github.com/arimet))
* [Doc] Fix typo in `<ReferenceField emptyText>` documentation ([#8112](https://github.com/marmelab/react-admin/pull/8112)) ([LabisAnargyrou](https://github.com/LabisAnargyrou))
* [Doc] Fix `<TabbedForm>` chapter to explain how to force scrollable variant ([#8109](https://github.com/marmelab/react-admin/pull/8109)) ([arimet](https://github.com/arimet))

## v4.3.0

* Add default Record representation ([#8011](https://github.com/marmelab/react-admin/pull/8011)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to remove empty option in `<SelectInput>` for required fields ([#8039](https://github.com/marmelab/react-admin/pull/8039)) ([fzaninotto](https://github.com/fzaninotto))
* Add a "Clear all filters" button ([#8017](https://github.com/marmelab/react-admin/pull/8017)) ([septentrion-730n](https://github.com/septentrion-730n))
* Add support for `<SimpleFormIterator>` `inline` and `sx` props ([#8067](https://github.com/marmelab/react-admin/pull/8067)) ([fzaninotto](https://github.com/fzaninotto))
* Add support for custom login redirection ([#7999](https://github.com/marmelab/react-admin/pull/7999)) ([fzaninotto](https://github.com/fzaninotto))
* Add abiliy to have two react-admin apps under the same domain ([#8031](https://github.com/marmelab/react-admin/pull/8031)) ([septentrion-730n](https://github.com/septentrion-730n))
* Add `<TimeInput>` ([#7917](https://github.com/marmelab/react-admin/pull/7917)) ([arnaudvergnet](https://github.com/arnaudvergnet))
* Add ability to make `<Authenticated />` pessimistic and require authentication ([#7993](https://github.com/marmelab/react-admin/pull/7993)) ([smeng9](https://github.com/smeng9))
* Fix sourcemaps are missing from build ([#8095](https://github.com/marmelab/react-admin/pull/8095)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ArrayInput>` validation does not prevent submission ([#8080](https://github.com/marmelab/react-admin/pull/8080)) ([arimet](https://github.com/arimet))
* Fix `<AutocompleteInput>` suggestions flicker when used inside `<ReferenceInput>` ([#8037](https://github.com/marmelab/react-admin/pull/8037)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix some strict null checks in `ra-core` ([#7952](https://github.com/marmelab/react-admin/pull/7952)) ([fzaninotto](https://github.com/fzaninotto))

## v4.2.8

* Fix `<ArrayInput>` doesn't support scalar values ([#8090](https://github.com/marmelab/react-admin/pull/8090)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<CoreAdmin store>` prop is ignored ([#8088](https://github.com/marmelab/react-admin/pull/8088)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Notification multiLine>` prop is ignored ([#8078](https://github.com/marmelab/react-admin/pull/8078)) ([arimet](https://github.com/arimet))
* Fix `<ImageInput>` includes useless class names ([#8066](https://github.com/marmelab/react-admin/pull/8066)) ([thibault-barrat](https://github.com/thibault-barrat))
* [TypeScript] Add `resettable` prop to `SelectInputProps` ([#8071](https://github.com/marmelab/react-admin/pull/8071)) ([thibault-barrat](https://github.com/thibault-barrat))
* [Doc] Fix upgrade guide still mentioning `<TextInput transform>` pop ([#8089](https://github.com/marmelab/react-admin/pull/8089)) ([Cimanel](https://github.com/Cimanel))
* [Doc] Fix typos in `<ReferenceArrayField>` doc ([#8087](https://github.com/marmelab/react-admin/pull/8087)) ([zackha](https://github.com/zackha))
* [Doc] Fix typos in migration to v4 guide ([#8084](https://github.com/marmelab/react-admin/pull/8084)) ([Cimanel](https://github.com/Cimanel))
* [Doc] Add WooCommerce in available DataProvider list ([#8081](https://github.com/marmelab/react-admin/pull/8081)) ([zackha](https://github.com/zackha))
* [Doc] Add Express & Mongoose in available DataProvider list ([#8076](https://github.com/marmelab/react-admin/pull/8076)) ([NathanAdhitya](https://github.com/NathanAdhitya))
* [Doc] Fix installation instructions in tutorial project ([#8074](https://github.com/marmelab/react-admin/pull/8074)) ([zackha](https://github.com/zackha))
* [Doc] Fix missing `label` prop in `<ReferenceInput>` and `<ReferenceArrayInput>` docs ([#8068](https://github.com/marmelab/react-admin/pull/8068)) ([thibault-barrat](https://github.com/thibault-barrat))

## v4.2.7

* Fix `<FormDataConsumer>` inside `<SimpleFormIterator>` adds empty value ([#8061](https://github.com/marmelab/react-admin/pull/8061)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useStore` internal state reset when key changes ([#8058](https://github.com/marmelab/react-admin/pull/8058)) ([slax57](https://github.com/slax57))
* Fix notification for validation errors doesn't show on `<Edit>` pages ([#8055](https://github.com/marmelab/react-admin/pull/8055)) ([arimet](https://github.com/arimet))
* Fix `<Form>` does not display notification after the first invalid submit ([#8057](https://github.com/marmelab/react-admin/pull/8057)) ([arimet](https://github.com/arimet))
* Fix `<FileInput>` and `<ImageInput>` clone their child ([#8052](https://github.com/marmelab/react-admin/pull/8052)) ([thibault-barrat](https://github.com/thibault-barrat))
* [Doc] Document how to sanitize form values ([#8048](https://github.com/marmelab/react-admin/pull/8048)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Improve `<ImageField>`, `<NumberField>` and `<SelectField>` docs ([#8045](https://github.com/marmelab/react-admin/pull/8045)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add Vite integration doc ([#8054](https://github.com/marmelab/react-admin/pull/8054)) ([thibault-barrat](https://github.com/thibault-barrat))
* [Doc] Add `useGetTree` doc ([#8065](https://github.com/marmelab/react-admin/pull/8065)) ([thibault-barrat](https://github.com/thibault-barrat))
* [Doc] Add `<JsonSchemaForm>` doc ([#8056](https://github.com/marmelab/react-admin/pull/8056)) ([thibault-barrat](https://github.com/thibault-barrat))

## v4.2.6

* Fix `<DeleteButton mutationOptions>` ignores `meta` parameter ([#8023](https://github.com/marmelab/react-admin/pull/8023)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<NumberInput>` state only changes on blur ([#8033](https://github.com/marmelab/react-admin/pull/8033)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ArrayInput>` adds previously removed item ([#8029](https://github.com/marmelab/react-admin/pull/8029)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `<MenuItemLink>` prop type isn't exported ([#8040](https://github.com/marmelab/react-admin/pull/8040)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add Search component ([#8021](https://github.com/marmelab/react-admin/pull/8021)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typos in Search documentation ([#8024](https://github.com/marmelab/react-admin/pull/8024)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Demo] Fix Pending reviews link on Dashboard ([#8036](https://github.com/marmelab/react-admin/pull/8036)) ([arimet](https://github.com/arimet))
* [Demo] Fix Category List does not use RecordContext ([#8035](https://github.com/marmelab/react-admin/pull/8035)) ([arimet](https://github.com/arimet))

## v4.2.5

- Fix Input label proptypes and `<DatagridInput>` imports ([#8019](https://github.com/marmelab/react-admin/pull/8019)) by ([megantaylor](https://github.com/megantaylor))
- Fix `<DashboardMenuItem>` Types ([#8007](https://github.com/marmelab/react-admin/pull/8007)) by ([djhi](https://github.com/djhi))
- Fix `<Admin dashboard>` causes a console warning due to missing key in the `<Menu>` ([#8005](https://github.com/marmelab/react-admin/pull/8005)) by ([DerYeger](https://github.com/DerYeger))
- Fix `<AutocompleteInput>` generates warning for identical label ([#8002](https://github.com/marmelab/react-admin/pull/8002)) by ([septentrion-730n](https://github.com/septentrion-730n))
- Fix usage warning trigger in `<CheckboxGroupInput>` ([#8001](https://github.com/marmelab/react-admin/pull/8001)) by ([septentrion-730n](https://github.com/septentrion-730n))
- Fix `<FilterForm>` overflow on mobile ([#7940](https://github.com/marmelab/react-admin/pull/7940)) by ([septentrion-730n](https://github.com/septentrion-730n))
- [Typescript] Fix `<ListContextProvider>` types ([#8020](https://github.com/marmelab/react-admin/pull/8020)) by ([septentrion-730n](https://github.com/septentrion-730n))
- [Doc] Fix typo in `ra-data-graphql-simple` docs ([#8012](https://github.com/marmelab/react-admin/pull/8012)) by ([mattleff](https://github.com/mattleff))
- [Doc] Fix `react-query` links in documentation ([#8010](https://github.com/marmelab/react-admin/pull/8010)) by ([septentrion-730n](https://github.com/septentrion-730n))
- [Doc] Fix `useQuery` example snippet ([#8009](https://github.com/marmelab/react-admin/pull/8009)) by ([fzaninotto](https://github.com/fzaninotto))
- [Doc] Fix Custom `<ReferenceInput>` label must be carried by the child component ([#8004](https://github.com/marmelab/react-admin/pull/8004)) by ([ApolloRisky](https://github.com/ApolloRisky))
- [Doc] Add `<Breadcrumb>` documentation ([#8000](https://github.com/marmelab/react-admin/pull/8000)) by ([fzaninotto](https://github.com/fzaninotto))

## v4.2.4

- Fix `<SelectInput>` loading UI to avoid visual jump ([#7998](https://github.com/marmelab/react-admin/pull/7998)) by ([fzaninotto](https://github.com/fzaninotto))
- Fix `<SelectInput>` resettable background color glitch ([#7997](https://github.com/marmelab/react-admin/pull/7997)) by ([fzaninotto](https://github.com/fzaninotto))
- Fix console error when using `<ReferenceArrayInput>` in list filter ([#7995](https://github.com/marmelab/react-admin/pull/7995)) by ([septentrion-730n](https://github.com/septentrion-730n))
- Fix `<NumberInput>` field state `isTouched` is always false ([#7992](https://github.com/marmelab/react-admin/pull/7992)) by ([fzaninotto](https://github.com/fzaninotto))
- Fix error after being logged out and logging in again ([#7991](https://github.com/marmelab/react-admin/pull/7991)) by ([fzaninotto](https://github.com/fzaninotto))
- Fix `useTheme` returns undefined as value ([#7960](https://github.com/marmelab/react-admin/pull/7960)) by ([septentrion-730n](https://github.com/septentrion-730n))
- Fix leading character in `<AutocompleteInput>` can not be deleted ([#7954](https://github.com/marmelab/react-admin/pull/7954)) by ([septentrion-730n](https://github.com/septentrion-730n))
- [Doc] Fix typo in `<RichTextInput>` documentation ([#7990](https://github.com/marmelab/react-admin/pull/7990)) by ([uzegonemad](https://github.com/uzegonemad))
- [Doc]: Fix `<WithPermissions />` and `<IfCanAccess />` doc ([#7994](https://github.com/marmelab/react-admin/pull/7994)) by ([smeng9](https://github.com/smeng9))
- [Doc] Add entry for `<MultiLevelMenu>` ([#7983](https://github.com/marmelab/react-admin/pull/7983)) by ([fzaninotto](https://github.com/fzaninotto))

## v4.2.3

- Fix: Can't un-toggle filter through secondary action button in aside list ([#7982](https://github.com/marmelab/react-admin/pull/7982)) ([septentrion-730n](https://github.com/septentrion-730n))
- Fix: `useChoicesContext` props should take precedence over context ([#7967](https://github.com/marmelab/react-admin/pull/7967)) ([djhi](https://github.com/djhi))
- Fix: individually import lodash modules to reduce bundle size ([#7962](https://github.com/marmelab/react-admin/pull/7962)) ([Jkker](https://github.com/Jkker))
- Fix: `<Pagination>` cannot be used outside a `ListContext` ([#7956](https://github.com/marmelab/react-admin/pull/7956)) ([fzaninotto](https://github.com/fzaninotto))
- Fix: security alerts on development packages ([#7953](https://github.com/marmelab/react-admin/pull/7953)) ([fzaninotto](https://github.com/fzaninotto))
- [TypeScript] Fix <Admin> used with function child and fragment does not compile ([#7981](https://github.com/marmelab/react-admin/pull/7981)) ([fzaninotto](https://github.com/fzaninotto))
- [doc] Fix UserMenu customization documentation ([#7979](https://github.com/marmelab/react-admin/pull/7979)) ([ApolloRisky](https://github.com/ApolloRisky))
- [chore] Update lerna ([#7951](https://github.com/marmelab/react-admin/pull/7951)) ([fzaninotto](https://github.com/fzaninotto))

## v4.2.2

* Fix `<AppBar>` jiggles when scrolling down rapidly ([#7947](https://github.com/marmelab/react-admin/pull/7947)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<BulkDeleteWithConfirmButton>` does not work when `mutationMode` is `undoable` ([#7948](https://github.com/marmelab/react-admin/pull/7948)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<EditBase>` and `useEditController` unsupported `record` prop ([#7950](https://github.com/marmelab/react-admin/pull/7950)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<AutocompleteInput>` `choices` description ([#7949](https://github.com/marmelab/react-admin/pull/7949)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Upgrade guide mentions incorrect import in "Removed connected-react-router" section ([#7945](https://github.com/marmelab/react-admin/pull/7945)) ([Matra-Master](https://github.com/Matra-Master))
* [Doc] Missing import in custom routes documentation  ([#7941](https://github.com/marmelab/react-admin/pull/7941)) ([septentrion-730n](https://github.com/septentrion-730n))

## 4.2.1

- Fix warnings in `<Menu>` ([#7931](https://github.com/marmelab/react-admin/pull/7931)) ([djhi](https://github.com/djhi))
- Fix Stick menu to top when `<AppBar>` is collapsed ([#7930](https://github.com/marmelab/react-admin/pull/7930)) ([septentrion-730n](https://github.com/septentrion-730n))
- Fix `ra-data-simple-rest` `create` does not return server data ([#7925](https://github.com/marmelab/react-admin/pull/7925)) ([dylanlt](https://github.com/dylanlt))
- Fix `<AutocompleteInput>` should show options after selection ([#7909](https://github.com/marmelab/react-admin/pull/7909)) ([djhi](https://github.com/djhi))
- Fix `<AutocompleteInput>` create text is undefined when using a function as `optionText` ([#7908](https://github.com/marmelab/react-admin/pull/7908)) ([septentrion-730n](https://github.com/septentrion-730n))
- Fix `<ArrayInput>` does not apply the margin prop ([#7905](https://github.com/marmelab/react-admin/pull/7905)) ([djhi](https://github.com/djhi))
- Fix `<ReferenceArrayInput>` does not fetch defaultValues applied on its child ([#7904](https://github.com/marmelab/react-admin/pull/7904)) ([djhi](https://github.com/djhi))
- Fix test files are in JS instead of TSX ([#7893](https://github.com/marmelab/react-admin/pull/7893)) ([fzaninotto](https://github.com/fzaninotto))
- Fix `<ReferenceArrayField>` throw error when its value is not an array ([#7899](https://github.com/marmelab/react-admin/pull/7899)) ([shreyas-jadhav](https://github.com/shreyas-jadhav))
- Fix `ra-data-graphql-simple` response parser for embedded arrays and objects ([#7895](https://github.com/marmelab/react-admin/pull/7895)) ([djhi](https://github.com/djhi))
- Fix `<TabbedForm>` ignores custom `resource` prop ([#7891](https://github.com/marmelab/react-admin/pull/7891)) ([fzaninotto](https://github.com/fzaninotto))
- [TypeScript] Fix missing null checks in form helpers ([#7894](https://github.com/marmelab/react-admin/pull/7894)) ([fzaninotto](https://github.com/fzaninotto))
- [Doc] Fix `useAuthProvider` documentation ([#7927](https://github.com/marmelab/react-admin/pull/7927)) ([sunil-sharma-999](https://github.com/sunil-sharma-999))
- [Doc] Assign variable before export default in examples ([#7926](https://github.com/marmelab/react-admin/pull/7926)) ([sunil-sharma-999](https://github.com/sunil-sharma-999))
- [Doc] Add installation instructions for CRA, Next.js and Remix ([#7921](https://github.com/marmelab/react-admin/pull/7921)) ([fzaninotto](https://github.com/fzaninotto))
- [Doc] Add documentation for the `<Menu>` component ([#7907](https://github.com/marmelab/react-admin/pull/7907)) ([fzaninotto](https://github.com/fzaninotto))
- [Doc] Fix examples using wrong key for setting the theme mode ([#7906](https://github.com/marmelab/react-admin/pull/7906)) ([pibouu](https://github.com/pibouu))
- [Doc] Correct `<MenuItemLink>` active state configuration ([#7901](https://github.com/marmelab/react-admin/pull/7901)) ([septentrion-730n](https://github.com/septentrion-730n))
- [Doc] Add documentation for the `<Layout>` component ([#7900](https://github.com/marmelab/react-admin/pull/7900)) ([fzaninotto](https://github.com/fzaninotto))
- [Doc] Add Next.js integration tutorial ([#7879](https://github.com/marmelab/react-admin/pull/7879)) ([fzaninotto](https://github.com/fzaninotto))

## 4.2.0

* Add ability to set `meta` in page components ([#7841](https://github.com/marmelab/react-admin/pull/7841)) ([fzaninotto](https://gihub.com/fzaninotto))
* Add ability to accept more than one child in `<Reference>` Fields ([#7812](https://github.com/marmelab/react-admin/pull/7812)) ([fzaninotto](https://gihub.com/fzaninotto))
* Add support for `<ReferenceField emptyText>` when the reference is missing ([#7851](https://github.com/marmelab/react-admin/pull/7851)) ([fzaninotto](https://gihub.com/fzaninotto))
* Add ability to specify available locales on the `i18nProvider` ([#7758](https://github.com/marmelab/react-admin/pull/7758)) ([djhi](https://gihub.com/djhi))
* Add support for custom toolbar buttons in `<RichTextInput>` ([#7816](https://github.com/marmelab/react-admin/pull/7816)) ([bladx](https://gihub.com/bladx))
* Add responsiveness to the `<RichTextInput>` toolbar ([#7863](https://github.com/marmelab/react-admin/pull/7863)) ([bladx](https://gihub.com/bladx))

## v4.1.6

* Fix `useListParams` might navigate to an old pathname ([#7882](https://github.com/marmelab/react-admin/pull/7882)) ([djhi](https://github.com/djhi))
* Fix `<AutocompleteInput>` paginates passed choices ([#7889](https://github.com/marmelab/react-admin/pull/7889)) ([djhi](https://github.com/djhi))
* Fix `<Form>` throws error when passed a `defaultValues` function ([#7888](https://github.com/marmelab/react-admin/pull/7888)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FileInput>` propTypes for `label` prop ([#7869](https://github.com/marmelab/react-admin/pull/7869)) ([slax57](https://github.com/slax57))
* Fix `<SaveButton>` loading state ([#7860](https://github.com/marmelab/react-admin/pull/7860)) ([septentrion-730n](https://github.com/septentrion-730n))
* [TypeScript] Fix `FilterLiveSearchProps` should extend `TextInputProps` ([#7859](https://github.com/marmelab/react-admin/pull/7859)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Fix link to outdated third party color input / field ([#7886](https://github.com/marmelab/react-admin/pull/7886)) ([alexgschwend](https://github.com/alexgschwend))
* [Doc] Fix documentation summary design ([#7876](https://github.com/marmelab/react-admin/pull/7876)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Fix `<NumberInput>` example ([#7875](https://github.com/marmelab/react-admin/pull/7875)) ([afilp](https://github.com/afilp))
* [Doc] Fix syntax error in code examples ([#7870](https://github.com/marmelab/react-admin/pull/7870)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix link to `ra-data-postgrest` for v4 ([#7867](https://github.com/marmelab/react-admin/pull/7867)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Document `<LongForm>` component ([#7862](https://github.com/marmelab/react-admin/pull/7862)) ([fzaninotto](https://github.com/fzaninotto))

## v4.1.5

* Fix `css-mediaquery` Dependency ([#7849](https://github.com/marmelab/react-admin/pull/7849)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Sidebar>` does not forward theme substyles to its children ([#7854](https://github.com/marmelab/react-admin/pull/7854)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `useFormState` returns null with yarn pnp ([#7850](https://github.com/marmelab/react-admin/pull/7850)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<AutocompleteInput>` storybook does not select newly created option ([#7847](https://github.com/marmelab/react-admin/pull/7847)) ([slax57](https://github.com/slax57))
* [Doc] Fix Inputs doc is too concise ([#7856](https://github.com/marmelab/react-admin/pull/7856)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<TextField>` doc mentions `label` field as required ([#7848](https://github.com/marmelab/react-admin/pull/7848)) ([fzaninotto](https://github.com/fzaninotto))

## v4.1.4

* Fix example simple codesandbox ([#7846](https://github.com/marmelab/react-admin/pull/7846)) ([slax57](https://github.com/slax57))
* Fix `<Logout />` appears even when not logged in ([#7842](https://github.com/marmelab/react-admin/pull/7842)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<Show disableAuthentication>` prop is ignored ([#7837](https://github.com/marmelab/react-admin/pull/7837)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<ImageField>` style is ignored for single images ([#7836](https://github.com/marmelab/react-admin/pull/7836)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<FileInput>` and  `<ImageInput>` style don't use Material UI theme ([#7835](https://github.com/marmelab/react-admin/pull/7835)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<NumberInput>` seems buggy when used in a Filter Form ([#7830](https://github.com/marmelab/react-admin/pull/7830)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<Datagrid expand>` expands ALL rows when used as a child of `<ArrayField>` ([#7828](https://github.com/marmelab/react-admin/pull/7828)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<ReferenceInput>` generated label in Filter Form ([#7825](https://github.com/marmelab/react-admin/pull/7825)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `useDataProvider` returns `undefined` value when unauthorized 401 error is thrown ([#7820](https://github.com/marmelab/react-admin/pull/7820)) ([slax57](https://github.com/slax57))
* Fix sourcemaps support with TypeScript ([#7818](https://github.com/marmelab/react-admin/pull/7818)) ([djhi](https://github.com/djhi))
* [Doc] Fix `<AutocompleteInput>` creation props and examples ([#7844](https://github.com/marmelab/react-admin/pull/7844)) ([slax57](https://github.com/slax57))
* [Doc] Fix tutorial about creating new choices ([#7833](https://github.com/marmelab/react-admin/pull/7833)) ([davidhenley](https://github.com/davidhenley))
* [Doc] Remove link to third-party TipTap input component ([#7819](https://github.com/marmelab/react-admin/pull/7819)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ReferenceOneField>` doc is missing ([#7813](https://github.com/marmelab/react-admin/pull/7813)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Update location of `ra-data-treeql` ([#7808](https://github.com/marmelab/react-admin/pull/7808)) ([nkappler](https://github.com/nkappler))

## v4.1.3

* Fix `<BooleanInput>` and `<CheckboxInput>` don't have focus states (re-add ripple) ([#7772](https://github.com/marmelab/react-admin/pull/7772)) ([andrico1234](https://github.com/andrico1234))
* Fix edit and show controllers do not handle falsy identifiers ([#7790](https://github.com/marmelab/react-admin/pull/7790)) ([djhi](https://github.com/djhi))
* Fix sourcemaps in packages build ([#7803](https://github.com/marmelab/react-admin/pull/7803)) ([djhi](https://github.com/djhi))
* Fix user cannot to load saved queries when `alwaysOn` filters are empty ([#7786](https://github.com/marmelab/react-admin/pull/7786)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useUpdate` passes old record to onSuccess in optimistic mode ([#7783](https://github.com/marmelab/react-admin/pull/7783)) ([djhi](https://github.com/djhi))
* Fix `<Menu>` storybook is missing ([#7776](https://github.com/marmelab/react-admin/pull/7776)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Fix custom menu items example ([#7804](https://github.com/marmelab/react-admin/pull/7804)) ([davidhenley](https://github.com/davidhenley))
* [Doc] Fix typo in Theming code snippet ([#7802](https://github.com/marmelab/react-admin/pull/7802)) ([AntonOfTheWoods](https://github.com/AntonOfTheWoods))
* [Doc] Fix Theming doc uses outdated syntax for conditional formatting example ([#7799](https://github.com/marmelab/react-admin/pull/7799)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Enterprise Edition modules syntax following 4.0 release ([#7795](https://github.com/marmelab/react-admin/pull/7795)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<DualListInput>` menu item misses the premium badge ([#7789](https://github.com/marmelab/react-admin/pull/7789)) ([davidhenley](https://github.com/davidhenley))
* [Doc] Restructure Translation Documentation ([#7759](https://github.com/marmelab/react-admin/pull/7759)) ([djhi](https://github.com/djhi))

## v4.1.2

* Fix `DatagridContext` and `useDatagridContext` aren't exported ([#7779](https://github.com/marmelab/react-admin/pull/7779)) ([djhi](https://github.com/djhi))
* Fix `<ArrayInput>` doesn't allow null as value ([#7768](https://github.com/marmelab/react-admin/pull/7768)) ([septentrion-730n](https://github.com/septentrion-730n))
* Fix `<AutocompleteArrayInput>` accepts true as `disableClearable` value ([#7766](https://github.com/marmelab/react-admin/pull/7766)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Typescript] Fix `<FunctionField>` generic typing restriction ([#7770](https://github.com/marmelab/react-admin/pull/7770)) ([septentrion-730n](https://github.com/septentrion-730n))
* [TypeScript] Fix `<FilterLiveSearch>` missing `fullWidth` prop and harmonize `label` prop type between `CommonInputProps` and `LabeledProps` ([#7757](https://github.com/marmelab/react-admin/pull/7757)) ([septentrion-730n](https://github.com/septentrion-730n))
* [Doc] Fix quick filters screencast doesn't show saved filters ([#7778](https://github.com/marmelab/react-admin/pull/7778)) ([septentrion-730n](https://github.com/septentrion-730n))

## v4.1.1

* Fix `<DateTimeInput validate={required()} />` doesn't work correctly ([#7744](https://github.com/marmelab/react-admin/pull/7744)) ([djhi](https://github.com/djhi))
* Fix `validate` function errors messages are not display when passed as translatable object ([#7741](https://github.com/marmelab/react-admin/pull/7741)) ([djhi](https://github.com/djhi))
* Fix `useUpdateMany` does not support the `returnPromise` option ([#7740](https://github.com/marmelab/react-admin/pull/7740)) ([djhi](https://github.com/djhi))
* Fix cannot remove `<SimpleForm>` and `<TabbedForm>` toolbar with `toolbar={false}` ([#7738](https://github.com/marmelab/react-admin/pull/7738)) ([djhi](https://github.com/djhi))
* Fix `<Admin>` calls its child function without permissions while loading them ([#7737](https://github.com/marmelab/react-admin/pull/7737)) ([djhi](https://github.com/djhi))
* Fix `useConfigureAdminRouterFromChildren` when child function return null ([#7731](https://github.com/marmelab/react-admin/pull/7731)) ([djhi](https://github.com/djhi))
* Fix `<TabbedForm>` ignores the `sx` prop ([#7721](https://github.com/marmelab/react-admin/pull/7721)) ([slax57](https://github.com/slax57))
* Fix `<Loading>` ignores the `sx` prop ([#7723](https://github.com/marmelab/react-admin/pull/7723)) ([slax57](https://github.com/slax57))
* Fix `<Form>` submit cannot be prevented with `event.preventDefault` ([#7715](https://github.com/marmelab/react-admin/pull/7715)) ([slax57](https://github.com/slax57))
* Fix `<AutocompleteInput>` tests regression ([#7714](https://github.com/marmelab/react-admin/pull/7714)) ([slax57](https://github.com/slax57))
* [Doc] Fix typo in `useSaveContext` code snippet ([#7747](https://github.com/marmelab/react-admin/pull/7747)) ([wgiddens](https://github.com/wgiddens))
* [Doc] Fix `<SelectArrayInput>` doc mentions non-existent prop resettable ([#7743](https://github.com/marmelab/react-admin/pull/7743)) ([djhi](https://github.com/djhi))
* [Doc] Fix `<SaveButton>` is documented in two different chapters ([#7742](https://github.com/marmelab/react-admin/pull/7742)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo in custom form layout example ([#7734](https://github.com/marmelab/react-admin/pull/7734)) ([ApolloRisky](https://github.com/ApolloRisky))
* [Doc] Fix `useGetOne` section about query aggregation ([#7732](https://github.com/marmelab/react-admin/pull/7732)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix global theme overrides example ([#7727](https://github.com/marmelab/react-admin/pull/7727)) ([mediafreakch](https://github.commediafreakch))
* [Doc] Fix Form Validation section mentions ability to do both async validation per input and global validation ([#7726](https://github.com/marmelab/react-admin/pull/7726)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<BooleanInput>` example for overriding check icon ([#7720](https://github.com/marmelab/react-admin/pull/7720)) ([mediafreakch](https://github.commediafreakch))
* [Doc] Fix tutorial example cannot be run in CodeSandbox ([#7713](https://github.com/marmelab/react-admin/pull/7713)) ([slax57](https://github.com/slax57))
* [TypeScript] Fix `<Button>` component props accepts a record ([#7764](https://github.com/marmelab/react-admin/pull/7764)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `<Button>` component props ([#7750](https://github.com/marmelab/react-admin/pull/7750)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `<SingleFieldList>` rejects the `sx` prop ([#7735](https://github.com/marmelab/react-admin/pull/7735)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix missing `useMutation` error typing definitions ([#7722](https://github.com/marmelab/react-admin/pull/7722)) ([soullivaneuh](https://github.comsoullivaneuh))
* [TypeScript] Fix cannot specify the error type in mutation hooks ([#7698](https://github.com/marmelab/react-admin/pull/7698)) ([soullivaneuh](https://github.comsoullivaneuh))

## v4.1.0

* Add `LabelPrefix` context to better guess correct input labels ([#7710](https://github.com/marmelab/react-admin/pull/7710)) ([fzaninotto](https://github.com/fzaninotto))
* Add middlewares support to create and edit controllers ([#7701](https://github.com/marmelab/react-admin/pull/7701)) ([djhi](https://github.com/djhi))
* Add imports to guesser output ([#7699](https://github.com/marmelab/react-admin/pull/7699)) ([fzaninotto](https://github.com/fzaninotto))
* Add ability to change icon for `<DashboardMenuItem>` ([#7577](https://github.com/marmelab/react-admin/pull/7577)) ([kristelvdakker](https://github.com/kristelvdakker))

## v4.0.5

* Fix `<ReferenceField>` sometimes gets stuck on loading state ([#7708](https://github.com/marmelab/react-admin/pull/7708)) ([djhi](https://github.com/djhi))
* Fix `<ReferenceInput>` sometimes gets stuck on loading state ([#7707](https://github.com/marmelab/react-admin/pull/7707)) ([djhi](https://github.com/djhi))
* Fix `<ReferenceArrayInput>` with `<AutocompleteArrayInput>` throws error if the array is empty ([#7694](https://github.com/marmelab/react-admin/pull/7694)) ([slax57](https://github.com/slax57))
* Fix `<FormTab>` doesn't highlight selected tab label ([#7693](https://github.com/marmelab/react-admin/pull/7693)) ([slax57](https://github.com/slax57))
* Fix `<Filter>` shows filter button even though there is no filter to add ([#7691](https://github.com/marmelab/react-admin/pull/7691)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<TextInput>` changes 'on' into 'false' ([#7682](https://github.com/marmelab/react-admin/pull/7682)) ([Andonyaa](https://github.com/Andonyaa))
* [Doc] Fix "Save And Add Another" example in forms section ([#7709](https://github.com/marmelab/react-admin/pull/7709)) ([slax57](https://github.com/slax57))
* [Doc] Fix missing doc for `<Admin queryClient>` prop ([#7704](https://github.com/marmelab/react-admin/pull/7704)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix Validation chapter misses section explaining that global and input level validation can not be combined ([#7703](https://github.com/marmelab/react-admin/pull/7703)) ([slax57](https://github.com/slax57))

## v4.0.4

* Fix cannot use theme to override input `variant` ([#7636](https://github.com/marmelab/react-admin/pull/7636)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<NumberInput>` edge cases ([#7673](https://github.com/marmelab/react-admin/pull/7673)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ShowBase>`, `<CreateBase>` and `<EditBase>` components don't support `resource` override via props ([#7652](https://github.com/marmelab/react-admin/pull/7652)) ([slax57](https://github.com/slax57))
* Fix inconsistent casing for translation keys of `ra-input-rich-text` ([#7683](https://github.com/marmelab/react-admin/pull/7683)) ([friday](https://github.com/friday))
* Fix warning when using some valid `<Button color>` values ([#7681](https://github.com/marmelab/react-admin/pull/7681)) ([smeng9](https://github.com/smeng9))
* [TypeScript] Fix `<Button>` component prop type ([#7664](https://github.com/marmelab/react-admin/pull/7664)) ([okovpashko](https://github.com/okovpashko))
* [Doc] Fix "Prefilling the Form" example in Create chapter ([#7684](https://github.com/marmelab/react-admin/pull/7684)) ([slax57](https://github.com/slax57))
* [Doc] Fix `<RichTextInputToolbar>` example in `ra-input-rich-text` chapter ([#7671](https://github.com/marmelab/react-admin/pull/7671)) ([friday](https://github.com/friday))
* [Doc] Fix `<SaveButton formId>` prop should be called `<SaveButton form>` ([#7658](https://github.com/marmelab/react-admin/pull/7658)) ([smeng9](https://github.com/smeng9))

## v4.0.3

* Fix `<SimpleFormIterator disableRemove>` doesn't receive the `record` argument ([#7645](https://github.com/marmelab/react-admin/pull/7645)) ([andrico1234](https://github.com/andrico1234))
* Fix cannot create an admin without resources ([#7609](https://github.com/marmelab/react-admin/pull/7609)) ([djhi](https://github.com/djhi))
* Fix cannot define ressource config based on Permissions ([#7606](https://github.com/marmelab/react-admin/pull/7606)) ([djhi](https://github.com/djhi))
* Fix `<Admin>` forbids login when `authProvider.setPermissions()` isn't implemented ([#7642](https://github.com/marmelab/react-admin/pull/7642)) ([djhi](https://github.com/djhi))
* Fix `<SimpleFormIterator>` children display wrong labels ([#7641](https://github.com/marmelab/react-admin/pull/7641)) ([djhi](https://github.com/djhi))
* Fix style overrides in `<SimpleFormIterator>` ([#7630](https://github.com/marmelab/react-admin/pull/7630)) ([andrico1234](https://github.com/andrico1234))
* Fix ability to disable redirect in `useCreateController` ([#7633](https://github.com/marmelab/react-admin/pull/7633)) ([waltheri](https://github.com/waltheri))
* Fix `<FileInput>` no longer passes `source` to `name` attribute ([#7619](https://github.com/marmelab/react-admin/pull/7619)) ([djhi](https://github.com/djhi))
* Fix `<FileInput>` doesn't accept `options` prop ([#7611](https://github.com/marmelab/react-admin/pull/7611)) ([fzaninotto](https://github.com/fzaninotto))
* Fix duplicate key error in `<SingleFieldList>` ([#7617](https://github.com/marmelab/react-admin/pull/7617)) ([djhi](https://github.com/djhi))
* Fix Form validation when `<SaveButton type>` is "button" ([#7557](https://github.com/marmelab/react-admin/pull/7557)) ([WiXSL](https://github.com/WiXSL))
* Fix `NullableBooleanInput` helper text doesn't take `isSubmitted` into account ([#7553](https://github.com/marmelab/react-admin/pull/7553)) ([afilp](https://github.com/afilp))
* [TypeScript] Fix `ra-data-graphql` options type ([#7638](https://github.com/marmelab/react-admin/pull/7638)) ([arjunyel](https://github.com/arjunyel))
* [TypeScript] Fix `<Button/>` props type mention unsupported `icon` prop ([#7627](https://github.com/marmelab/react-admin/pull/7627)) ([smeng9](https://github.com/smeng9))
* [Doc] Fix wrong import in List docs ([#7647](https://github.com/marmelab/react-admin/pull/7647)) ([davidhenley](https://github.com/davidhenley))
* [Doc] Fix Edit doc mentions unsupported prop ([#7628](https://github.com/marmelab/react-admin/pull/7628)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<ArrayField>` doc mentions unsupported `fieldKey` prop ([#7613](https://github.com/marmelab/react-admin/pull/7613)) ([smeng9](https://github.com/smeng9))
* [Doc] Fix instructions for using react-admin in a sub path ([#7612](https://github.com/marmelab/react-admin/pull/7612)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add Prisma REST to the list of third-party Data Providers ([#7568](https://github.com/marmelab/react-admin/pull/7568)) ([mshd](https://github.com/mshd))

## v4.0.2

* Publish GraphQL data provider packages ([#7607](https://github.com/marmelab/react-admin/pull/7607)) ([fzaninotto](https://github.com/fzaninotto))
* Fix missing  `<Admin queryClient>` prop ([#7558](https://github.com/marmelab/react-admin/pull/7558)) ([joshq00](https://github.com/joshq00))
* Fix `logout` doesn't reset resource registration ([#7539](https://github.com/marmelab/react-admin/pull/7539)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ListGuesser>` does not update when resource changes ([#7605](https://github.com/marmelab/react-admin/pull/7605)) ([djhi](https://github.com/djhi))
* Fix cannot set custom icon in `<BooleanInput>` ([#7556](https://github.com/marmelab/react-admin/pull/7556)) ([WiXSL](https://github.com/WiXSL))
* Fix cannot clear filter form when clicking the clerar button on Firefox ([#7574](https://github.com/marmelab/react-admin/pull/7574)) ([smeng9](https://github.com/smeng9))
* Fix `<RichTextInput>` buttons don't update correctly ([#7585](https://github.com/marmelab/react-admin/pull/7585)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix missing `<ArrayInput sx>` prop ([#7571](https://github.com/marmelab/react-admin/pull/7571)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix `<SelectInput choices>` type only allow Records ([#7595](https://github.com/marmelab/react-admin/pull/7595)) ([bingluen](https://github.com/bingluen))
* [TypeScript] Fix `<SelectInput>` / `<SelectArrayInput>` `onChange` handler ([#7519](https://github.com/marmelab/react-admin/pull/7519)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add an example GraphQL data provider ([#7602](https://github.com/marmelab/react-admin/pull/7602)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix missing `<SelectInput>` props ([#7566](https://github.com/marmelab/react-admin/pull/7566)) ([smeng9](https://github.com/smeng9))
* [Doc] Fix Upgrade instructions for List views ([#7563](https://github.com/marmelab/react-admin/pull/7563)) ([hjr3](https://github.com/hjr3))
* [Doc] Fix Upgrade instructions regarding router imports ([#7562](https://github.com/marmelab/react-admin/pull/7562)) ([hjr3](https://github.com/hjr3))

## v4.0.1

* Fix `<DateTimeInput>` doesn't work when used as filter ([#7551](https://github.com/marmelab/react-admin/pull/7551)) ([WiXSL](https://github.com/WiXSL))
* Fix `<BooleanInput>` helper text doesn't use `isSubmitted` ([#7552](https://github.com/marmelab/react-admin/pull/7552)) ([afilp](https://github.com/afilp))
* Fix `<SimpleForm>` should not accept `mutationMode` prop ([#7533](https://github.com/marmelab/react-admin/pull/7533)) ([WiXSL](https://github.com/WiXSL))
* Fix React warning when using a `<Datagrid>` on data without an `id` ([#7548](https://github.com/marmelab/react-admin/pull/7548)) ([WiXSL](https://github.com/WiXSL))
* Fix outdated `propTypes` on a few components ([#7535](https://github.com/marmelab/react-admin/pull/7535)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<Datagrid>` usage example shows bulk actions ([#7547](https://github.com/marmelab/react-admin/pull/7547)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<Datagrid>` body snippet is missing `<RecordContextProvider>` ([#7546](https://github.com/marmelab/react-admin/pull/7546)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix link to the `ra-rbac` module ([#7545](https://github.com/marmelab/react-admin/pull/7545)) ([artnest](https://github.com/artnest))
* [Doc] Fix typo in `useEditContext` section ([#7542](https://github.com/marmelab/react-admin/pull/7542)) ([usman-coe](https://github.com/usman-coe))
* [Doc] Fix typo in `<List>` component section ([#7536](https://github.com/marmelab/react-admin/pull/7536)) ([Eric013](https://github.com/Eric013))
* Fix yarn.lock and dependencies versions ([#7532](https://github.com/marmelab/react-admin/pull/7532)) ([WiXSL](https://github.com/WiXSL))

## v4.0.0

React-admin v4 focuses on modernizing the inner workings of the library. It improves the developper experience a great deal, and paves the way for future changes. It is the result of 6 months of intensive refactoring, development, and test.

The following list concerns version 4.0.0, as well as all the pre-releases (alpha, beta, and rc).

### 🎉 New features

- Add `<Admin requireAuth>` to hide the app until auth is checked (#7475)
- Add `<Admin basename>` to allow mounting react-admin inside a sub path (#7100, #6917)
- Add the ability to pass custom params to all `dataProvider` hooks (#7116)
- Add support for partial pagination (i.e. no `total`) (#7120)
- Add support for `sx` props in all `ra-ui-materialui` components (#7175)
- Add headless `<Form>` component (#7087)
- Add `<ReferenceOneField>` (#7060)
- Add `<CustomRoutes>` (#7345)
- Add `useStore` and persistent preferences (backport from `ra-enterprise`) (#7158, #7366)
- Add Saved Queries (#7354)
- Add `<ToggleThemeButton>` (#7340)
- Add `<LocalesMenuButton>` (#7332)
- Add `useSetTheme` (#7008)
- Add `combineDataProvider` helper (#7055)
- Add `<Datagrid expandSingle>` to limit the number of expanded rows to 1 (#7454)
- Add `<ChoicesContextProvider>` in all ReferenceInputs to avoid child cloning and allow choices filtering, pagination, and sorting (#7185)
- Add `<FileInput validateFileRemoval>` prop to allow confirmation before file deletion (#7003)
- Add ability to register custom `<Resource options>` (#7392)

### 📦 Dependency Updates

- Add React 18 compatibility (#7377)
- Upgrade `material-ui` to v5 (#6650)
- Use `react-query` for data fetching instead of home made solution (#6779, #6916, #7006, #7016, #7025, #6891, #7035, #7020, #7035, #7001)
- Replace `react-final-form` with `react-hook-form` (#7087)
- Upgrade `react-router` to [V6](https://reactrouter.com/docs/en/v6/api) (#6873)
- Replace `Quill` by `TipTap` in `<RichTextInput>` (#7153)
- Upgrade dependencies to their latest major versions

### 🏹 Updated Syntax

- Change the `Record` TypeScript name to `RaRecord` (#7078)
- Change data provider hooks signature to reflect the data provider signature
- Remove prop injection and child cloning, use context instead (#7060, #7218, #7215, #7214, #7207, #7206, #7205, #7203).
- Remove `record` prop injection
- Remove permissions injection in main route controllers (#6921)
- Avoid cloning Inputs components to pass `variant` and `margin`, and document theme override instead (#7223)
- Rename `loading` to `isLoading` in `authProvider` hooks return type (#7334)
- Rename `initialValues` to `defaultValues` in `<Form>` (caused by switch to `react-hook-form`)
- Move `bulkActionButtons` from `<List>` to `<Datagrid>` (#7114)
- Rename `currentSort` to `sort` (#7076)
- Change `setSort` signature to make it consistent across components (#7065)
- Use Material UI autocomplete instead of our own (#6924, #6971)
- Rename `<TranslationProvider>` to `<I18nContextProvider>`
- Switch `<WithPermissions>` wrapping to a `useAuthenticated` hook in main controllers (#6921)
- Move `<Notification>` component into `<AdminUI>` to avoid gotchas when overriding the layout (#7082)

### 🧹 Cleanup

- Remove `Redux` (#7177)
- Remove `redux-saga` and saga-based side effects (#6684)
- Remove `connected-react-router` (#6704)
- Remove `basePath` (#7100)
- Remove `addLabel` prop in Field components (#7223)
- Remove `Resource` initialization, Store Resource definitions in Context rather than in store (#7051)
- Remove HOCs (like `addField`) and render props
- Remove `useQuery` and `useMutation` (as `react-query` already provides them) (#7001)
- Remove application cache and `validUntil` (#7001)
- Remove `useVersion` (#7001)
- Remove `allowEmpty` prop in choice inputs (#7200)
- Remove deprecated `sort` prop in `<DataGridHeaderCell>` (#7065)
- Remove `<FormWithRedirect>` and `handleSubmitWithRedirect` (#7087)
- Remove `TestContext` (`<AdminContext>` does the trick) and `ra-test` (#7148)
- Remove declarative side effects support in dataProvider (#6687)
- Remove `useGetMatching` (use getList instead) (#6916)
- Remove support for `undoable` prop now that we have `mutationMode` (#6711)
- Remove `withTranslate` HOC (#7157)
- Remove `ra-test` (#7148)
- Use `esbuild` instead of `webpack` for simple example
- Use GitHub actions instead of Travis for CI

### 📚 Updated Documentation

- The [v4 documentation](https://marmelab.com/react-admin/doc/4.0/Readme.html) was deeply reorganized to allow easier discovery and faster navigation.
- Most of the common hooks and components now have a dedicated documentation page.
- We've added a Storybook to help you discover the components API.
- The demos ([e-commerce](https://github.com/marmelab/react-admin/tree/master/examples/demo), [CRM](https://github.com/marmelab/react-admin/tree/master/examples/crm)) were updated to show how to build application in idiomatic react-admin.

### 🪜 Upgrade Guide

As this is a major release, there are breaking changes. We documented all the changes required in a react-admin v3 application to make it compatible with version 4 in [the react-admin v4 Upgrade Guide](https://marmelab.com/react-admin/doc/4.0/Upgrade.html).

### 📊 Statistics

* 1,259 changed files
* [2,210 commits](https://github.com/marmelab/react-admin/compare/3.x...master)
* [100,420 additions and 90,560 deletions](https://github.com/marmelab/react-admin/compare/3.x..master) (code and documentation)

Since react-admin counts about 112,000 lines of code, this means that 90% of the codebase was touched. 

### 💌 Thank You

Many thanks to all the contributors (whether they helped developing, testing, documenting, proofreading react-admin v4), and in particular to the core team ([fzaninotto](https://github.com/fzaninotto), [djhi](https://github.com/djhi), [WiXSL](https://github.com/WiXSL)) for their hard work.

## v3.19.11

* Fix `history` dependency ([#7481](https://github.com/marmelab/react-admin/pull/7481)) ([WiXSL](https://github.com/WiXSL))
* Fix race condition due to debounced `setFilter` ([#7444](https://github.com/marmelab/react-admin/pull/7444)) ([slax57](https://github.com/slax57))
* Fix `useGetMany` loading/loaded state does not change when query updated ([#6913](https://github.com/marmelab/react-admin/pull/6913)) ([WiXSL](https://github.com/WiXSL))
* Fix `<BulkUpdateButton>` color ([#7303](https://github.com/marmelab/react-admin/pull/7303)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AutocompleteInput optionText>` returning an element throws error ([#7289](https://github.com/marmelab/react-admin/pull/7289)) ([WiXSL](https://github.com/WiXSL))
* Bump `url-parse` from 1.5.7 to 1.5.10  dependencies([#7313](https://github.com/marmelab/react-admin/pull/7313)) ([dependabot](https://github.com/dependabot))
* Bump `url-parse` from 1.5.3 to 1.5.7  dependencies([#7263](https://github.com/marmelab/react-admin/pull/7263)) ([dependabot](https://github.com/dependabot))
* [Doc] Add missing import in Unit Testing doc ([#7434](https://github.com/marmelab/react-admin/pull/7434)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* [Doc] Remove deprecated props and unused imports ([#7413](https://github.com/marmelab/react-admin/pull/7413)) ([takayukioda](https://github.com/takayukioda))
* [Doc] Fix `<Datagrid>` example ([#7375](https://github.com/marmelab/react-admin/pull/7375)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `ra-data-graphql` readme ([#7347](https://github.com/marmelab/react-admin/pull/7347)) ([dijonkitchen](https://github.com/dijonkitchen))
* [Doc] Add greek translation ([#7311](https://github.com/marmelab/react-admin/pull/7311)) ([panterz](https://github.com/panterz))
* [TypeScript] Fix missing `<Resource options>` label property ([#7422](https://github.com/marmelab/react-admin/pull/7422)) ([soullivaneuh](https://github.com/soullivaneuh))

## v3.19.10

* Fix `<CheckboxGroupInput>` changes selected values type ([#7248](https://github.com/marmelab/react-admin/pull/7248)) ([WiXSL](https://github.com/WiXSL))
* Fix `<DateField>` shows wrong date on negative time zones ([#7242](https://github.com/marmelab/react-admin/pull/7242)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<DateInput>` example of `format` and `parse` with `Date` object as value ([#7233](https://github.com/marmelab/react-admin/pull/7233)) ([WiXSL](https://github.com/WiXSL))
* Bump minor dependencies

## v3.19.9

(failed release, do not use)

## v3.19.8

* Fix `<FilterButton>` throws bad error if no filters are present ([#7227](https://github.com/marmelab/react-admin/pull/7227)) ([WiXSL](https://github.com/WiXSL))
* Fix `page` remains the same when changing `perPage` in `<ReferenceXXX>` Fields ([#7213](https://github.com/marmelab/react-admin/pull/7213)) ([WiXSL](https://github.com/WiXSL))
* Fix `useNotify` doesn't allow multi line notifications ([#7188](https://github.com/marmelab/react-admin/pull/7188)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AutocompleteInput>` erases input while typing ([#7173](https://github.com/marmelab/react-admin/pull/7173)) ([WiXSL](https://github.com/WiXSL))
* Fix `resolveBrowserLocale` tests ([#7194](https://github.com/marmelab/react-admin/pull/7194)) ([FernandoKGA](https://github.com/FernandoKGA))
* Fix `<Toolbar alwaysEnableSaveButton>` doesn't accept `false` ([#7167](https://github.com/marmelab/react-admin/pull/7167)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ReferenceArrayInput>` logs console warning in certain cases ([#7165](https://github.com/marmelab/react-admin/pull/7165)) ([WiXSL](https://github.com/WiXSL))
* Fix DOM warnings when using `<SelectArrayInput>` as child of `<ReferenceArrayInput>` ([#7015](https://github.com/marmelab/react-admin/pull/7015)) ([ZachSelindh](https://github.com/ZachSelindh))
* Fix failing admin test when running all tests together ([#7136](https://github.com/marmelab/react-admin/pull/7136)) ([thdk](https://github.com/thdk))
* Fix GraphQL data provider swallows the Apollo Error ([#6956](https://github.com/marmelab/react-admin/pull/6956)) ([hlubek](https://github.com/hlubek))
* [TypeScript] Fix `BooleanInputProps` isn't exported ([#7144](https://github.com/marmelab/react-admin/pull/7144)) ([alanpoulain](https://github.com/alanpoulain))
* [Doc] Fix bad url in Inputs documentation ([#7230](https://github.com/marmelab/react-admin/pull/7230)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add SQLite data provider ([#7201](https://github.com/marmelab/react-admin/pull/7201)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add TreeQL / PHP-CRUD-API data provider ([#7141](https://github.com/marmelab/react-admin/pull/7141)) ([itsjavi](https://github.com/itsjavi))
* [Doc] Fix `<XXXInput initialValue>` description when the value is `null` ([#7139](https://github.com/marmelab/react-admin/pull/7139)) ([WiXSL](https://github.com/WiXSL))

## v3.19.7

* Fix `<SimpleFormIterator>` assigns items indexes incorrectly ([#7123](https://github.com/marmelab/react-admin/pull/7123)) ([WiXSL](https://github.com/WiXSL))
* Fix error messages can't be copied ([#7115](https://github.com/marmelab/react-admin/pull/7115)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ArrayInput>` could make the form dirty on initialization ([#7112](https://github.com/marmelab/react-admin/pull/7112)) ([WiXSL](https://github.com/WiXSL))
* Fix race condition accessing redux store after logout ([#7105](https://github.com/marmelab/react-admin/pull/7105)) ([WiXSL](https://github.com/WiXSL))
* Fix dom warning when overriding `<AutocompleteInput>` styles ([#6486](https://github.com/marmelab/react-admin/pull/6486)) ([mohandes-jiri](https://github.com/mohandes-jiri))
* [Doc] customizing and disabling item reordering for `<ArrayInput>` ([#7104](https://github.com/marmelab/react-admin/pull/7104)) ([vaizki](https://github.com/vaizki))
* [Doc] Fix code snippet for choice creation in `<AutocompleteArrayInput>` and `<SelectArrayInput>` ([#7086](https://github.com/marmelab/react-admin/pull/7086)) ([kristelvdakker](https://github.com/kristelvdakker))
* [Doc] Fix dead link in Data Providers documentation ([#7063](https://github.com/marmelab/react-admin/pull/7063)) ([Fabious](https://github.com/Fabious))
* Bump dependencies for security warnings ([#7092](https://github.com/marmelab/react-admin/pull/7092)) ([#7128](https://github.com/marmelab/react-admin/pull/7128)) ([#7126](https://github.com/marmelab/react-admin/pull/7126)) ([#7090](https://github.com/marmelab/react-admin/pull/7090))

## v3.19.6

* Fix loading indicator keeps spinning on permissions error when `logoutUser` is false ([#7044](https://github.com/marmelab/react-admin/pull/7044)) ([WiXSL](https://github.com/WiXSL))
* Fix `redirect=false` after save doesn't clear the form ([#7041](https://github.com/marmelab/react-admin/pull/7041)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectArrayInput optionText>` function not fully supported with create item ([#7039](https://github.com/marmelab/react-admin/pull/7039)) ([WiXSL](https://github.com/WiXSL))
* Fix `<AutocompleteArrayInput optionText>` function not supported with create item set ([#7038](https://github.com/marmelab/react-admin/pull/7038)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectInput optionText>` for create ([#7031](https://github.com/marmelab/react-admin/pull/7031)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SelectArrayInput optionText>` for create ([#7030](https://github.com/marmelab/react-admin/pull/7030)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Fix typescript error ([#7045](https://github.com/marmelab/react-admin/pull/7045)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Update Create-React-App to V5 ([#7022](https://github.com/marmelab/react-admin/pull/7022)) ([fzaninotto](https://github.com/fzaninotto))

## v3.19.5

* Fix `<Autocomplete>` fails when used inside a `<FormDataConsumer>` ([#7013](https://github.com/marmelab/react-admin/pull/7013)) ([WiXSL](https://github.com/WiXSL))
* Fix `updateMany` throws an error for undefined ID in `ra-data-graphql-simple` ([#7002](https://github.com/marmelab/react-admin/pull/7002)) ([djhi](https://github.com/djhi))
* Fix warning for unrecognized `enableGetChoices` prop when using `<SelectInput>` as child of `<ReferenceInput>` ([#6999](https://github.com/marmelab/react-admin/pull/6999)) ([ZachSelindh](https://github.com/ZachSelindh))
* [Doc] Fix typos ([#7012](https://github.com/marmelab/react-admin/pull/7012)) ([WiXSL](https://github.com/WiXSL))

## v3.19.4

* Fix list `<FilterButton>` is not accessible ([#6967](https://github.com/marmelab/react-admin/pull/6967)) ([WiXSL](https://github.com/WiXSL))
* Fix incorrect `exporter` when switching resource ([#6989](https://github.com/marmelab/react-admin/pull/6989)) ([WiXSL](https://github.com/WiXSL))
* Fix `<ArrayField>` doesn't accept `<SimpleList>` as child ([#6975](https://github.com/marmelab/react-admin/pull/6975)) ([Luwangel](https://github.com/Luwangel))
* Fix unit tests require build first ([#6983](https://github.com/marmelab/react-admin/pull/6983)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix `<SimpleList toolbar>` doesn't allow `false` value ([#6969](https://github.com/marmelab/react-admin/pull/6969)) ([ZachSelindh](https://github.com/ZachSelindh))
* [TypeScript] Fix `ToolbarProps` to be compatible with `FormWithRedirectOwnProps` definition ([#6994](https://github.com/marmelab/react-admin/pull/6994)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix missing definition for `<ReferenceFieldController label>` prop ([#6745](https://github.com/marmelab/react-admin/pull/6745)) ([kevinmamaqi](https://github.com/kevinmamaqi))
* [TypeScript] Fix `<ArrayInput>` proptype definition ([#6617](https://github.com/marmelab/react-admin/pull/6617)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in `<Tab>` jsDoc ([#6959](https://github.com/marmelab/react-admin/pull/6959)) ([erakli](https://github.com/erakli))
* [Demo] Fix `<SelectInput label>` is overridden in simple project ([#6920](https://github.com/marmelab/react-admin/pull/6920)) ([WiXSL](https://github.com/WiXSL))

## v3.19.3

* Fix `<ArrayInput>` issue with `initialValue` ([#6932](https://github.com/marmelab/react-admin/pull/6932)) ([djhi](https://github.com/djhi))
* Fix `<Datagrid>` select all rows fails over multiple pages ([#6950](https://github.com/marmelab/react-admin/pull/6950)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Notification>` component appears only once when saving several times ([#6929](https://github.com/marmelab/react-admin/pull/6929)) ([wbojaume](https://github.com/wbojaume))
* Fix `useList` isn't usable with asynchronously fetched data ([#6899](https://github.com/marmelab/react-admin/pull/6899)) ([djhi](https://github.com/djhi))
* Fix `<FilterListItem>` styles can't be overridden via theme ([#6941](https://github.com/marmelab/react-admin/pull/6941)) ([kristelvdakker](https://github.com/kristelvdakker))
* Fix `<List bulkActionButtons>` prop does not handle the value true ([#6926](https://github.com/marmelab/react-admin/pull/6926)) ([WiXSL](https://github.com/WiXSL))
* Fix `<SidebarToggleButton>` is not exported ([#6911](https://github.com/marmelab/react-admin/pull/6911)) ([WiXSL](https://github.com/WiXSL))
* Fix `<Tab>` children are missing the `fullWidth` prop when `addLabel` is set ([#6915](https://github.com/marmelab/react-admin/pull/6915)) ([WiXSL](https://github.com/WiXSL))
* Fix `useReferenceArrayInputController` sets `loading` prop incorrectly ([#6914](https://github.com/marmelab/react-admin/pull/6914)) ([WiXSL](https://github.com/WiXSL))
* Fix e2e tests fail on a clean install ([#6938](https://github.com/marmelab/react-admin/pull/6938)) ([WiXSL](https://github.com/WiXSL))
* Fix wrong imports in tests ([#6931](https://github.com/marmelab/react-admin/pull/6931)) ([djhi](https://github.com/djhi))
* Fix warn about unsaved changes when modifying `<CheckGroupInput>` or `<ArrayInput>` components ([#6954](https://github.com/marmelab/react-admin/pull/6954)) ([WiXSL](https://github.com/WiXSL))
* [TypeScript] Fix types in tests ([#6949](https://github.com/marmelab/react-admin/pull/6949)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add Blitzjs data provider ([#6945](https://github.com/marmelab/react-admin/pull/6945)) ([Fidym](https://github.com/Fidym))
* [Doc] Fix `authProvider` example ([#6933](https://github.com/marmelab/react-admin/pull/6933)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix code examples of `<FormDataConsumer>` ([#6936](https://github.com/marmelab/react-admin/pull/6936)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix mention of deprecated `createMuiTheme` in theming docs ([#6918](https://github.com/marmelab/react-admin/pull/6918)) ([AntoineCrb](https://github.com/AntoineCrb))
* [Doc] Fix `useNotify` examples encourage a deprecated syntax ([#6912](https://github.com/marmelab/react-admin/pull/6912)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Fix no-code-demo does not work in CodeSandbox ([#6463](https://github.com/marmelab/react-admin/pull/6463)) ([smeng9](https://github.com/smeng9))
* [Demo] Update simple example dependencies ([#6930](https://github.com/marmelab/react-admin/pull/6930)) ([djhi](https://github.com/djhi))
* [Demo] Fix deprecation warnings in simple project ([#6903](https://github.com/marmelab/react-admin/pull/6903)) ([WiXSL](https://github.com/WiXSL))

## v3.19.2

* Fix `<SimpleForm>` warns of unsaved changes when the form is submitting ([#6895](https://github.com/marmelab/react-admin/pull/6895)) ([WiXSL](https://github.com/WiXSL))
* Fix `useMutation` not considering returnPromise option ([#6886](https://github.com/marmelab/react-admin/pull/6886)) ([WiXSL](https://github.com/WiXSL))
* Fix package duplication in `yarn.lock` slows down react-admin CI ([#6874](https://github.com/marmelab/react-admin/pull/6874)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix include side effects in `<DeleteButton>` props type ([#6877](https://github.com/marmelab/react-admin/pull/6877)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Fix `authProvider.getIdentity()` returns an object instead of a promise in simple demo ([#6881](https://github.com/marmelab/react-admin/pull/6881)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typo in README ([#6875](https://github.com/marmelab/react-admin/pull/6875)) ([CoreyB26](https://github.com/CoreyB26))
* [Doc] Fix various typos ([#6872](https://github.com/marmelab/react-admin/pull/6872)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix List actions examples ([#6742](https://github.com/marmelab/react-admin/pull/6742)) ([erakli](https://github.com/erakli))

## v3.19.1

* Fix sidebar is displayed over the content ([#6723](https://github.com/marmelab/react-admin/pull/6723)) ([djhi](https://github.com/djhi))
* Fix `warnWhenUnsavedChanges` warns too often ([#6719](https://github.com/marmelab/react-admin/pull/6719)) ([djhi](https://github.com/djhi))
* Fix `useNotify` shows a warning if only one argument is passed ([#6760](https://github.com/marmelab/react-admin/pull/6760)) ([WiXSL](https://github.com/WiXSL))
* Fix runtime error when type is not supplied to `useNotify` ([#6713](https://github.com/marmelab/react-admin/pull/6713)) ([danielhusar](https://github.com/danielhusar))
* Fix `notify` function when no type is passed ([#6768](https://github.com/marmelab/react-admin/pull/6768)) ([nidebo](https://github.com/nidebo))
* Fix `<SimpleFormIterator>` transition animations on add and remove items ([#6871](https://github.com/marmelab/react-admin/pull/6871)) ([WiXSL](https://github.com/WiXSL))
* Fix simple CodeSandbox ([#6781](https://github.com/marmelab/react-admin/pull/6781)) ([djhi](https://github.com/djhi))
* Fix `<DateInput>` breaks `<SimpleFormIterator>` ([#6763](https://github.com/marmelab/react-admin/pull/6763)) ([djhi](https://github.com/djhi))
* Fix `<Login>` page isn't customizable through Material UI theme ([#6762](https://github.com/marmelab/react-admin/pull/6762)) ([djhi](https://github.com/djhi))
* Fix call time parameters don't take priority in `useMutation` ([#6761](https://github.com/marmelab/react-admin/pull/6761)) ([djhi](https://github.com/djhi))
* Bump minor dependencies
* [TypeScript] Fix Graphql Providers Types ([#6724](https://github.com/marmelab/react-admin/pull/6724)) ([djhi](https://github.com/djhi))
* [TypeScript] Make `previousData` of `DeleteParams` optional ([#6536](https://github.com/marmelab/react-admin/pull/6536)) ([m0rtalis](https://github.com/m0rtalis))
* [Doc] Add GeoServer data provider ([#6778](https://github.com/marmelab/react-admin/pull/6778)) ([sergioedo](https://github.com/sergioedo))
* [Doc] Add paragraph about carbon footprint in README ([#6774](https://github.com/marmelab/react-admin/pull/6774)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add link to images in tutorial ([#6771](https://github.com/marmelab/react-admin/pull/6771)) ([ocxers](https://github.com/ocxers))
* [Doc] Fix typo in Architecture chapter ([#6740](https://github.com/marmelab/react-admin/pull/6740)) ([HobbitCodes](https://github.com/HobbitCodes))
* [Doc] Fix typo in Theming chapter ([#6714](https://github.com/marmelab/react-admin/pull/6714)) ([afilp](https://github.com/afilp))
* Fix Material UI's urls reference for version 4 ([#6702](https://github.com/marmelab/react-admin/pull/6702)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `getIdentity` function to the authProvider reference ([#6697](https://github.com/marmelab/react-admin/pull/6697)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Improve `useRedirect` description and examples ([#6696](https://github.com/marmelab/react-admin/pull/6696)) ([WiXSL](https://github.com/WiXSL))

## v3.19.0

### 🚀 New Features

- Allow lazy loading of choices in ReferenceInput ([#6013](https://github.com/marmelab/react-admin/pull/6013)) ([@ValentinH](https://github.com/ValentinH))
- Add support for custom url in SimpleList ([#6594](https://github.com/marmelab/react-admin/pull/6594)) ([djhi](https://github.com/djhi))
- Added support for customizing the styles of the Datagrid expand panels  ([#6596](https://github.com/marmelab/react-admin/pull/6596)) ([mjomble](https://github.com/mjomble))
- Blur input on suggestion create ([#6646](https://github.com/marmelab/react-admin/pull/6646)) ([andrico1234](https://github.com/andrico1234))
- Add support for multiline notifications ([#6670](https://github.com/marmelab/react-admin/pull/6670)) ([WiXSL](https://github.com/WiXSL))
- Introduce simpler signature for the `notify` function returned by `useNotify` ([#6671](https://github.com/marmelab/react-admin/pull/6671)) ([WiXSL](https://github.com/WiXSL))
- Returns `error` from controllers & add support for custom `onFailure` on `useShowController` and `useEditController` ([#6680](https://github.com/marmelab/react-admin/pull/6680)) ([djhi](https://github.com/djhi))
- Extract sidebar toggle button ([#6603](https://github.com/marmelab/react-admin/pull/6603)) ([djhi](https://github.com/djhi))
- [GraphQL] Upgrade graphql packages dependencies (Apollo v3) ([#6614](https://github.com/marmelab/react-admin/pull/6614)) ([djhi](https://github.com/djhi))

### 🐛 Bug Fixes

- Fix Material UI 4.12 deprecation warnings ([#6587](https://github.com/marmelab/react-admin/pull/6587)) ([fzaninotto](https://github.com/fzaninotto))
- Refactor ArrayInput and SimpleFormIterator with context ([#6612](https://github.com/marmelab/react-admin/pull/6612)) ([djhi](https://github.com/djhi))
- Refactor graphql providers and migrate to the new dataProvider signature ([#6628](https://github.com/marmelab/react-admin/pull/6628)) ([djhi](https://github.com/djhi))
- [GraphQL]: Fix Simple Response Parser Modify all Objects ([#6643](https://github.com/marmelab/react-admin/pull/6643)) ([djhi](https://github.com/djhi))
- [GraphQL]: add basic network error handling ([#6648](https://github.com/marmelab/react-admin/pull/6648)) ([djhi](https://github.com/djhi))
- Fix remove unused import ([#6676](https://github.com/marmelab/react-admin/pull/6676)) ([WiXSL](https://github.com/WiXSL))
- Fix react import ([#6677](https://github.com/marmelab/react-admin/pull/6677)) ([WiXSL](https://github.com/WiXSL))

### 🟦 Types

- Upgrade TypeScript version to 4.4 ([#6588](https://github.com/marmelab/react-admin/pull/6588)) ([fzaninotto](https://github.com/fzaninotto))
- Support custom DataProvider type with useDataProvider ([#6605](https://github.com/marmelab/react-admin/pull/6605)) ([djhi](https://github.com/djhi))
- Fix simple project type errors ([#6637](https://github.com/marmelab/react-admin/pull/6637)) ([WiXSL](https://github.com/WiXSL))
- Fix export TranslationMessages StringMap type ([#6638](https://github.com/marmelab/react-admin/pull/6638)) ([WiXSL](https://github.com/WiXSL))
- Add missing types for TranslationMessages ([#6640](https://github.com/marmelab/react-admin/pull/6640)) ([Aikain](https://github.com/Aikain))

### 📚 Docs

- Fix menus examples ([#6637](https://github.com/marmelab/react-admin/pull/6636)) ([WiXSL](https://github.com/WiXSL))
- Fixed typo in Auth doc ([#6649](https://github.com/marmelab/react-admin/pull/6649)) ([davidhenley](https://github.com/davidhenley))

## v3.18.3

- Fix custom menus do not shrink when sidebar is closed (#6635) ([djhi](https://github.com/djhi))
- Fix undoable bulk actions failure by refreshing the view (#6616) ([WiXSL](https://github.com/WiXSL))
- Fix datagrid usage inside reference array input (#6589) ([djhi](https://github.com/djhi))
- Fix tests console errors and warnings (#6578) ([WiXSL](https://github.com/WiXSL))
- [TypeScript] Fix DataProvider and RouteWithoutLayout some types (#6634) ([djhi](https://github.com/djhi))
- [TypeScript] Fix TranslatableInputs props interface (#6633) ([djhi](https://github.com/djhi))
- [Doc] Add DatagridHeader to reference section (#6631) ([WiXSL](https://github.com/WiXSL))
- [Doc] Fix typos in several examples (#6623) ([WiXSL](https://github.com/WiXSL))
- [Doc] Add SimpleForm component prop description and example (#6611) ([WiXSL](https://github.com/WiXSL))
- [Doc] Fix scrollable TabbedForm usage description (#6608) ([WiXSL](https://github.com/WiXSL))
- [Doc] Fixed naming of getMany ids params (#6604) ([davidhenley](https://github.com/davidhenley))
- [Doc] Updated README of ra-data-graphql-simple for function components (#6555) ([Panzki](https://github.com/Panzki))

## v3.18.2

* Fix `displayName` prop in Field components ([6569](https://github.com/marmelab/react-admin/pull/6569)) ([WiXSL](https://github.com/WiXSL))
* Fix `submitErrorsMutators` form mutator is not exported ([6586](https://github.com/marmelab/react-admin/pull/6586)) ([djhi](https://github.com/djhi))
* Fix `linkToRecord` syntax when pointing to the show page ([6575](https://github.com/marmelab/react-admin/pull/6575)) ([ValentinnDimitroff](https://github.com/ValentinnDimitroff))
* Fix `<UrlField>` font size differs from other fields ([6568](https://github.com/marmelab/react-admin/pull/6568)) ([WiXSL](https://github.com/WiXSL))
* Fix `<EmailField>` font size differs from other fields ([6567](https://github.com/marmelab/react-admin/pull/6567)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add mentions of supabase data & auth providers and Tip Tap rich text input ([6590](https://github.com/marmelab/react-admin/pull/6590)) ([djhi](https://github.com/djhi))
* [Doc] Fix examples of `ra-test` usage with fake dataProviders ([6600](https://github.com/marmelab/react-admin/pull/6600)) ([DjebbZ](https://github.com/DjebbZ))
* [TypeScript] Remove FunctionComponent usage from `RichTextInput` ([6577](https://github.com/marmelab/react-admin/pull/6577)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<AutocompleteArrayInput>` image link typo ([6574](https://github.com/marmelab/react-admin/pull/6574)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix outdated link to Django REST Framework dataProvider ([6571](https://github.com/marmelab/react-admin/pull/6571)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Rename and export Mutation props ([6576](https://github.com/marmelab/react-admin/pull/6576)) ([WiXSL](https://github.com/WiXSL))

## v3.18.1

* Fix `BooleanField` doesn't show label when used in a Show view ([6553](https://github.com/marmelab/react-admin/pull/6553)) ([WiXSL](https://github.com/WiXSL))
* Fix Field components don't show labels when used in a Show view ([6564](https://github.com/marmelab/react-admin/pull/6564)) ([WiXSL](https://github.com/WiXSL))
* Fix "Something went wrong" issue when using `<SelectArrayInput>` & `<SelectInput>` ([6558](https://github.com/marmelab/react-admin/pull/6558)) ([djhi](https://github.com/djhi))

## v3.18.0

### 🎨 UI Changes

* `<Sidebar>`: Make it fixed when users scroll vertically ([6534](https://github.com/marmelab/react-admin/pull/6534)) ([fzaninotto](https://github.com/fzaninotto))
* `<TranslatableInputs>`: Reduce language tabs margin to allow more languages to be used ([6484](https://github.com/marmelab/react-admin/pull/6484)) ([fzaninotto](https://github.com/fzaninotto))

### 🚀 New Features

* `<SimpleFormIterator>`: Add support for reordering items ([6433](https://github.com/marmelab/react-admin/pull/6433)) ([djhi](https://github.com/djhi))
* `<SimpleList>`: Add `RecordContext` to allow usage of Field components in `primaryText`, `secondaryText`, and `tertiaryText`  ([6552](https://github.com/marmelab/react-admin/pull/6552)) ([djhi](https://github.com/djhi))
* `<Datagrid>`: Add `header` prop to override the header row ([6496](https://github.com/marmelab/react-admin/pull/6496)) ([fzaninotto](https://github.com/fzaninotto))
* `useRedirect`: Add support for absolute URLs to facilitate third-party authentication providers (OAuth, OpenID Connect) ([6469](https://github.com/marmelab/react-admin/pull/6469)) ([fzaninotto](https://github.com/fzaninotto))

### 🐛 Bug Fixes

* Fix quick create suggestion label when using custom `optionText` ([6551](https://github.com/marmelab/react-admin/pull/6551)) ([djhi](https://github.com/djhi))
* Fix `devDependencies` of individual packages ([6540](https://github.com/marmelab/react-admin/pull/6540)) ([quentingarcia](https://github.com/quentingarcia))

### 🟦 Types

* Export many internal `ra-core` prop types for easier override ([6543](https://github.com/marmelab/react-admin/pull/6543)) ([WiXSL](https://github.com/WiXSL))
* Fix `dataProvider.delete` response type marks `data` as optional ([6548](https://github.com/marmelab/react-admin/pull/6548)) ([WiXSL](https://github.com/WiXSL))
* Remove `FC` usage from `<SimpleFormIterator>` and Docs ([6546](https://github.com/marmelab/react-admin/pull/6546)) ([WiXSL](https://github.com/WiXSL))
* Remove `FC` usage from `<AdminContext>` ([6545](https://github.com/marmelab/react-admin/pull/6545)) ([WiXSL](https://github.com/WiXSL))
* Remove `FC` usage from `<Field>` components ([6538](https://github.com/marmelab/react-admin/pull/6538)) ([WiXSL](https://github.com/WiXSL))
* Remove `FC` usage from examples ([6519](https://github.com/marmelab/react-admin/pull/6519)) ([WiXSL](https://github.com/WiXSL))
* Remove `FC` usage from `ra-core` components ([6515](https://github.com/marmelab/react-admin/pull/6515)) ([WiXSL](https://github.com/WiXSL))

### 📚 Docs

* Fix Changelog URLs ([6537](https://github.com/marmelab/react-admin/pull/6537)) ([WiXSL](https://github.com/WiXSL))

### ✨ Demos

* Fix implicit `any` type prevents TypeScript compilation of e-commerce demo ([6556](https://github.com/marmelab/react-admin/pull/6556)) ([fzaninotto](https://github.com/fzaninotto))
* Fix simple demo on IE11 ([6544](https://github.com/marmelab/react-admin/pull/6544)) ([djhi](https://github.com/djhi))
* Fix demo on IE11 ([6542](https://github.com/marmelab/react-admin/pull/6542)) ([djhi](https://github.com/djhi))

## v3.17.3

* Fix `<BooleanInput initialValue>` overrides existing value from record ([6533](https://github.com/marmelab/react-admin/pull/6533)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<ArrayField>` forbids empty component in child `<Datagrid>` ([6524](https://github.com/marmelab/react-admin/pull/6524)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `useList` pagination total ([6500](https://github.com/marmelab/react-admin/pull/6500)) ([yksflip](https://github.com/yksflip))
* [Doc] Add link to auth tutorials for Auth0, AzureAD, and Loopback ([6535](https://github.com/marmelab/react-admin/pull/6535)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo in readme file ([6527](https://github.com/marmelab/react-admin/pull/6527)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `emptyText` prop description in Fields documentation ([6525](https://github.com/marmelab/react-admin/pull/6525)) ([fzaninotto](https://github.com/fzaninotto))
* [RFR] Remove FC usage from ra-ui-materialui components ([6514](https://github.com/marmelab/react-admin/pull/6514)) ([WiXSL](https://github.com/WiXSL))

## v3.17.2

* Fix filter set via URL isn't persistent if set on the list page ([6504](https://github.com/marmelab/react-admin/pull/6504)) ([fzaninotto](https://github.com/fzaninotto))
* Fix `<SearchInput variant="outlined">` has hole in the outline ([6492](https://github.com/marmelab/react-admin/pull/6492)) ([fzaninotto](https://github.com/fzaninotto))
* [TypeScript] Fix `Error` prop types ([6508](https://github.com/marmelab/react-admin/pull/6508)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix typo in Authentication chapter ([6499](https://github.com/marmelab/react-admin/pull/6499)) ([msohail07](https://github.com/msohail07))
* [Doc] Fix Syntax Error in `linkToRecord` code snippet ([6498](https://github.com/marmelab/react-admin/pull/6498)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Update Input images ([6493](https://github.com/marmelab/react-admin/pull/6493)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix `<Labeled>` example ([6489](https://github.com/marmelab/react-admin/pull/6489)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add `useList` hook to reference section ([6488](https://github.com/marmelab/react-admin/pull/6488)) ([WiXSL](https://github.com/WiXSL))

## v3.17.1

* Fix propType warning in `<BulkExportButton>` ([6479](https://github.com/marmelab/react-admin/pull/6479)) ([fzaninotto](https://github.com/fzaninotto))
* Fix propType warning in delete buttons ([6472](https://github.com/marmelab/react-admin/pull/6472)) ([djhi](https://github.com/djhi))
* Fix `props.options.labelWidth` not being applied in `<SelectArrayInput>` ([6465](https://github.com/marmelab/react-admin/pull/6465)) ([WiXSL](https://github.com/WiXSL))
* Fix ignored `inputRef` in `<AutocompleteInput>` & `<AutocompleteArrayInput>` ([6458](https://github.com/marmelab/react-admin/pull/6458)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix type of `<SelectInput classes>` prop ([6456](https://github.com/marmelab/react-admin/pull/6456)) ([djhi](https://github.com/djhi))
* [TypeScript] Fix missing translation message types ([6426](https://github.com/marmelab/react-admin/pull/6426)) ([Aikain](https://github.com/Aikain))
* [Doc] Add `ra-supabase` to data providers list ([6481](https://github.com/marmelab/react-admin/pull/6481)) ([djhi](https://github.com/djhi))
* [Doc] Add usage for `useList` ([6480](https://github.com/marmelab/react-admin/pull/6480)) ([djhi](https://github.com/djhi))
* [Doc] Fix authentication examples ([6467](https://github.com/marmelab/react-admin/pull/6467)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Improve Submission Validation example ([6466](https://github.com/marmelab/react-admin/pull/6466)) ([WiXSL](https://github.com/WiXSL))
* [Demo] Improve learning experience by keeping component names in React DevTools ([6457](https://github.com/marmelab/react-admin/pull/6457)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Fix minor syntax errors in code examples ([6449](https://github.com/marmelab/react-admin/pull/6449)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix `<BulkUpdateButton>` example ([6447](https://github.com/marmelab/react-admin/pull/6447)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Fix typos, anchors and code samples ([6446](https://github.com/marmelab/react-admin/pull/6446)) ([WiXSL](https://github.com/WiXSL))
* [Doc] Add link to ReactPage Integration in the third-party Inputs list ([6444](https://github.com/marmelab/react-admin/pull/6444)) ([macrozone](https://github.com/macrozone))
* [Doc] added link to `@bb-tech/ra-components` in the third-party Inputs list ([6443](https://github.com/marmelab/react-admin/pull/6443)) ([sivaavkd](https://github.com/sivaavkd))

## v3.17.0

* Add ability to define filters as an array of Inputs ([6368](https://github.com/marmelab/react-admin/pull/6368)) ([fzaninotto](https://github.com/fzaninotto))
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

For the changelog of older releases, check the GitHub repository:

* [Changelog for the 3.x branch](https://github.com/marmelab/react-admin/blob/3.x/CHANGELOG.md)
* [Changelog for the 2.x branch](https://github.com/marmelab/react-admin/blob/2.x/CHANGELOG.md)
* [Changelog for the 1.x branch](https://github.com/marmelab/react-admin/blob/1.x/CHANGELOG.md)
