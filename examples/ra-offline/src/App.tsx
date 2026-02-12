import { Admin, EditGuesser, ListGuesser, Resource } from "react-admin";
import jsonDataProvider from "ra-data-json-server";
import { QueryClient } from "@tanstack/react-query";
import { experimental_createQueryPersister } from "@tanstack/react-query-persist-client";
import { Layout } from "./Layout";

const persister = experimental_createQueryPersister({
  storage: localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      persister: persister.persisterFn,
    },
  },
});

const dataProvider = jsonDataProvider("https://jsonplaceholder.typicode.com");

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    queryClient={queryClient}
    disableTelemetry
  >
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);
