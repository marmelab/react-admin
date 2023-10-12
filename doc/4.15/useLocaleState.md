---
layout: default
title: "useLocaleState"
---

# `useLocaleState`

The `useLocaleState` hook allows to read and update the locale. It uses a syntax similar to react's `useState` hook.

## Syntax

```jsx
const [locale, setLocale] = useLocaleState();
```

## Usage

`useLocaleState` is generally used in components allowing the user to switch the interface language:

```jsx
import * as React from "react";
import Button from '@mui/material/Button';
import { useLocaleState } from 'react-admin';

const LocaleSwitcher = () => {
    const [locale, setLocale] = useLocaleState();
    return (
        <div>
            <div>Language</div>
            <Button 
                disabled={locale === 'fr'}
                onClick={() => setLocale('fr')}
            >
                English
            </Button>
            <Button
                disabled={locale === 'en'}
                onClick={() => setLocale('en')}
            >
                French
            </Button>
        </div>
    );
};

export default LocaleSwitcher;
```

As this is a very common need, react-admin provides the [`<LocalesMenuButton>`](./LocalesMenuButton.md) component.
