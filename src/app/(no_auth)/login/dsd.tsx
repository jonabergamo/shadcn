"use client";
import Background from "@/components/Background";
import LoginForm from "@/components/LoginForm";
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
        <div className="flex justify-center items-center">
          <Image src="/logo.webp" alt="" width={120} height={120} />
          <h1 className="text-4xl font-bold font-sans text-cyan-700">
            Clima Jona
          </h1>
        </div>
        <LoginForm />
      </div>
      <Background />
    </div>
  );
}
