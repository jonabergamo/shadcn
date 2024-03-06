"use client";
import Login from "@/components/LoginForm";
import React from "react";

export default function page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="m-5">
        <Login />
      </div>
    </div>
  );
}
