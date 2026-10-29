'use client'
import { logout } from "@/app/actions/logout";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import classes from "./header.module.css";
import { useRouter } from "next/navigation";

export const LogOut = ({ className = classes.authLink }: { className?: string }) => {
  const router = useRouter();
  const handleLogOut = async () => {
    logout().then(() => router.replace("/login"));
  };
  return (
    <button
      type="button"
      onClick={handleLogOut}
      className={className}
    >
      <ArrowRightStartOnRectangleIcon aria-hidden="true" />
      <span>Sign out</span>
    </button>
  );
};
