# ra-realtime

A custom saga enabling realtime update inside [react-admin](https://github.com/marmelab/react-admin/).

## Installation

Install with:

```sh
npm install --save ra-realtime
```

or

```sh
yarn add ra-realtime
```

## Usage

Define an `observeRequest` function which will be called by the realtime saga whenever a `CRUD_GET_LIST` or `CRUD_GET_ONE` fetch
is triggered by react-admin ([documentation](https://marmelab.com/react-admin/RestClients.html) about those).

This function will be called with the following parameters:

- `fetchType`: either `CRUD_GET_LIST` or `CRUD_GET_ONE`
- `resource`: the resource's name
- `params`: the fetch parameters
  - for `CRUD_GET_LIST`: `{ pagination: { page: {int} , perPage: {int} }, sort: { field: {string}, order: {string} }, filter: {Object} }`
  - for `CRUD_GET_ONE`: `{ id: {mixed} }`

This function must return an object with a `subscribe` method which will be called with an `observer`. If it returns `null`, the query won't be updated automatically. This allows you to decide which query should be updated in real time.

The `observer` have the following methods:

- `next(data)`: Call this method each time new data is received so that the react-admin views are updated.
- `complete()`: Call this method to indicates this subscription won't receive any new data.
- `error(error)`: Call this method when an error occurs.

The `subscribe` method must return a `subscription` object. The `subscription` object must have an `unsubscribe` method which will be called by the realtime saga when the query will not need to be observed anymore. This will happen each time the current route change and will give you the opportunity to clean up related sockets, apollo observable queries, etc. When called and after you cleaned up whatever needed cleaning, you **must** call the `observer.complete` method so that the realtime saga is notified about it.

Here is a very naive example using an interval to fetch data every 5 seconds:

```js
// In createRealtimeSaga.js
import realtimeSaga from 'ra-realtime';

const observeRequest = restClient => (type, resource, params) => {
    // Filtering so that only posts are updated in real time
    if (resource !== 'posts') return;

    // Use your apollo client methods here or sockets or whatever else including the following very naive polling mechanism
    return {
        subscribe(observer) {
            const intervalId = setInterval(() => {
                restClient(type, resource, params)
                    .then(results => observer.next(results)) // New data received, notify the observer
                    .catch(error => observer.error(error)); // Ouch, an error occured, notify the observer
            }, 5000);

            const subscription = {
                unsubscribe() {
                    // Clean up after ourselves
                    clearInterval(intervalId);
                    // Notify the saga that we cleaned up everything
                    observer.complete();
                }
            };

            return subscription;
        },
    };
};

export default restClient => realtimeSaga(observeRequest(restClient));
```
