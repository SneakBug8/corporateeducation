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
    <ReferenceInput label="Achievement" source="achievementId" reference="achievements" />,
];

// Add filter button
const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
)

export const ReceivedAchievementList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="userId" reference="users"/>,
    <ReferenceField source="achievementId" reference="achievements" />
            <DateField source="MIS_DT"  />
            <DateField source="UPDATED_DT"  />
        </Datagrid>
    </List>
);


export const ReceivedAchievementCreate = (props: any) => (
    <Create title="Create a Received Achievement" {...props}>
        <SimpleForm>
            <ReferenceInput source="achievementId" reference="achievements" />
            <ReferenceInput source="userId" reference="users"/>,
        </SimpleForm>
    </Create>
);