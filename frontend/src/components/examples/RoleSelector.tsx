import { RoleSelector } from "../auth/RoleSelector";

export default function RoleSelectorExample() {
  return (
    <div className="p-8 bg-background">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to G-LEARNEX</h1>
        <p className="text-muted-foreground text-lg">Choose your role to get started</p>
      </div>
      <RoleSelector onSelectRole={(role) => console.log("Selected role:", role)} />
    </div>
  );
}
