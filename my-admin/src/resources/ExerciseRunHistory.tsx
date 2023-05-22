import {
    List, Datagrid, Edit, Create, SimpleForm, TextField,
    EditButton, TextInput, Toolbar, SaveButton, DeleteButton, usePermissions,
    ReferenceInput, AutocompleteInput,PasswordInput,
    NumberField, ReferenceField, DateField, DateInput, FilterButton, required, SelectInput, SelectField, BooleanField, BooleanInput
} from "react-admin";
import { User } from "../entities/User";
import { ReadonlyActions } from "../util/Common";

// Filters
const postFilters = [
    
];

// Add filter button
const MyActions = () => (
    <ReadonlyActions>
        <FilterButton filters={postFilters} />
    </ReadonlyActions>
)

export const ExerciseRunHistory = (props: any) => (
    <List {...props} actions={<MyActions />} filters={postFilters}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="exerciseId" reference="exercises" />
            <ReferenceField source="userGroup" reference="groups" />
            <ReferenceField source="userId" reference="users" />
            <TextField source="experience" />
            <TextField source="step" />
            <TextField source="trynumber" />
            <TextField source="mistakes" />
            <BooleanField source="finished" looseValue={true}/>
            <DateField source="FINISHED_DT" />
            <DateField source="MIS_DT" />
            <DateField source="UPDATED_DT" />
        </Datagrid>
    </List>
);