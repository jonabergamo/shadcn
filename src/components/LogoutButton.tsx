"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut();
  }

  return (
    <Button className="font-medium  hover:underline" onClick={handleLogout}>
      Sair
    </Button>
  );
}
