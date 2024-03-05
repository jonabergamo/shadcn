"use client";
import Background from "@/components/Background";
import Login from "@/components/LoginForm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="m-5">
        <Login />
      </div>
      <Background />
    </div>
  );
}
