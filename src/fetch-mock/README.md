# fetch-mock

Features include:

- mocks most of the fetch API spec, even advanced behaviours such as streaming and aborting
- declarative matching for most aspects of a http request, including url, headers, body and query parameters
- shorthands for the most commonly used features, such as matching a http method or matching one fetch only
- support for delaying responses, or using your own async functions to define custom race conditions
- can be used as a spy to observe real network requests
- can be extended with your own reusable custom matchers that can be used both for matching fetch-calls and inspecting the results
- isomorphic, and supports either a global fetch instance or a locally required instance

## Requirements

@fetch-mock requires either of the following to run:

- [Node.js](https://nodejs.org/) 18+ for full feature operation
- Any modern browser that supports the `fetch` API
- [node-fetch](https://www.npmjs.com/package/node-fetch) when testing in earlier versions of Node.js (this is untested, but should mostly work)

## Documentation and Usage

See the [project website](https://www.wheresrhys.co.uk/fetch-mock/)

## License

fetch-mock is licensed under the [MIT](https://github.com/wheresrhys/fetch-mock/blob/master/LICENSE) license.
Copyright © 2024, Rhys Evans
