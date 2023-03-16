import { useNotify } from "react-admin";

export const leagueButton = () => {
    const notify = useNotify();
    const handleClick = () => {
        notify(`Comment approved`, { type: "success" });
    }
    return <button onClick={handleClick}>Notify</button>;
};