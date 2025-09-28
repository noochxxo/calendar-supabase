import { PRIVATE_USER_NAV_ROUTES } from "@/lib/constants";
import { Route } from "next";
import Link from "next/link";

interface PrivateUserNavigationLinksProps {
  closeMobileMenu?: () => void;
};

export const PrivateUserNavigationLinks = ({
  closeMobileMenu
}: PrivateUserNavigationLinksProps) => {
  return (
    <>
      {PRIVATE_USER_NAV_ROUTES.map((route) => (
        <Link
          key={route.route}
          onClick={closeMobileMenu ? closeMobileMenu : undefined}
          href={route.route as Route}
          className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {route.title.toUpperCase()}
        </Link>
      ))}
    </>
  );
};
