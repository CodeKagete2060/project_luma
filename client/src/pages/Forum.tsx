import { useState } from "react";
import { useForumStore } from "@/stores/forumStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Filter } from "lucide-react";
import ThreadCard from "@/components/shared/ThreadCard";

export default function ForumPage() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [reportReason, setReportReason] = useState("");

  const {
    threads,
    loading,
    error,
    createThread,
    reportThread,
    fetchThreads,
    setFilters,
    setSort,
    setPage,
  } = useForumStore();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createThread({
        title: createForm.title,
        content: createForm.content,
        category: createForm.category,
        tags: createForm.tags.split(",").map(tag => tag.trim()),
      });
      setIsCreateOpen(false);
      setCreateForm({ title: "", content: "", category: "", tags: "" });
      toast({
        title: "Success",
        description: "Thread created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create thread",
        variant: "destructive",
      });
    }
  };

  const handleReport = async () => {
    if (!selectedThreadId || !reportReason) return;

    try {
      await reportThread(selectedThreadId, reportReason);
      setIsReportOpen(false);
      setReportReason("");
      setSelectedThreadId(null);
      toast({
        title: "Success",
        description: "Thread reported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to report thread",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => {}}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Thread
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <ThreadCard
              key={thread._id}
              thread={thread}
              onView={() => {}} // Navigate to thread detail
              onReport={() => {
                setSelectedThreadId(thread._id);
                setIsReportOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  placeholder="Enter thread title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  value={createForm.content}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, content: e.target.value })
                  }
                  placeholder="Enter thread content"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={createForm.category}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, category: e.target.value })
                  }
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={createForm.tags}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, tags: e.target.value })
                  }
                  placeholder="Enter tags (comma separated)"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Thread</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for reporting</Label>
              <Input
                id="reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Enter your reason"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}