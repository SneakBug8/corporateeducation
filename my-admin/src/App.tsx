// in src/admin/index.tsx
import { Admin, Resource, ListGuesser } from "react-admin";
import restProvider from "ra-data-simple-rest";
import { ExercisesList, ExerciseEdit, ExerciseCreate } from "./resources/Exercises";
import { authProvider } from "./authProvider";
import { ExerciseStepsList, ExerciseStepEdit, ExerciseStepCreate } from "./resources/ExerciseSteps";
import { ExerciseRunsList, ExerciseRunEdit, ExerciseRunCreate } from "./resources/ExerciseRuns";
import { GroupCreate, GroupEdit, GroupsList } from "./resources/Groups";
import { UserAnswersList, UserAnswerEdit, UserAnswerCreate } from "./resources/UserAnswers";
import { UserCreate, UserEdit, UsersList } from "./resources/Users";
import { LeagueCreate, LeagueEdit, LeaguesList } from "./resources/Leagues";

import AssessmentIcon from '@mui/icons-material/Assessment';
import UserIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GradingIcon from '@mui/icons-material/Grading';

const dataProvider = restProvider("http://localhost:3000/api");
// jsonServerProvider("https://jsonplaceholder.typicode.com");
// list={ListGuesser}

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}>
    <Resource name="exercises"
    list={ExercisesList} edit={ExerciseEdit}
    create={ExerciseCreate} recordRepresentation="name"
    icon={ArticleIcon} />
    <Resource name="steps" 
    list={ExerciseStepsList} edit={ExerciseStepEdit}
    create={ExerciseStepCreate}
    recordRepresentation={(r) => `step ${r.stepnumber} of exercise ${r.exercise}`}
    icon={AssessmentIcon}/>
    <Resource name="runs" list={ExerciseRunsList}
    edit={ExerciseRunEdit}
    create={ExerciseRunCreate} />
    <Resource name="groups" list={GroupsList}
    edit={GroupEdit} create={GroupCreate}
    recordRepresentation="name"
    icon={GroupIcon}/>
    <Resource name="answers" list={UserAnswersList}
    edit={UserAnswerEdit} create={UserAnswerCreate} 
    icon={GradingIcon}/>
    <Resource name="users" list={UsersList}
    edit={UserEdit} create={UserCreate}
    recordRepresentation="username" icon={UserIcon} />
    <Resource name="leagues" list={LeaguesList}
    edit={LeagueEdit} create={LeagueCreate}
    recordRepresentation="name"
    icon={LeaderboardIcon} />
    <Resource icon={EmojiEventsIcon} name="achievements" list={UsersList}  />
    <Resource name="feedback"
    list={UsersList} icon={FeedbackIcon}  />
    <Resource name="notifications"
    list={UsersList} icon={NotificationsIcon}/>

  </Admin>
);

export default App;
