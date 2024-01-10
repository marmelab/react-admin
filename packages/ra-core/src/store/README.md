# Store

The Store is react-admin's global, synchronous store. We use it to store state shared between several componenents and/or state that must be persisted across page reloads (e.g. user preferences).

Here are a few examples of elements stored in the store:

- Is the sidebar open or collapsed?
- Which rows of a datagrid are selected?
- What sort rder is applied to a datagrid?

## Architecture

The store uses an adapter pattern to allow developers to store the state in memory, in localStorage, and to synchronize it with an API.

Stores rely on React state and update events that broadcast a change in the state to all components subscribed to that state.

The Store API is modeled after the `useState` API.

```jsx
const [value, setValue] = useStore(key, defaultValue);
```

## Why Use A Synchronous Store?

We could use React-query to store this data, but that would create useless calls to the dataProvider because react-query is asynchronous.

Here is an example scenario demonstrating the issue:

1. The list controller makes a query with react-query to get the sort order from the store
2. As the response is asynchronous, the list controller starts with the default sort order and asks the dataProvider for the data
3. React-query responds with the sort order
4. The list controller calls the dataProvider again, this time with the saved sort order

With a synchronous store, this doesn't happen:

1. The list controller calls a synchronous store to get the sort order from the store
2. The store responds with the sort order
3. The list controller calls the dataProvider directly with the saved sort order

## Why Not Use Redux?

React-admin v1, v2 and v3 used Redux to store the global state. This had major shortcomings:

- To store a new piece of content, developers had to declare it globally via reducers. The logic was split between actions, reducers, selectors, and even sagas.
- The `useSelector` function is interesting to grab branches of a tree state, but it's overkill when we only need a key/value store. All our needs for a store live perfectly in a key/value store
- Developers already use Redux for their own needs, and since an app can only have one redux store, we had to create APIs to reuse existing providers or inject reducers. This was a pain.
- We need store items (mostly user preferences) to be persisted. Redux offers a way to serialize the store to localStorage, but it's an additional module with an additional ceremony.
- Redux makes unit tests harder, as a component that depends on a redux store needs to be wrapped in a redux provider. With a custom solution, we can use a context with a default value.
- Redux is an external dependency with its own release management, and sometimes forces us to major version upgrades
- Redux is heavy

## Why Not Use Zustand/Recoil/Jotai/Any Other State Management Library?

These libraries require additional knowledge (e.g. atoms, setter functions, etc.) and a bit of tweaking to support localStorage. Although they are a better fit than Redux for react-admin's needs, they are still overkill and heavier than what we really need.

- Jotai: The closest to what we need, but they do a lot of efforts to avoid string keys with atoms, just to add them back when addressing localStorage. Besides, they address a lot of needs we don't have (derived atoms, async read, async actions), and that translates to 3.2kb of code.
- Zustand: Super small, but relies on selector functions and a centralized store - too much ceremony for a key/value store. 
- Recoil: Requires a root component, requires selectors and atoms, and supports things we don't need (async requests). Super heavy (22kB)