import { RefObject } from "react";

interface MobileMenuButtonProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

export const MobileMenuButton = ({
  isMobileMenuOpen,
  toggleMobileMenu,
  buttonRef,
}: MobileMenuButtonProps) => {
  return (
    <button
      ref={buttonRef}
      className="md:hidden text-white z-60 relative"
      onClick={toggleMobileMenu}
    >
      {isMobileMenuOpen ? (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      )}
    </button>
  );
};
