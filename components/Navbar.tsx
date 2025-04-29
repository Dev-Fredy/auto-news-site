"use client";

import { useState } from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isDark, setIsDark] = useState(true);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-600 text-white p-4 shadow-lg"
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Futuristic ANS</h1>
        <ul className="flex space-x-4 items-center">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/category/Technology" className="hover:underline">
              Technology
            </a>
          </li>
          <li>
            <a href="/category/Politics" className="hover:underline">
              Politics
            </a>
          </li>
          {isSignedIn ? (
            <>
              <li>
                <a href="/admin" className="hover:underline">
                  Admin
                </a>
              </li>
              <li>
                <SignOutButton>
                  <button className="hover:underline">Sign Out</button>
                </SignOutButton>
              </li>
            </>
          ) : (
            <li>
              <SignInButton mode="modal">
                <button className="hover:underline">Sign In</button>
              </SignInButton>
            </li>
          )}
          <li>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
}
