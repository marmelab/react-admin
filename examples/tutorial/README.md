# React-admin tutorial

This is the application built while following the [tutorial](https://marmelab.com/react-admin/Tutorial.html).

## How to run

After having cloned the react-admin repository, run the following commands:

```sh
make install

make build

make run-tutorial
```

### Run via Docker

To run the application using Docker:

1. Build the Docker image:
   ```sh
   docker build -t react-admin-tutorial .
   ```

2. Run the Docker container:
   ```sh
   docker run -p 5173:5173 react-admin-tutorial
   ```

3. Access the application at [http://localhost:5173](http://localhost:5173).

Use any login/password combination to log in.