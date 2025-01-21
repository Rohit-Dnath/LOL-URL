import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const user = false;
  return (
    <nav className="p-4 flex justify-between items-center max-w-7xl mx-auto">
      <Link to="/">
        <img src="/logo.gif" className="h-20 pointer-events-none" alt="LOL URL LOGO" />
        
      </Link>

      <div>
        {!user ? (
          <Button className=" rounded" onClick={() => navigate("/auth")}>
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 h-10 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>🫵</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Me</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem >
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>MyLinks</span></DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
