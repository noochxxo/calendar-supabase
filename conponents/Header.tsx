"use client";

import Link from "next/link";
import { useIsAuthenticated, useUserName } from "@/stores/useAuthStore";
import { APP_NAME } from "@/lib/constants";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import SignOutButton from "./ui/SignOutButton";
import {
  MobileMenuButton,
  PrivateUserNavigationLinks,
  PublicNavigationLinks,
} from "./ui/navigation";
import { useSidebarActions } from "@/stores/useSidebarStore";

export default function Header() {
  const isAuthenticated = useIsAuthenticated();
  const userName = useUserName();
  const { toggleSidebar } = useSidebarActions();

  const {
    isOpen: isMobileMenuOpen,
    toggle: toggleMobileMenu,
    close: closeMobileMenu,
    menuRef,
    buttonRef,
  } = useMobileMenu();

  return (
    <>
      <header className="bg-indigo-600 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Sidebar Toggle */}
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white mr-2"
                aria-label="Toggle sidebar"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-lg md:text-2xl font-orbitron font-bold text-white uppercase text-glow-cyan"
              >
                {APP_NAME}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {!isAuthenticated ? (
                // Public Navigation
                <PublicNavigationLinks />
              ) : (
                // Authenticated User Navigation
                <PrivateUserNavigationLinks />
              )}

              {/* Auth Links */}
              <div className="flex items-center space-x-4 ml-8 border-l pl-8">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="bg-white text-indigo-600 hover:bg-gray-100 ml-4 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Hi, {userName}</span>
                    <SignOutButton />
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <MobileMenuButton
              buttonRef={buttonRef}
              isMobileMenuOpen={isMobileMenuOpen}
              toggleMobileMenu={toggleMobileMenu}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-16 md:hidden left-0 right-0 z-40 bg-indigo-400/95 backdrop-blur-sm border-t border-cyan-500/20"
        >
          <nav className="flex flex-col items-baseline-last space-y-6 py-8">
            {!isAuthenticated ? (
              // Public Mobile Navigation
              <PublicNavigationLinks closeMobileMenu={closeMobileMenu} />
            ) : (
              // Authenticated User Mobile Navigation
              <PrivateUserNavigationLinks closeMobileMenu={closeMobileMenu} />
            )}

            {/* Mobile Auth Links */}
            <div className="mt-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/sign-in"
                    onClick={closeMobileMenu}
                    className="bg-white text-indigo-600 hover:bg-gray-100 mr-4 px-4 py-2 rounded-md text-sm font-medium "
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-gray-700">Hi, {userName}</div>
                  <SignOutButton closeMobileMenu={closeMobileMenu} />
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
