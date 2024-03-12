"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ThemeToogle } from "@/components/ui/theme-toggle";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const { data: session, status } = useSession();
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  if (status === "loading") return null;

  if (!session || !session.user) {
    return <>Não logado</>;
  }

  async function gerarDog() {
    setIsLoading(true);
    const { data } = await axios.get("https://dog.ceo/api/breeds/image/random");
    const { data: name } = await axios.get(
      "https://api.api-ninjas.com/v1/babynames?gender=neutral",
      { headers: { "X-Api-Key": "ooyTYt1Ac7T3gkJJH1/Wsw==kg3XuDsIqdWka4yR" } }
    );
    setImage(data.message);
    setName(name[(Math.random() * 10).toFixed(0)]);
    setIsLoading(false);
  }

  return (
    <section className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-5 gap-14">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
                Os melhores dogs
              </h1>
              <Button onClick={gerarDog}>Gerar cachorrinho</Button>
              <div className="w-full flex items-center justify-center">
                {!isLoading ? (
                  image && (
                    <div>
                      <Image
                        src={image}
                        alt=""
                        width={300}
                        height={300}
                        quality={50}
                      />
                      <p className="text-4xl p-10">{name}</p>
                    </div>
                  )
                ) : (
                  <>Carregando</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
