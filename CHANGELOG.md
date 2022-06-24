# Changelog

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
* Fix `<FileInput>` and  `<ImageInput>` style don't use MUI theme ([#7835](https://github.com/marmelab/react-admin/pull/7835)) ([septentrion-730n](https://github.com/septentrion-730n))
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
- Upgrade `material-ui` to v5 (and it's now called `MUI`) (#6650)
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
- Use MUI autocomplete instead of our own (#6924, #6971)
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
* Bump `url-parse` from 1.5.7 to 1.5.10  dependencies([#7313](https://github.com/marmelab/react-admin/pull/7313)) ([dependabot bot](https://github.com/dependabot bot))
* Bump `url-parse` from 1.5.3 to 1.5.7  dependencies([#7263](https://github.com/marmelab/react-admin/pull/7263)) ([dependabot bot](https://github.com/dependabot bot))
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
* Fix `<Login>` page isn't customizable through MUI theme ([#6762](https://github.com/marmelab/react-admin/pull/6762)) ([djhi](https://github.com/djhi))
* Fix call time parameters don't take priority in `useMutation` ([#6761](https://github.com/marmelab/react-admin/pull/6761)) ([djhi](https://github.com/djhi))
* Bump minor dependencies
* [TypeScript] Fix Graphql Providers Types ([#6724](https://github.com/marmelab/react-admin/pull/6724)) ([djhi](https://github.com/djhi))
* [TypeScript] Make `previousData` of `DeleteParams` optional ([#6536](https://github.com/marmelab/react-admin/pull/6536)) ([m0rtalis](https://github.com/m0rtalis))
* [Doc] Add GeoServer data provider ([#6778](https://github.com/marmelab/react-admin/pull/6778)) ([sergioedo](https://github.com/sergioedo))
* [Doc] Add paragraph about carbon footprint in README ([#6774](https://github.com/marmelab/react-admin/pull/6774)) ([fzaninotto](https://github.com/fzaninotto))
* [Doc] Add link to images in tutorial ([#6771](https://github.com/marmelab/react-admin/pull/6771)) ([ocxers](https://github.com/ocxers))
* [Doc] Fix typo in Architecture chapter ([#6740](https://github.com/marmelab/react-admin/pull/6740)) ([HobbitCodes](https://github.com/HobbitCodes))
* [Doc] Fix typo in Theming chapter ([#6714](https://github.com/marmelab/react-admin/pull/6714)) ([afilp](https://github.com/afilp))
* Fix MUI's urls reference for version 4 ([#6702](https://github.com/marmelab/react-admin/pull/6702)) ([WiXSL](https://github.com/WiXSL))
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

- Fix MUI 4.12 deprecation warnings ([#6587](https://github.com/marmelab/react-admin/pull/6587)) ([fzaninotto](https://github.com/fzaninotto))
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

For the changelog of older releases, check the GitHub repository:

* [Changelog for the 3.x branch](https://github.com/marmelab/react-admin/blob/3.x/CHANGELOG.md)
* [Changelog for the 2.x branch](https://github.com/marmelab/react-admin/blob/2.x/CHANGELOG.md)
* [Changelog for the 1.x branch](https://github.com/marmelab/react-admin/blob/1.x/CHANGELOG.md)