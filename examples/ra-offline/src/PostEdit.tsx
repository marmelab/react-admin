import {
  EditBase,
  EditView,
  ReferenceInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const PostEdit = () => (
  <EditBase redirectOnError={false}>
    <EditView>
      <SimpleForm>
        <ReferenceInput source="userId" reference="users" />
        <TextInput source="id" />
        <TextInput source="title" />
        <TextInput source="body" />
      </SimpleForm>
    </EditView>
  </EditBase>
);
