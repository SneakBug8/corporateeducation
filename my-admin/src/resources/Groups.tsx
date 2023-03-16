// in posts.js
import * as React from "react";
import { List, Datagrid, Edit, Create, SimpleForm, TextField, 
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, DateField, DateInput } from "react-admin";
import { Group } from "../entities/Group";
import { ManagerLimitedActions } from "../util/Common";

const CustomToolbar = ({ ...props }: any) => {
    const { permissions } = usePermissions();
    return (<Toolbar {...props} >
        {["admin", "manager"].includes(permissions) && <SaveButton />}
        {["admin", "manager"].includes(permissions) && <DeleteButton />}
    </Toolbar>
    )
};

export const GroupsList = (props: any) => (
    <List {...props} actions={<ManagerLimitedActions />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
            <EditButton />
        </Datagrid>
    </List>
);

const GroupTitle = ({ record }: { record: Group } | any) => {
    return <span>Group {record ? `"${record.id}"` : ""}</span>;
};

export const GroupEdit = (props: any) => (
    <Edit title={<GroupTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
        </SimpleForm>
    </Edit>
);

export const GroupCreate = (props: any) => (
    <Create title="Create a Group" {...props}>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);