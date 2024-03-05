import React from "react";
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

export default function LoginForm() {
  return (
    <Card className={cn("w-[450px]")}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Acessar minha conta</CardDescription>
      </CardHeader>
      <CardContent className={cn("flex", "flex-col", "gap-3", "w-full")}>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input type="password" id="password" placeholder="Senha" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Entrar</Button>
      </CardFooter>
    </Card>
  );
}
