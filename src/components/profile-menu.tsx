"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { LogOut } from "./logout";
import classes from "./header.module.css";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  return (
    <div
      className={classes.profileMenu}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label="My account"
        title="My account"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className={`${classes.navLink} ${classes.profileTrigger}`}
      >
        <UserCircleIcon aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} className={classes.profileDropdown}>
          <div className={classes.profilePanel}>
            <Link href="/profile" onClick={() => setOpen(false)} className={`${classes.navLink} ${classes.profileItem}`}>
              <UserCircleIcon aria-hidden="true" />
              <span>My Profile</span>
            </Link>
            <LogOut className={`${classes.authLink} ${classes.profileItem}`} />
          </div>
        </div>
      )}
    </div>
  );
}