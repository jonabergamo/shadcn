import { User } from "@/types/user";
import { auth } from "auth";
import { signOut } from "next-auth/react";
import LogoutButton from "./LogoutButton";
import { ThemeToogle } from "./ui/theme-toggle";
import Image from "next/image";
import { BsFillPersonFill } from "react-icons/bs";

export default async function UserInfo() {
  const session = await auth();
  const user = session?.user;

  return (
    user && (
      <div className="flex gap-3 items-center justify-center h-full">
        {user.image ? (
          <Image
            src={user.image!}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="flex items-center text-3xl justify-center h-[40px] w-[40px] bg-slate-300 text-slate-200 rounded-full">
            <BsFillPersonFill />
          </div>
        )}
        <div className="flex flex-col h-full">
          <h1>{user.name}</h1>
          <p className="text-xs">{user.email}</p>
        </div>
        <LogoutButton />
        <ThemeToogle />
      </div>
    )
  );
}
