// in posts.js
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput,
     ReferenceField, FilterButton, DateInput, DateField, useRecordContext, BooleanInput,
      BooleanField
} from "react-admin";
import { ExerciseStep } from "../entities/ExerciseStep";
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
    <ReferenceInput label="User" source="user" reference="users"/>,
    <ReferenceInput label="Exercise" source="exercise" reference="exercises" />,
    <ReferenceInput source="group" reference="groups"/>
];

// Add filter button
const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
)

export const ExerciseRunsList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="exercise" reference="exercises" />
            <ReferenceField source="userGroup" reference="groups" />
            <ReferenceField source="user" reference="users" />
            <TextField source="experience" />
            <BooleanField source="finished" looseValue={true}/>
            <DateField source="FINISHED_DT" />
            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
            <EditButton />
        </Datagrid>
    </List>
);

const ExerciseRunTitle = () => {
    const record = useRecordContext();
    return <span>ExerciseRun {record ? `${record.id}` : ""}</span>;
};

export const ExerciseRunEdit = (props: any) => (
    <Edit title={<ExerciseRunTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <ReferenceInput source="exercise" reference="exercises">
                <AutocompleteInput optionText="name" />
            </ ReferenceInput>
            <ReferenceInput source="user" reference="users"/>
            <TextInput source="time" />
            <TextInput source="experience" />
            <TextInput source="step" />
            <BooleanInput source="finished" looseValue={true}/>
            <TextInput disabled source="mistakes" />
            <TextInput disabled source="trynumber" />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
            <DateInput disabled source="FINISHED_DT" />
        </SimpleForm>
    </Edit>
);

export const ExerciseRunCreate = (props: any) => (
    <Create title="Create a Run" {...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <ReferenceInput source="exercise" reference="exercises">
                <AutocompleteInput optionText="name" />
            </ ReferenceInput>
            <ReferenceInput source="user"  reference="users" />
            <TextInput source="time" />
            <TextInput source="experience" />
            <TextInput source="step" />
            <BooleanInput source="finished" looseValue={true}/>
        </SimpleForm>
    </Create>
);