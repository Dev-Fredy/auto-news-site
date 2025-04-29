"use client";
import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PreferencesModal from "./PreferencesModal";
import SearchBar from "./SearchBar";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        ANS
      </Link>
      <div className="hidden md:flex items-center space-x-4">
        <SearchBar />
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
        {isSignedIn ? (
          <>
            <PreferencesModal />
            <SignOutButton>
              <Button variant="outline">Sign Out</Button>
            </SignOutButton>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
      <div className="md:hidden">
        <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          <Menu />
        </Button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow md:hidden">
          <div className="flex flex-col p-4 space-y-2">
            <SearchBar />
            <Link href="/" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/dashboard" className="hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            {isSignedIn ? (
              <>
                <PreferencesModal />
                <SignOutButton>
                  <Button variant="outline">Sign Out</Button>
                </SignOutButton>
              </>
            ) : (
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}