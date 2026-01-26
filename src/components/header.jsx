import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { UrlState } from "@/context";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NotificationBell } from "./notification-bell";

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();

  const { user, fetchUser, currentWorkspace } = UrlState();

  const emojis = ["🐸", "🦊", "🐻", "🐹", "🐷", "🐱", "🐯", "🐶", "🐵"];
  const getEmojiForUser = (userId) => {
    const index = userId.charCodeAt(0) % emojis.length;
    return emojis[index];
  };

  const randomEmoji = user ? getEmojiForUser(user.id) : "👤";
  
  // Get profile picture from multiple sources (Google OAuth or manual upload)
  const profilePicture = user?.user_metadata?.profile_pic || 
                        user?.user_metadata?.avatar_url || 
                        user?.user_metadata?.picture;

  return (
    <>
      <nav className="p-4 flex justify-between items-center ">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-16" alt="LOGO" /> 
          <h1 className="text-3xl font-sans font-extrabold flex items-center">
            lὄlurl.site <span className="text-sm font-normal text-gray-400">(beta)</span>
          </h1>
        </Link>
        <div className="flex gap-2 sm:gap-4 items-center">
          {/* Workspace Switcher - Only show when logged in */}
          {user && <WorkspaceSwitcher />}
          
          {/* GitHub Open Source Button */}
          {/* <a 
            href="https://github.com/Rohit-Dnath/LOL-URL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200 rounded-lg border border-gray-200 shadow-sm"
            title="View on GitHub - Open Source"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">Open Source</span>
          </a> */}
          
          {!user ? (
            <Button onClick={() => navigate("/auth")} className="rounded-xl">Login</Button>
          ) : (
            <>
              {/* Notification Bell */}
              <NotificationBell />
            <DropdownMenu >
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden ">
                <Avatar>
                  <AvatarImage src={profilePicture} className="w-10 h-10 object-cover" />
                  <AvatarFallback className="text-3xl bg-gray-50 rounded-full w-10 h-10 flex items-center justify-center">
                    {randomEmoji}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.name || user?.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                {currentWorkspace && (
                  <DropdownMenuItem >
                    <Link to="/workspace-settings" className="flex">
                      <Settings className="mr-2 h-4 w-4" />
                      Workspace Settings
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/auth");
                    });
                  }}
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#8884d8" />}
    </>
  );
};

export default Header;
