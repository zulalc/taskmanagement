"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { NotebookText } from "lucide-react";
import { Button } from "./ui/button";

function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <NotebookText className="h-6 w-6 sm:h-8 sm:w-8 text-[#008170]" />
          <span className="text-xl sm:text-2xl font-bold text-black/80">
            Task Management
          </span>
        </div>
        <div className="flex items-center">
          <div>
            <SignedOut>
              <SignInButton>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-sm sm:text-base"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-[#008170] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
