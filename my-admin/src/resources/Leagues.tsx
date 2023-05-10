// in posts.js
import { useState, useEffect } from "react";
import {
    List, Datagrid, Edit, Create, SimpleForm, TextField, EditButton, TextInput, Toolbar, SaveButton, DeleteButton,
    usePermissions, FilterButton, DateField, DateInput, ReferenceInput,
    ReferenceField, useRecordContext, useDataProvider, BooleanField, BooleanInput
} from "react-admin";
import { ExerciseModel } from "../entities/ExerciseModel";
import { ManagerLimitedActions } from "../util/Common";

const CustomToolbar = ({ ...props }: any) => {
    const { permissions } = usePermissions();
    return (<Toolbar {...props} >
        {["admin", "manager"].includes(permissions) && <SaveButton />}
        {["admin", "manager"].includes(permissions) && <DeleteButton />}
    </Toolbar>
    )
};

export const LeaguesList = (props: any) => (
    <List {...props} actions={<ManagerLimitedActions />} >
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <ReferenceField source="group" reference="groups" />
            <BooleanField source="hasfinished" looseValue={true} />
            <ReferenceField source="winner" reference="users" />
            <DateField source="starts" />
            <DateField source="ends" />
            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
            <EditButton />
        </Datagrid>
    </List>
);

const LeagueTitle = ({ record }: { record: ExerciseModel } | any) => {
    return <span>League {record ? `"${record.name}"` : ""}</span>;
};

const LeagueTop = () => {
    const record = useRecordContext();
    const dataProvider = useDataProvider();

    // console.log(record);

    if (!record) { return null };

    const [top, setTop] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        dataProvider.getOne('leaguestop', { id: record.id })
            .then(({ data }) => {
                setTop(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            })
    }, []);

    if (loading) {
        return null;
    }

    if (!top) {
        return null;
    }

    console.log(top);

    return <div><h2>Current leaderboard</h2>
        <ol>{top.data.map((x: any, i: number) => {
            return <li key={i}>{x.username} - {x.experience}</li>;
        })}</ol></div>;
};

const MyEdit = (props: any) => {
    const record = useRecordContext();

    if (!record) { return null; }

    return (<SimpleForm toolbar={<CustomToolbar {...props} />}>
        <TextInput disabled source="id" />
        <TextInput source="name" disabled={record.winner}/>
        <ReferenceInput source="group" reference="groups" disabled={record.winner}/>
        <DateInput source="starts" disabled={record.winner} />
        <DateInput source="ends" disabled={record.winner} />
        <BooleanInput disabled source="hasfinished" looseValue={true} />
        <DateInput disabled source="MIS_DT" />
        <DateInput disabled source="UPDATED_DT" />
        <LeagueTop />
    </SimpleForm>);
}

export const LeagueEdit = (props: any) => (
    <Edit title={<LeagueTitle />} {...props}>
        <MyEdit {...props} />
    </Edit>
);

export const LeagueCreate = (props: any) => (
    <Create title="Create an Exercise" {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceInput source="group" reference="groups" />
            <DateInput source="starts" />
            <DateInput source="ends" />
        </SimpleForm>
    </Create>
);