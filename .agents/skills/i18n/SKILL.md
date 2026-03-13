---
name: react-admin-i18n
description: Guidelines for internationalizing a react-admin or shadcn admin kit application. Use when adding i18n support, creating translation files, translating hardcoded English strings in JSX, or reviewing i18n PRs in a react-admin project. Covers namespace conventions, interpolation, pluralization, locale-aware formatting, and the full workflow for converting an English-only app to multi-language. Trigger this skill whenever the user mentions i18n, internationalization, translation, localization, locale switching, or multi-language in a react-admin or shadcn admin kit context — even if they just say "translate this component" or "add French support".
---

# Internationalizing a React-Admin Application

This skill describes how to add i18n support to a react-admin / shadcn admin kit application. It covers the full workflow: setting up the i18n provider, structuring translation catalogs, converting hardcoded English strings in JSX to translation keys, and avoiding the many pitfalls that make this task tedious.

## High-Level Workflow

When converting an English-only react-admin app to multi-language, follow this order:

1. **Install dependencies** — `ra-i18n-polyglot`, `ra-language-english`, `ra-language-<target>`, and any auth-provider language packs (e.g. `ra-supabase-language-french`).
2. **Create the i18nProvider** — wire up `polyglotI18nProvider` with merged catalogs and browser locale detection.
3. **Create the English CRM message catalog** — extract every hardcoded string from JSX into a typed object.
4. **Create the target-language catalog** — translate every key, using strict typing (`satisfies CrmMessages`) so missing keys fail at compile time.
5. **Convert every component** — replace hardcoded strings with `<Translate>` or `useTranslate()` calls or rely on react-admin's auto-inference.
6. **Disable browser auto-translation** — add `translate="no"` and `<meta name="google" content="notranslate" />` to your HTML shell.
7. **Add a language switcher** — typically on the Profile page, using `useLocaleState()` and `useLocales()`.
8. **Audit and clean up** — remove unused keys, inline `_` defaults, and duplicate labels.

## Namespace Conventions

React-admin's translation system (Polyglot.js) uses a hierarchical key structure. Respect these namespaces:

- **`ra.*`** — Framework-level messages (auth, navigation, pagination, CRUD notifications, validation). Never override unless you need to customize framework wording.
- **`ra-supabase.*`** (or other auth provider namespaces) — Auth-provider-specific messages. You can override individual keys via a separate override object merged on top.
- **`resources.*`** — Resource and field names. This is the **default namespace react-admin uses to infer labels** in forms, show views, datagrid columns, and filters. Structure:
  - `resources.<resourceName>.name` — singular/plural resource label (with `||||` for pluralization)
  - `resources.<resourceName>.fields.<fieldName>` — field label
  - `resources.<resourceName>.empty` / `resources.<resourceName>.invite` — custom empty-state messages (optional, react-admin falls back to `ra.page.empty` / `ra.page.invite`)
- **`app.*`** (or a project-specific prefix like `crm.*`) — Application-specific copy: empty states, helper text, tooltips, dashboard titles, domain wording. Everything that is not a resource field name and not a framework message goes here.

### Why `resources.*` Matters

When you place field translations under `resources.<resource>.fields.<field>`, react-admin **automatically** resolves labels for `<TextInput source="first_name" />`, `<TextField source="first_name" />`, and filter inputs — without passing an explicit `label` prop. This eliminates an entire class of duplication bugs.

### The `forcedCaseName` Pattern

Some languages (like French) don't capitalize common nouns the same way English does. React-admin's `ra.page.empty` interpolates `%{name}` which comes from `resources.<resource>.name`, but pluralization via `||||` can produce awkward casing in sentences. Use a dedicated `forcedCaseName` key when you need a specific casing for interpolation contexts:

```ts
resources: {
  contacts: {
    name: "Contact |||| Contacts",       // used by react-admin for menu items, plurals
    forcedCaseName: "Contact",            // used for custom interpolation in sentences
  }
}
```

Then in the generic empty-state component:

```tsx
const resourceName = translate(`resources.${resource}.forcedCaseName`, {
  smart_count: 0,
  _: resource ? getResourceLabel(resource, 0) : undefined,
});
```

## Rules

### 1. Don't translate twice

```tsx
// ❌ Bad: Components already call translate() internally, so this duplicates the translation
<TabbedForm.Tab path="identity" label={translate('resources.users.tabs.identity')} />

// ✅ Good: just pass the message key and let the component handle translation
<TabbedForm.Tab path="identity" label="resources.users.tabs.identity" />
```

Only use translate() in your components when you know that the underlying component does not already handle translation.

### 2. Let react-admin infer labels — don't set them manually

```tsx
// ❌ Bad: hardcoded label duplicates the translation file
<TextInput source="first_name" label={translate('resources.contacts.fields.first_name')} />

// ✅ Good: react-admin resolves the label from the resources namespace
<TextInput source="first_name" />
```

Only use an explicit `label` when the desired label differs from the field-name-based default.

### 3. Don't duplicate labels across fields, inputs, and filters

A single key in `resources.<resource>.fields.<field>` covers the `<TextField>`, the `<TextInput>`, and the filter input. **Never** create separate keys like `resources.contacts.fields.first_name`, `resources.contacts.inputs.first_name`, and `resources.contacts.filters.first_name`.

### 4. Use interpolation, never concatenation

```tsx
// ❌ Bad: concatenation breaks in languages with different word order
<span>{translate('crm.common.last_activity')} {relativeDate}</span>

// ✅ Good: interpolation lets each language place the variable where it belongs
<span>{translate('crm.common.last_activity_with_date', { date: relativeDate })}</span>
// en: "last activity %{date}"
// fr: "dernière activité %{date}"
```

Always pass dynamic values as interpolation variables ("Added on %{date}", "Followed by %{name}", etc.).

Note that Polyglot only interpolates **string values**. You cannot interpolate React components. If you need to embed a component (e.g. `<DateField>`), format the value as a plain string first, then interpolate it.

### 5. Use Polyglot's built-in pluralization

Polyglot supports pluralization via `||||`-separated forms, to support languages that have more than two plural forms. Don't reimplement plural logic in JS.

For example, to render "1 task" or "5 tasks" based on a `nbTasks` variable:

```ts
// ❌ Bad: handle pluralization by hand
return <>{nbTasks}{" "}{translate(nbTasks === 1 ? "app.tasks.name.singular" : "app.tasks.name.plural")}</>;
// english catalog
"app.tasks.name.singular": "task",
"app.tasks.name.plural": "tasks",

// ✅ Good: use Polyglot's pluralization syntax
return <>{translate('app.tasks.name', { smart_count: nbTasks })}</>;
// english catalog
"app.tasks.name": "%{smart_count} task |||| %{smart_count} tasks"
```

### 6. Scope messages to their feature — avoid over-sharing "common" keys

If a message is only ever used in one resource or feature, scope it there. Only promote a key to `*.common.*` when it is genuinely used in 3+ unrelated places. Shared "common" buckets grow into junk drawers that no one dares to clean up.

Good scoping examples from a real project:
- `resources.contacts.merge.title` — only used in contact merge
- `resources.deals.archived.action` — only used in deal archiving
- `app.dashboard.deals_chart` — only used on the dashboard
- `app.common.retry` — genuinely shared across error states

### 7. Handle grammar edge cases with separate keys, not string tricks

Some languages require different verb conjugation depending on the subject. For example, in French:

- "Jean **a ajouté** une note" (third person)
- "Vous **avez ajouté** une note" (second person formal)

Interpolation alone can't fix this. Use separate translation keys and select at runtime based on the current user identity:

```tsx
const { identity } = useGetIdentity();
const isCurrentUser = identity?.id === activity.sales_id;

translate(
  isCurrentUser
    ? "crm.activity.you_added_contact"
    : "crm.activity.added_contact",
  { name: salesName },
);
```

```ts
// en
"crm.activity.added_contact": "%{name} added",
"crm.activity.you_added_contact": "You added",

// fr
"crm.activity.added_contact": "%{name} a ajouté le contact",
"crm.activity.you_added_contact": "Vous avez ajouté le contact",
```

### 8. Leverage built-in defaults from controllers

React-admin controllers (`useEditController`, `useCreateController`, etc.) already provide interpolated `defaultTitle` values. Don't rebuild page titles by hand:

```tsx
// ❌ Bad: manually building the edit title
<h1>{translate('resources.contacts.action.edit')} <RecordRepresentation /></h1>

// ✅ Good: use the title provided by the controller
const { defaultTitle } = useEditContext();
<h1>{defaultTitle}</h1>
```

### 9. Use `_` defaults for progressive adoption, but remove them once catalogs are complete

During migration, inline defaults like `translate('crm.auth.welcome_title', { _: 'Welcome to Atomic CRM' })` prevent the app from showing raw keys. Once you have complete translation files, **remove all inline defaults** — they mask missing keys and make it impossible to detect untranslated strings.

Exception: keep `_` defaults for strings that may not exist in all catalogs (e.g. optional auth provider messages, or partial third-party locale packs).

### 10. Translate `notify()` calls, not just JSX

Every `notify()` call with a hardcoded string must also be translated. Pass a translation key as the first argument:

```tsx
// ❌ Bad
notify("Profile updated successfully");

// ✅ Good
notify("crm.profile.updated", {
  messageArgs: { _: "Your profile has been updated" },
});
```

### 11. Use Intl for number and date formatting

Localization of numbers and dates is already handled by JavaScript's built-in `Intl` methods, and they use the browser's locale automatically. Use them for any number or date formatting in your app.

Note: `<NumberField>` and `<NumberInput>` components already use `Intl.NumberFormat` under the hood, so they will automatically format numbers according to the current locale without any extra work.

### 12. Detect browser language as the initial locale

To select the initial locale based on the user's browser settings, use `resolveBrowserLocale()` from `ra-core` when initializing your i18nProvider:

```tsx
// in src/i18nProvider.js
import { resolveBrowserLocale } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';

const translations = { en, fr };

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale] ? translations[locale] : translations.en,
    resolveBrowserLocale(),
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' }
    ],
);
```

### 13. Disable browser auto-translation

When your app handles its own i18n, browser auto-translate (Chrome's Google Translate bar) creates conflicts. Disable it:

```html
<html lang="en" translate="no" class="notranslate">
  <head>
    <meta name="google" content="notranslate" />
    ...
  </head>
```

Apply this to all HTML entry points (main `index.html`, auth callback pages, etc.).

### 14. Don't forget sr-only and aria labels

Screen-reader-only text and aria labels are also user-facing strings that need translation:

```tsx
// ❌ Bad
<span className="sr-only">Toggle theme</span>

// ✅ Good
<span className="sr-only">{translate("ra.action.toggle_theme")}</span>
```

### 15. Don't forget placeholder text

Placeholders in search inputs, autocomplete fields, and text areas are easy to miss:

```tsx
// ❌ Bad
<CommandInput placeholder="Search..." />

// ✅ Good — pass a translated placeholder prop
<CommandInput placeholder={placeholder} />
```

## Type-Safe Message Catalogs

Define your English catalog as a `const` assertion and derive types from it. This catches missing keys at compile time for in-repo locales:

```ts
// englishCrmMessages.ts
export const englishCrmMessages = {
  resources: { /* ... */ },
  crm: { /* ... */ },
} as const;

type MessageSchema<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? MessageSchema<T[K]>
      : never;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepPartial<T[K]>
    : T[K];
};

export type AppMessages = MessageSchema<typeof englishAppMessages>;
export type PartialAppMessages = DeepPartial<AppMessages>;
```

For the strict in-repo locale (e.g. French), use `satisfies AppMessages`:

```ts
// frenchAppMessages.ts
import type { AppMessages } from "./englishAppMessages";

export const frenchAppMessages = {
  resources: { /* ... */ },
  crm: { /* ... */ },
} satisfies AppMessages;
```

For external/community locales, use `PartialAppMessages` to allow incremental translation with English fallback.

## i18nProvider Setup

The i18nProvider merges framework messages, auth-provider messages, any overrides, and your CRM messages. The non-default locale catalog should be merged **on top of the English catalog** so that untranslated keys fall back to English:

```ts
import { mergeTranslations } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import frenchMessages from "ra-language-french";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { raSupabaseFrenchMessages } from "ra-supabase-language-french";
import { englishCrmMessages } from "./englishCrmMessages";
import { frenchCrmMessages } from "./frenchCrmMessages";

const englishCatalog = mergeTranslations(
  englishMessages,
  raSupabaseEnglishMessages,
  englishCrmMessages,
);

// Merge French ON TOP of English so missing keys fall back to English
const frenchCatalog = mergeTranslations(
  englishCatalog,
  frenchMessages,
  raSupabaseFrenchMessages,
  frenchCrmMessages,
);

export const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fr") return frenchCatalog;
    return englishCatalog;
  },
  'en',
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
  ],
  { allowMissing: true },
);
```

## Language Switcher

Place the language switcher on the Profile page (not in the top menu — it's rarely changed). Use `useLocaleState()` and `useLocales()` from `ra-core`, and only render it when more than one locale is configured:

```tsx
const LanguageSelector = () => {
  const translate = useTranslate();
  const locales = useLocales();
  const [locale, setLocale] = useLocaleState();

  if (locales.length <= 1) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {translate("crm.language")}
      </p>
      <Select value={locale} onValueChange={setLocale}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locales.map((language) => (
            <SelectItem key={language.locale} value={language.locale}>
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
```

## Systematic Component Conversion Process

When converting components, follow this systematic approach for each file:

1. **Add `useTranslate` import**: `import { useTranslate } from "ra-core";`
2. **Get the translate function**: `const translate = useTranslate();`
3. **Scan for hardcoded strings** — check these locations:
   - JSX text content between tags
   - `label` props (often removable — let react-admin infer)
   - `placeholder` props
   - `title` / `alt` attributes
   - `notify()` calls
   - `sr-only` spans
   - Conditional strings (ternaries with English text)
   - Template literals with embedded text
   - Error messages
   - Empty state messages
   - Button labels
   - Tooltip content
   - Dialog titles and descriptions
4. **Choose the right namespace** for each string (see Namespace Conventions above)
5. **Add keys to both language catalogs** simultaneously — don't leave one behind
6. **Remove explicit `label` props** on field components when the label matches `resources.<resource>.fields.<field>`

### Strings You Should NOT Translate

- URLs and email addresses
- User-generated content (names, notes, etc.)
- Technical identifiers (CSS class names, source props, etc.)
- Brand names that should remain in English
- User-configurable labels that are stored in the database (translate only the defaults)

## Clean up unused translation keys

After refactoring, stale keys accumulate fast. Periodically audit your translation files to remove keys that are no longer referenced in the codebase. A simple `grep -r "key.name" src/` goes a long way. Consider tooling like `i18next-parser` or a custom script to detect orphaned keys.

## Testing i18n

Write tests that verify:
- The provider registers all expected locales
- Key framework overrides work in each locale
- Browser locale detection returns the correct locale
- Switching locale returns translated keys

```ts
describe("i18nProvider", () => {
  it("registers en and fr locales", () => {
    expect(i18nProvider.getLocales?.()).toEqual([
      { locale: "en", name: "English" },
      { locale: "fr", name: "Français" },
    ]);
  });

  it("translates CRM keys in each locale", async () => {
    await i18nProvider.changeLocale("fr");
    expect(i18nProvider.translate("crm.language")).toBe("Langue");
  });

  it("falls back to English for unknown locales", async () => {
    await i18nProvider.changeLocale("es");
    expect(i18nProvider.translate("crm.language")).toBe("Language");
  });
});
```

## Checklist Before Submitting an i18n PR

- [ ] No hardcoded English strings remain in components under `src/`
- [ ] Field labels use the `resources.*` namespace and are auto-inferred (no manual `label` props unless necessary)
- [ ] No label duplication between fields, inputs, and filters
- [ ] All dynamic values use interpolation (`%{variable}`), not concatenation
- [ ] Pluralization uses Polyglot's `||||` syntax
- [ ] "You" vs third-person variants use separate keys, not string tricks
- [ ] `notify()` calls use translation keys, not hardcoded strings
- [ ] `sr-only` spans and aria labels are translated
- [ ] Placeholder text in inputs is translated
- [ ] No unused translation keys in the catalog
- [ ] No inline `_` defaults when a full translation file exists (except for optional auth-provider keys)
- [ ] Non-default locale catalogs are merged on top of English catalog for fallback
- [ ] French (or target) catalog uses `satisfies CrmMessages` for type safety
- [ ] Browser language detection works on first visit
- [ ] Browser auto-translation is disabled (`translate="no"`, `<meta name="google" content="notranslate" />`)
- [ ] Date/number formatting is locale-aware and uses a single utility with `date-fns` locale imports
- [ ] Language switcher is present on the Profile page and hidden when only one locale exists
- [ ] All translations are reviewed by a native speaker for grammar (especially conjugation and gender agreement)
- [ ] i18nProvider tests cover locale registration, key translation, and fallback behavior