// in posts.js
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, BooleanInput, NumberInput, DateInput, DateField, BooleanField, FilterButton, useRecordContext, required
} from "react-admin";
import { ManagerLimitedActions } from "../util/Common";

const CustomToolbar = ({ ...props }: any) => {
    const { permissions } = usePermissions();
    return (<Toolbar {...props} >
        {["admin", "manager"].includes(permissions) && <SaveButton />}
        {["admin", "manager"].includes(permissions) && <DeleteButton />}
    </Toolbar>
    )
};

// Filters
const postFilters = [
    <TextInput label="Id" source="id" alwaysOn />,
    <TextInput label="Name" source="name" />,

];

// Add filter button
const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
)

export const AchievementList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="icon" />
            <DateField source="MIS_DT"  />
            <DateField source="UPDATED_DT"  />
            <EditButton />
        </Datagrid>
    </List>
);


export const AchievementEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="icon" />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
        </SimpleForm>
    </Edit>
);


export const AchievementCreate = (props: any) => (
    <Create title="Create an Achievement" {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="icon" />
        </SimpleForm>
    </Create>
);
