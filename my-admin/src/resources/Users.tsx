import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, DateField, DateInput, FilterButton, required, SelectInput, SelectField, BooleanField, BooleanInput
} from "react-admin";
import { User } from "../entities/User";
import { ManagerLimitedActions } from "../util/Common";

const CustomToolbar = ({ ...props }: any) => {
    const { permissions } = usePermissions();
    return (<Toolbar {...props} >
        {["admin", "manager"].includes(permissions) && <SaveButton />}
        {["admin", "manager"].includes(permissions) && <DeleteButton />}
    </Toolbar>
    )
};

const transform = (data: any) => {
    const sanitizedData = {} as any;
    for (const key in data) {
        if (typeof data[key] === "string" && data[key].trim().length === 0) continue;
        sanitizedData[key] = data[key];
    }
    return sanitizedData;
};

// Filters
const postFilters = [
    <ReferenceInput label="Group" source="group" reference="Groups"/>,
    <SelectInput label="Role" source="role" choices={[
        { id: 0, name: "User" },
        { id: 1, name: "Trainer" },
        { id: 2, name: "Administrator" },
      ]} />,
    <TextInput label="Name" source="username" alwaysOn/>,
];

// Add filter button
const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
)

export const UsersList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="username" />
            <SelectField source="role" validate={[required()]} choices={[
              { id: 0, name: "User" },
              { id: 1, name: "Trainer" },
              { id: 2, name: "Administrator" },
            ]} />
            <TextField source="company" />
            <BooleanField source="blocked" looseValue={true}/>
            <ReferenceField source="group" reference="groups" />
            <DateField source="AUTHORIZED_DT" />
            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
            <EditButton />
        </Datagrid>
    </List>
);

const UserTitle = ({ record }: { record: User } | any) => {
    return <span>User {record ? `"${record.id}"` : ""}</span>;
};

export const UserEdit = (props: any) => (
    <Edit title={<UserTitle />} {...props} transform={transform}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <TextInput validate={[required()]} source="username" />
            <p><i>Fill in only if you want to replace the user's password:</i></p>
            <TextInput source="password" />
            <SelectInput source="role" validate={[required()]} choices={[
              { id: 0, name: "User" },
              { id: 1, name: "Trainer" },
              { id: 2, name: "Administrator" },
            ]} />
            <ReferenceInput source="group" reference="groups" />
            <TextInput source="company" />
            <BooleanInput source="blocked" looseValue={true}/>
            <TextInput disabled source="timeonline" />
            <DateInput disabled source="AUTHORIZED_DT" />
            <DateInput disabled source="DEAUTHORIZED_DT" />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />

        </SimpleForm>
    </Edit>
);

export const UserCreate = (props: any) => (
    <Create title="Create an User" {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput validate={[required()]} source="username" />
            <TextInput validate={[required()]} source="password" />
            <SelectInput source="role" validate={[required()]} choices={[
              { id: 0, name: "User" },
              { id: 1, name: "Trainer" },
              { id: 2, name: "Administrator" },
            ]} />
            <ReferenceInput source="group" reference="groups" />
            <TextInput source="company" />
        </SimpleForm>
    </Create>
);