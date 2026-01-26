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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createInvite, addMemberByEmail } from "@/db/apiWorkspaces";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";
import Error from "./error";
import { Copy, Mail, Link2, CheckCheck } from "lucide-react";

export function InviteModal({ open, onOpenChange, workspace }) {
  const { user, currentWorkspace } = UrlState();
  // Use currentWorkspace from context if workspace prop is not provided
  const activeWorkspace = workspace || currentWorkspace;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inviteLink, setInviteLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInviteByEmail = async () => {
    setError(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      await addMemberByEmail(activeWorkspace.id, email, role);
      toast.success(`Invited ${email} to workspace!`, toastConfig);
      setEmail("");
      onOpenChange(false);
    } catch (err) {
      console.error("Error inviting member:", err);
      setError(err.message || "Failed to invite member");
      toast.error(err.message || "Failed to invite member", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setError(null);
    setLoading(true);
    try {
      const invite = await createInvite(activeWorkspace.id, '', role, user.id);
      const link = `${window.location.origin}/invite/${invite.invite_token}`;
      setInviteLink(link);
      toast.success("Invite link generated!", toastConfig);
    } catch (err) {
      console.error("Error generating invite link:", err);
      setError(err.message || "Failed to generate invite link");
      toast.error("Failed to generate invite link", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied to clipboard!", toastConfig);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-xl border-2 border-border">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Invite Members
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground break-words">
            Add team members to <span className="font-semibold text-foreground break-all">"{activeWorkspace?.name}"</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="email" className="rounded-lg text-sm">
              <Mail className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">By Email</span>
              <span className="sm:hidden">Email</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="rounded-lg text-sm">
              <Link2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Invite Link</span>
              <span className="sm:hidden">Link</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-border/50 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-xl border-border/50">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="admin">Admin - Full control</SelectItem>
                  <SelectItem value="editor">Editor - Create & edit links</SelectItem>
                  <SelectItem value="viewer">Viewer - Read only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <Error message={error} />}

            <Button
              onClick={handleInviteByEmail}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90"
            >
              {loading ? <BeatLoader size={8} color="currentColor" /> : "Send Invite"}
            </Button>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="link-role">Role for invited users</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-xl border-border/50">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="admin">Admin - Full control</SelectItem>
                  <SelectItem value="editor">Editor - Create & edit links</SelectItem>
                  <SelectItem value="viewer">Viewer - Read only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!inviteLink ? (
              <Button
                onClick={handleGenerateLink}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90"
              >
                {loading ? <BeatLoader size={8} color="currentColor" /> : "Generate Invite Link"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 sm:p-4 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Shareable invite link:</p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <code className="flex-1 text-xs bg-background px-2 sm:px-3 py-2 rounded-lg border border-border/30 truncate overflow-hidden break-all min-w-0">
                      {inviteLink}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="rounded-lg shrink-0 w-full sm:w-auto"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-4 h-4 mr-2 text-green-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  This link expires in 7 days and can be used by anyone
                </p>
              </div>
            )}

            {error && <Error message={error} />}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
