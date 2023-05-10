// in posts.js
import { Button } from "@mui/material";
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField, EditButton, TextInput, Toolbar, SaveButton,
    DeleteButton, usePermissions, FilterButton, DateField, DateInput,
    useRecordContext, required, ReferenceInput, BooleanInput, BooleanField, ReferenceManyField,
    ReferenceField, DateTimeInput,
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

const postFilters = [
    
];

const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
);

export const SchedulesList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="groupId" reference="groups" />
            <ReferenceField source="exerciseId" reference="exercises" />
            <DateField source="startsDt" showTime/>
            <DateField source="endsDt" showTime/>

            <TextField source="maxTries"/>
            <TextField source="minExp"/>
            <TextField source="maxExp"/>

            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
            <EditButton />
        </Datagrid>
    </List>
);

const ScheduleTitle = () => {
    const record = useRecordContext();
    return <span>Schedule {record ? `${record.id}`: ""}</span>;
};

export const ScheduleEdit = (props: any) => (
    <Edit title={<ScheduleTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <ReferenceInput source="groupId" reference="groups"/>
            <ReferenceInput source="exerciseId" reference="exercises"/>

            <DateTimeInput source="startsDt"/>
            <DateTimeInput source="endsDt"/>
            <TextInput source="maxTries" />
            <TextInput source="minExp" />
            <TextInput source="maxExp" />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
        </SimpleForm>
    </Edit>
);


export const ScheduleCreate = (props: any) => (
    <Create title="Create an Exercise" {...props}>
        <SimpleForm>
        <ReferenceInput source="groupId" reference="groups"/>
        <ReferenceInput source="exerciseId" reference="exercises"/>
        </SimpleForm>
    </Create>
);