"use client";
import React, { MouseEventHandler, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Google from "next-auth/providers/google";
import Image from "next/image";
import { Separator } from "./ui/separator";

type Props = {
  className?: string;
  callbackUrl?: string;
};

export default function Login({ className, callbackUrl }: Props) {
  const email = useRef("");
  const pass = useRef("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(callbackUrl);
    await signIn("credentials", {
      email: email.current,
      password: pass.current,
      redirect: true,
      callbackUrl: callbackUrl || "/",
    });
  }

  function onGoogleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    onGoogle();
  }

  async function onGoogle() {
    await signIn("google", {
      redirect: true,
      callbackUrl: callbackUrl || "/",
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className={cn("w-[450px]")}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Acessar minha conta</CardDescription>
        </CardHeader>
        <CardContent className={cn("flex", "flex-col", "gap-3", "w-full")}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              onChange={(e) => {
                email.current = e.target.value;
              }}
            />
          </div>
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              placeholder="Senha"
              onChange={(e) => {
                pass.current = e.target.value;
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit">Entrar com credenciais</Button>

          <Separator className="my-4 flex justify-center items-center">
            <p className="bg-background p-2 text-gray-600 text-sm">
              OU CONTINUE COM
            </p>
          </Separator>
          <Button
            onClick={(e) => onGoogleClick(e)}
            className="px-4 py-2 border bg-background hover:bg-background\ flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
            <Image
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
              width={50}
              height={50}
            />
            <span>Google</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
