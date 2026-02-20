import {
  Admin,
  Resource,
  addOfflineSupportToQueryClient,
  ListGuesser,
} from "react-admin";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import jsonDataProvider from "ra-data-json-server";
import { QueryClient } from "@tanstack/react-query";
import { Layout } from "./Layout";
import { PostEdit } from "./PostEdit";

const dataProvider = jsonDataProvider("https://jsonplaceholder.typicode.com");

const baseQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
    },
  },
});

export const queryClient = addOfflineSupportToQueryClient({
  queryClient: baseQueryClient,
  dataProvider,
  resources: ["posts", "comments", "users"],
});

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

export const App = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: localStoragePersister }}
    onSuccess={() => {
      // resume mutations after initial restore from localStorage is successful
      queryClient.resumePausedMutations();
    }}
  >
    <Admin
      layout={Layout}
      dataProvider={dataProvider}
      queryClient={queryClient}
      disableTelemetry
    >
      <Resource name="posts" list={ListGuesser} edit={PostEdit} />
    </Admin>
  </PersistQueryClientProvider>
);
