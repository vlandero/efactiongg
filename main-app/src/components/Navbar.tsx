"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Player Registry", href: "/registry" },
    { label: "Your Team", href: "/my-team" },
    { label: "Team Analysis", href: "/analytics" },
    { label: "Forum", href: "/dashboard/forum" },
  ];

  return (
    <nav className="bg-neutral-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/home"
              className="text-lg font-bold text-white hover:text-gray-300"
            >
              Cyberpunk eSports
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm hover:text-gray-300 ${
                    router.pathname === item.href
                      ? "text-gray-300 underline"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  Hi, {user.username}
                </span>
              </div>
            ) : (
              <Link href="/" className="text-sm text-gray-400 hover:text-white">
                Log In
              </Link>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 px-4 rounded-md text-sm bg-neutral-800 hover:bg-neutral-700 ${
                  router.pathname === item.href
                    ? "text-white font-semibold"
                    : "text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-neutral-700 pt-2">
              {user ? (
                <div className="px-4 text-sm text-gray-400">
                  Hi, {user.username}
                </div>
              ) : (
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
