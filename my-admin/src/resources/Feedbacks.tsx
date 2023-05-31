// in posts.js
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, BooleanInput, NumberInput, DateInput, DateField, BooleanField, FilterButton, useRecordContext, required
} from "react-admin";
import { ManagerLimitedActions, ReadonlyActions } from "../util/Common";

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
    <ReferenceInput label="User" source="userId" reference="users"/>,
    <ReferenceField label="Exercise" source="exerciseId" reference="exercises" />

];

// Add filter button
const MyActions = () => (
    <ReadonlyActions>
        <FilterButton filters={postFilters} />
    </ReadonlyActions>
)

export const FeedbackList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users" />
            <ReferenceField source="exerciseId" reference="exercises" />
            <TextField source="rating" />
            <TextField source="usefulMark" />
            <TextField source="promoterScore" />

            <DateField source="MIS_DT"  />
            <DateField source="UPDATED_DT"  />
            <EditButton />
        </Datagrid>
    </List>
);


export const FeedbackEdit = (props: any) => (
    <Edit {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <ReferenceInput disabled source="userId" reference="users" />
            <ReferenceField source="exerciseId" reference="exercises" />
            <TextInput disabled source="rating" />
            <TextInput disabled source="usefulMark" />
            <TextInput disabled source="promoterScore" />
            <TextInput disabled source="comment" multiline />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
        </SimpleForm>
    </Edit>
);