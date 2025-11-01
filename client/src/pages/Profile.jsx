import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Camera, Key, Bell } from 'lucide-react';

function ProfileTab({ user, onUpdate }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user.name,
    username: user.username,
    email: user.email
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback className="text-lg">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm">
          <Camera className="w-4 h-4 mr-2" />
          Change Picture
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button type="submit">Save Changes</Button>
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button 
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </form>
  );
}

function SecurityTab() {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const { toast } = useToast();
  const api = useApi();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.auth.changePassword({ oldPassword, newPassword });
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handlePasswordChange} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current Password</Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 6 characters and include both letters and numbers
          </p>
        </div>
      </div>

      <Button type="submit">
        <Key className="w-4 h-4 mr-2" />
        Update Password
      </Button>
    </form>
  );
}

function NotificationsTab({ preferences, onUpdate }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates and alerts via email
            </p>
          </div>
          <Switch
            checked={preferences.notifications.email}
            onCheckedChange={(checked) =>
              onUpdate({
                notifications: {
                  ...preferences.notifications,
                  email: checked
                }
              })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications in the browser
            </p>
          </div>
          <Switch
            checked={preferences.notifications.push}
            onCheckedChange={(checked) =>
              onUpdate({
                notifications: {
                  ...preferences.notifications,
                  push: checked
                }
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const api = useApi();
  const { toast } = useToast();

  const handleProfileUpdate = async (data) => {
    try {
      const updated = await api.auth.updateProfile(data);
      setUser(updated);
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handlePreferencesUpdate = async (data) => {
    try {
      const updated = await api.auth.updatePreferences(data);
      setUser(updated);
      toast({
        title: 'Preferences updated',
        description: 'Your preferences have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileTab user={user} onUpdate={handleProfileUpdate} />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab
                  preferences={user.preferences}
                  onUpdate={handlePreferencesUpdate}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}