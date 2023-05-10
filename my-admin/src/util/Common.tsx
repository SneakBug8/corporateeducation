
import { CreateButton, ExportButton, TopToolbar, usePermissions } from "react-admin";

export const AdminLimitedActions = ({ children, ...props }: any) =>
{
  const { permissions } = usePermissions();
  return (
    <TopToolbar>
      {children}
      <CreateButton disabled={permissions !== "admin"} />
      <ExportButton />
    </TopToolbar>
  );
};

export const ManagerLimitedActions = ({ children, ...props }: any) =>
{
  const { permissions } = usePermissions();

  return (
    <TopToolbar>
      {children}
      <CreateButton disabled={!["admin", "manager"].includes(permissions)} />
      <ExportButton />
    </TopToolbar>
  );
};


export const ReadonlyActions = ({ children, ...props }: any) =>
{
  const { permissions } = usePermissions();

  return (
    <TopToolbar>
      {children}
      <ExportButton />
    </TopToolbar>
  );
};