// in posts.js
import * as React from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput, ReferenceField, SelectInput, WithRecord, DateInput, DateField, useRecordContext, FilterButton, BooleanInput
} from "react-admin";
import { ExerciseStep } from "../entities/ExerciseStep";
import { ManagerLimitedActions } from "../util/Common";
import { useWatch, useController } from "react-hook-form";
import TF from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import { useState } from "react";
import ToggleButton from '@mui/material/ToggleButton';


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
    <TextInput source="type" />,
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

    console.log(field);

    let content = field.value || {};

    if (typeof content === "string") {
        try {
            content = JSON.parse(field.value || "{}");
        }
        catch {
            content = {};
        }
    }

    const [numOfAnswers, setNum ] = useState(content && content.answers && content.answers.length || 0);
    const generateArrays = [];

    for (let i = 0; i < numOfAnswers; i++) {
        generateArrays.push(i);
    }

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        content.text = event.target.value;
        field.onChange(content);
    };
    const onAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const v = event.target.value.split(",");
        content.answers = v;
        field.onChange(content);
    };

    const onAnswerChange = (id: number, s: string) => {
        content.answers[id] = s;

        field.onChange(content);
    };

    const onAnswerRemoved = () => {
        if (numOfAnswers > 0) {
        content.answers.pop();
        field.onChange(content);

        setNum(numOfAnswers- 1);
        }
    }

    const onAnswerAdded = () => {
        if (!content.answers) {
            content.answers = [];
        }
        content.answers.push("");
        field.onChange(content);

        setNum(numOfAnswers + 1);
    }

    /* 
    <TF value={content.answers && content.answers.join && content.answers.join(",") || content.answers}
                label="Allowed Answers"
                placeholder='a,b,c'
                onChange={onAnswersChange}
            />
            */

    return (<>
        <h3>Step properties</h3>
        <TF sx={{width: "100%"}} value={content.text} label={t === "video" ? "Video URL" : "Text"} multiline minRows={3} onChange={onTextChange} />
        {t === "quiz" &&
            <>
                <TextInput source="correctAnswer" label="Correct answer" placeholder='a' />
                <br/>
                <div><Button variant="contained" onClick={onAnswerAdded}>+</Button>
                <Button variant="contained" onClick={onAnswerRemoved}>-</Button></div>
                <br/>
                <>{generateArrays.map(x => <QuizAnswer id={x} key={x} value={content.answers[x]} callback={onAnswerChange}/>)}</>
                <br />
            </>
        }</>);
}

type QuizProps = {id: number, value: string, callback: (id: number, s: string) => void};

const QuizAnswer = (props: QuizProps) => {
    const [content, setContent] = useState(props.value);

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       setContent(event.target.value);
       props.callback(props.id, event.target.value);
    };

    return <><TF value={content} label={"Answer " + props.id} onChange={onTextChange}/><br/></>
}

export const ExerciseStepEdit = (props: any) => {
    // const input1 = useController({ name: "content.text", defaultValue: "" });

    return (<Edit title={<ExerciseStepTitle />} {...props}>
        <SimpleForm toolbar={<CustomToolbar {...props} />}>
            <TextInput disabled source="id" />
            <ReferenceInput source="exercise" reference="exercises">
                <AutocompleteInput optionText="name" />
            </ ReferenceInput>
            <ReferenceField source="exercise" reference="exercises">
                <span>Open exercise</span>
                </ReferenceField>
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
            <TextInput source="stepnumber" placeholder="Start from 0"/>
            <SelectInput source="type" choices={types} />
            <StepEditor />
            <TextInput source="experience" />
        </SimpleForm>
    </Create>
);
