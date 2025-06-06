# React-admin Simple Example

This is the application we use for our end-to-end tests, and for reproducing bugs via [Stackblitz](https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/simple).

## How to run

From the react-admin repository:

```sh
# install the dependencies for the monorepo
make install
# run the app in extended watch mode (reloads when a change is detected in the app code and in the packages code)
make run-simple
```

### Run via Docker

To run the application using Docker:

1. Build the Docker image:
   ```sh
   docker build -t react-admin-simple .
   ```

2. Run the Docker container:
   ```sh
   docker run -p 8080:8080 react-admin-simple
   ```

3. Access the application at [http://localhost:8080](http://localhost:8080).

The credentials are **login/password**
