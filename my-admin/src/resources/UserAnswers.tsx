// in posts.js
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, BooleanInput, NumberInput, DateInput, DateField, BooleanField, FilterButton, useRecordContext, required
} from "react-admin";
import { UserAnswer } from "../entities/UserAnswer";
import { ManagerLimitedActions } from "../util/Common";
import { useWatch, useController } from "react-hook-form";

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
    <ReferenceInput label="Exercise" source="exerciseId" reference="exercises" />,
    <BooleanInput source="marked" looseValue={true}/>
];

// Add filter button
const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
)

export const UserAnswersList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="exerciseId" reference="exercises" />
            <ReferenceField source="userId" reference="users" />
            <TextField source="experience" />
            <BooleanField source="marked" looseValue={true} />
            <BooleanField source="outdated" looseValue={true} />
            <TextField source="step" />
            {window.innerWidth > 1440 && <DateField source="MIS_DT" showTime />}
            {window.innerWidth > 1440 && <DateField source="UPDATED_DT" showTime />}
            <EditButton />
        </Datagrid>
    </List>
);

const UserAnswerTitle = ({ record }: { record: UserAnswer } | any) => {
    return <span>UserAnswer {record ? `"${record.id}"` : ""}</span>;
};

const MaxExperience = () => {
    const record = useRecordContext();
    return <p>Max Experience for this step is set as {record.maxexperience}</p>;
};

export const UserAnswerEdit = (props: any) => (
    <Edit title={<UserAnswerTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <ReferenceInput disabled source="exerciseId" reference="exercises" />
            <TextInput disabled source="step" />
            <ReferenceInput disabled source="userId" reference="users" />
            <h3>User's answer</h3>
            <TextInput disabled source="answer" multiline />
            <h3>Marks for the answer</h3>
            <MaxExperience />
            <NumberInput validate={[required()]} source="experience" />
            <BooleanInput source="marked" looseValue={true}/>
            <BooleanInput disabled source="outdated" looseValue={true}/>
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
        </SimpleForm>
    </Edit>
);

export const UserAnswerCreate = (props: any) => (
    <Create title="Create an UserAnswer" {...props}>
        <SimpleForm>
            <ReferenceInput source="exerciseId" reference="exercises">
                <AutocompleteInput optionText="name" />
            </ ReferenceInput>
            <ReferenceInput source="userId" reference="users">
                <AutocompleteInput optionText="name" />
            </ ReferenceInput>
            <TextInput source="experience" />
            <BooleanInput source="marked" looseValue={true}/>
            <TextInput source="step" />
        </SimpleForm>
    </Create>
);
