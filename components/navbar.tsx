"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, NotebookText, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav
      className="
        fixed top-0 left-0 right-0 w-full z-50
        py-4
        bg-white/80 backdrop-blur-lg
        border-b border-black/10
        transition-all duration-300
      "
      style={{ transform: "translate3d(0,0,0)" }}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <NotebookText className="w-6 h-6 text-[#008170]" />

            <span className="text-l font-bold text-black/80 hover:text-black transition-colors">
              ZC-TASK
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button
                  className="
                    px-4 py-2
                    text-sm font-medium
                    text-black/70 hover:text-black
                    transition-colors
                  "
                >
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton>
                <Button
                  className="
                    px-4 py-2
                    rounded-lg
                    bg-brand-primary
                    hover:bg-[#006d5f]
                    text-white
                    text-sm font-medium
                    transition-all
                  "
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button
                  className="
                    flex items-center gap-2
                    px-4 py-2
                    rounded-lg
                    bg-brand-primary 
                    hover:bg-[#006d5f]
                    text-white
                    text-sm font-medium
                    transition-all
                    cursor-pointer
                  "
                >
                  Dashboard
                </Button>
              </Link>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </SignedIn>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </SignedIn>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-black/80" />
              ) : (
                <Menu className="w-6 h-6 text-black/80" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`
          md:hidden
          overflow-hidden
          transition-all duration-300
          ${isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="bg-white border-t border-black/10 px-5 py-4 space-y-2">
          <SignedOut>
            <SignInButton>
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex items-center gap-3
                  w-full px-3 py-3
                  rounded-lg
                  hover:bg-black/5
                  hover:text-black/80
                  transition-colors
                  cursor-pointer
                "
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton>
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex items-center gap-3
                  w-full px-3 py-3
                  rounded-lg
                  hover:bg-black/5
                  hover:text-black/80
                  transition-colors
                  cursor-pointer
                "
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="
                flex items-center gap-3
                px-3 py-3
                rounded-lg
                hover:bg-brand-primary/10
                hover:text-brand-primary
                transition-colors
                cursor-pointer
              "
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="
                flex items-center gap-3
                px-3 py-3
                rounded-lg
                hover:bg-brand-primary/10
                hover:text-brand-primary
                transition-colors
              "
            >
              Dashboard
            </Link>
            <SignOutButton>
              <Button
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex items-center gap-3
                  w-full px-3 py-3
                  rounded-lg
                  hover:bg-black/5
                  hover:text-black/80
                  transition-colors
                  cursor-pointer
                "
              >
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
