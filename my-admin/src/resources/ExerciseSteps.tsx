// in posts.js
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, SelectInput, WithRecord, DateInput, DateField, useRecordContext, FilterButton
} from "react-admin";
import { ExerciseStep } from "../entities/ExerciseStep";
import { ManagerLimitedActions } from "../util/Common";
import { useWatch, useController } from "react-hook-form";
import TF from '@mui/material/TextField';

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
    <TextInput label="Type" source="type" />,
    <ReferenceInput source="exercise" reference="exercises" />
];

// Add filter button
const MyActions = () => (
    <ManagerLimitedActions>
        <FilterButton filters={postFilters} />
    </ManagerLimitedActions>
)

export const ExerciseStepsList = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
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
    </List>
);

const ExerciseStepTitle = () => {
    const record = useRecordContext();
    return <span>ExerciseStep {record ? `${record.id}` : ""}</span>;
};

const types = [{ id: "text", name: "text" },
{ id: "quiz", name: "quiz" },
{ id: "video", name: "video" },
{ id: "input", name: "input" }];

const StepEditor = (props: any) => {
    const t = useWatch({ name: "type" });

    const { field } = useController({ name: "content", defaultValue: "" });

    const content = JSON.parse(field.value || "{}");

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        content.text = event.target.value;
        field.onChange(JSON.stringify(content));
    };
    const onAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const v = event.target.value.split(",");
        content.answers = v;
        field.onChange(JSON.stringify(content));
    };

    return (<div>
        <h3>Step properties</h3>
        <TF value={content.text} label={t === "video" ? "Video URL" : "Text"} multiline onChange={onTextChange} />
        {t === "quiz" &&
            <div><TF value={content.answers && content.answers.join && content.answers.join(",") || content.answers}
                label="Allowed Answers"
                placeholder='a,b,c'
                onChange={onAnswersChange}
            />
                <TextInput source="answer" label="Correct answer" placeholder='a' />
            </div>
        }</div>);
}

export const ExerciseStepEdit = (props: any) => {
    // const input1 = useController({ name: "content.text", defaultValue: "" });

    return (<Edit title={<ExerciseStepTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <ReferenceInput source="exercise" reference="exercises">
                <AutocompleteInput optionText="name" />
            </ ReferenceInput>
            <TextInput source="stepnumber" />
            <SelectInput source="type" choices={types} />
            <StepEditor />
            <TextInput source="experience" />
            <DateInput disabled source="MIS_DT" />
            <DateInput disabled source="UPDATED_DT" />
        </SimpleForm>
    </Edit>
    )
};

export const ExerciseStepCreate = (props: any) => (
    <Create title="Create an ExerciseStep" {...props}>
        <SimpleForm>
            <ReferenceInput source="exercise" reference="exercises" />
            <TextInput source="stepnumber" />
            <SelectInput source="type" choices={types} />
            <StepEditor />
            <TextInput source="experience" />
        </SimpleForm>
    </Create>
);
