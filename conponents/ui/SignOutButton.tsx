"use client";

import { signOutUser } from "@/lib/actions/auth.actions";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActionState } from "react";


export default function SignOutButton({
  closeMobileMenu,
}: {
  closeMobileMenu?: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(signOutUser, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (state.success) {
      router.push("/");
    }
  }, [state, router]);

  return (
    <Form action={formAction}>
      <button
        onClick={closeMobileMenu ? closeMobileMenu : undefined}
        type="submit"
        className="px-5 py-2 bg-transparent text-[#ff2e63] font-bold font-orbitron uppercase tracking-widest border-2 border-[#ff2e63] rounded-sm transform hover:scale-105 hover:bg-[#ff2e63] hover:text-black transition-all duration-300 box-glow-magenta"
      >
        Logout
      </button>
    </Form>
  );
}
