// in posts.js
import { Button } from "@mui/material";
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField, EditButton, TextInput, Toolbar, SaveButton,
    DeleteButton, usePermissions, FilterButton, DateField, DateInput,
    useRecordContext, required, BooleanInput, BooleanField, ReferenceManyField,
    ReferenceField,
    CreateButton
} from "react-admin";
import { ExerciseModel } from "../entities/ExerciseModel";
import { ManagerLimitedActions } from "../util/Common";
import { Link } from 'react-router-dom';

const CustomToolbar = ({ ...props }: any) => {
    const { permissions } = usePermissions();
    return (<Toolbar {...props} >
        {["admin", "manager"].includes(permissions) && <SaveButton />}
        {["admin", "manager"].includes(permissions) && <DeleteButton />}
    </Toolbar>
    )
};

const postFilters = [
    <TextInput label="Name" source="name" alwaysOn />,
    <TextInput label="public" source="public" defaultValue="1" />,
];

const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
);

export const ExercisesList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <BooleanField source="public" looseValue={true} />
            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
            <EditButton />
        </Datagrid>
    </List>
);

const ExerciseTitle = () => {
    const record = useRecordContext();
    return <span>Exercise {record ? `${record.id} "${record.name}"` : ""}</span>;
};

const CreateRelatedButton = () => {
    const record = useRecordContext();
    /* <CreateButton label="Create step"/> */
    return (
        <Button
            component={Link}
            to={{
                pathname: '/steps/create',
            }}
            state={{ record: { exercise: record.id } }}
        >
            Create step
        </Button>
    );
};


const ChildrenSteps = (props: any) => (
    <ReferenceManyField label="Steps" reference="steps" target="exercise">
                <CreateRelatedButton />
                <Datagrid>
                    <TextField source="id" />
                    <ReferenceField source="exercise" reference="exercises" />
                    <TextField source="stepnumber" />
                    <TextField source="type" />
                    <TextField source="experience" />
                    <DateField source="MIS_DT" />
                    <DateField source="UPDATED_DT" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
);

export const ExerciseEdit = (props: any) => (
    <Edit title={<ExerciseTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <TextInput validate={[required()]} source="name" />
            <TextInput source="previousexercises" />
            <BooleanInput source="public" looseValue={true} />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
            <h2>Exercise Steps</h2>
            <ChildrenSteps {...props} />
        </SimpleForm>
    </Edit>
);


export const ExerciseCreate = (props: any) => (
    <Create title="Create an Exercise" {...props}>
        <SimpleForm>
            <TextInput validate={[required()]} source="name" />
            <TextInput source="previousexercises" />
            <BooleanInput source="public" looseValue={true} />
        </SimpleForm>
    </Create>
);