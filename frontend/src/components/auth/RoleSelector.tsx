import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, Shield } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: "student" | "parent" | "tutor" | "admin") => void;
}

const roles = [
  {
    id: "student" as const,
    title: "Student",
    description: "Access AI homework help, study resources, and discussions",
    icon: GraduationCap,
    color: "bg-primary",
  },
  {
    id: "parent" as const,
    title: "Parent",
    description: "Track your child's progress and stay connected",
    icon: Users,
    color: "bg-chart-2",
  },
  {
    id: "tutor" as const,
    title: "Tutor",
    description: "Manage students, share resources, and provide support",
    icon: BookOpen,
    color: "bg-chart-3",
  },
  {
    id: "admin" as const,
    title: "Admin",
    description: "Moderate content and manage the platform",
    icon: Shield,
    color: "bg-chart-4",
  },
];

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {roles.map((role) => {
        const Icon = role.icon;
        return (
          <Card key={role.id} className="hover-elevate">
            <CardHeader>
              <div className={`w-12 h-12 rounded-md ${role.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => onSelectRole(role.id)}
                data-testid={`button-select-${role.id}`}
              >
                Continue as {role.title}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
