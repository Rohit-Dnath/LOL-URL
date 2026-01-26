import { useState } from "react";
import { UrlState } from "@/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Briefcase, User } from "lucide-react";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = UrlState();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const displayName = currentWorkspace 
    ? currentWorkspace.name 
    : "Personal";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 min-w-[180px] justify-between rounded-xl border-border/50 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-2">
              {currentWorkspace ? (
                <Briefcase className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="font-medium truncate max-w-[120px]">{displayName}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px] rounded-xl border-border/50 bg-background">
          <DropdownMenuLabel className="text-muted-foreground text-xs uppercase">
            {workspaces.length > 0 ? "Select Workspace" : "No Workspaces"}
          </DropdownMenuLabel>
          
          {workspaces.length > 0 ? (
            <>
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className={`flex items-center gap-2 cursor-pointer rounded-lg ${
                    currentWorkspace?.id === workspace.id ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="truncate font-medium">{workspace.name}</span>
                    {workspace.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {workspace.description}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          ) : (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              Create your first workspace
            </div>
          )}
          
          <DropdownMenuItem 
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 cursor-pointer text-primary hover:text-primary/80 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </DropdownMenuItem>
          
          {currentWorkspace && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setCurrentWorkspace(null)}
                className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>Back to Personal</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </>
  );
}
