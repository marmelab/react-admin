---
title: "useLocaleState"
---

The `useLocaleState` hook allows to read and update the locale. It uses a syntax similar to react's `useState` hook.

## Syntax

```jsx
const [locale, setLocale] = useLocaleState();
```

## Usage

`useLocaleState` is generally used in components allowing the user to switch the interface language:

```jsx
import * as React from "react";
import { useLocaleState } from 'ra-core';

const LocaleSwitcher = () => {
    const [locale, setLocale] = useLocaleState();
    return (
        <div>
            <div>Language</div>
            <button 
                disabled={locale === 'fr'}
                onClick={() => setLocale('fr')}
            >
                English
            </button>
            <button
                disabled={locale === 'en'}
                onClick={() => setLocale('en')}
            >
                French
            </button>
        </div>
    );
};

export default LocaleSwitcher;
```


