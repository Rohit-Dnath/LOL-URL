import { useState } from "react";
import { UrlState } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkspace } from "@/db/apiWorkspaces";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";
import Error from "./error";

export function CreateWorkspaceDialog({ open, onOpenChange }) {
  const { user, fetchWorkspaces, setCurrentWorkspace } = UrlState();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Workspace name is required");
      return;
    }

    setLoading(true);
    try {
      const newWorkspace = await createWorkspace({
        name: formData.name,
        description: formData.description,
        user_id: user.id,
      });

      toast.success("Workspace created successfully!", toastConfig);
      await fetchWorkspaces();
      
      // Switch to the new workspace
      setCurrentWorkspace(newWorkspace[0]);
      
      // Reset form and close dialog
      setFormData({ name: "", description: "" });
      onOpenChange(false);
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError(err.message || "Failed to create workspace");
      toast.error("Failed to create workspace", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl border-2 border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Create New Workspace
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a workspace to collaborate with your team on link management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              placeholder="e.g., Marketing Team, Event Links"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-xl border-border/50 focus:border-primary transition-all"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What's this workspace for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl border-border/50 focus:border-primary transition-all"
            />
          </div>

          {error && <Error message={error} />}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-primary to-primary/90"
            >
              {loading ? <BeatLoader size={8} color="currentColor" /> : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
