import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { ResourceSearch } from '@/components/resources/ResourceSearch';
import { ResourceUpload } from '@/components/resources/ResourceUpload';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function Resources() {
  const { user } = useAuth();
  const [filters, setFilters] = React.useState({
    subject: '',
    type: '',
    difficulty: '',
    sort: '-createdAt',
    search: '',
    page: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['resources', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      const res = await fetch(`/api/resources?${params}`);
      if (!res.ok) throw new Error('Failed to fetch resources');
      return res.json();
    },
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AppSidebar 
          role={user?.role} 
          userName={`${user?.firstName} ${user?.lastName}`}
        />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-display">Learning Resources</h1>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <ResourceUpload onSuccess={() => {
                    // Refetch resources after upload
                    queryClient.invalidateQueries(['resources']);
                  }} />
                </DialogContent>
              </Dialog>
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Card className="flex-1 p-4">
                  <ResourceSearch 
                    value={filters.search}
                    onChange={(search) => handleFilterChange({ search })}
                  />
                </Card>
                <Card className="p-4">
                  <ResourceFilters
                    filters={filters}
                    onChange={handleFilterChange}
                  />
                </Card>
              </div>

              <ResourceGrid
                resources={data?.resources || []}
                isLoading={isLoading}
                pagination={{
                  currentPage: data?.currentPage || 1,
                  totalPages: data?.pages || 1,
                  onPageChange: handlePageChange,
                }}
              />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}