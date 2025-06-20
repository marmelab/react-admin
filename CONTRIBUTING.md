# Contributing to [Project Name]

Thank you for considering contributing!  
Please follow these steps for setting up the project.

## 🔧 Installation (For Contributeurs )

```bash
git clone <repo-url>
yarn install
cd react-admin
yarn run-simple


## Setting Up React-Admin Locally

If you're using the CLI to scaffold a new React-Admin project, note that as of version **5.6.0**, the CLI **no longer runs in interactive mode by default**.

To use the interactive setup (choose data providers, auth, etc.), use the following command:

```bash
npm init react-admin your-project-name -- --interactive
```

## Using `ReferenceInput` with a Custom Identifier (`optionValue`)

By default, `ReferenceInput` expects the referenced field to be identified by its `id`.

However, if you're using a different identifier (e.g., `login`, `username`, or `name`), simply setting `optionValue` on the `AutocompleteInput` is **not enough**.

### Problem

When using:

```jsx
<ReferenceInput source="owner" reference="users" perPage={5}>
  <AutocompleteInput optionValue="login" />
</ReferenceInput>
