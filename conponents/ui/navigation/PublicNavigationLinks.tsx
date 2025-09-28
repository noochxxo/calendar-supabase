'use client'

import { PUBLIC_NAV_ROUTES } from "@/lib/constants";
import { Route } from "next";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PublicNavigationLinksProps {
  closeMobileMenu?: () => void;
};

export const PublicNavigationLinks = ({
  closeMobileMenu,
}: PublicNavigationLinksProps) => {
  const pathname = usePathname();
  return (
    <>
      {PUBLIC_NAV_ROUTES.map((route) => (
        <Link
          key={route.route}
          href={route.route as Route}
          onClick={closeMobileMenu ? closeMobileMenu : undefined}
          className={cn("ml-4 px-4 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-indigo-500",
            pathname === route.route ? "bg-indigo-700 text-white" : "text-gray-300 hover:bg-indigo-500 hover:text-white"
          )}
        >
          {route.title.toUpperCase()}
        </Link>
      ))}
    </>
  );
};
