import { Edit, ReferenceInput, SimpleForm, TextInput } from "react-admin";

export const PostEdit = () => (
  <Edit redirectOnError={false}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="id" />
      <TextInput source="title" />
      <TextInput source="body" />
    </SimpleForm>
  </Edit>
);
