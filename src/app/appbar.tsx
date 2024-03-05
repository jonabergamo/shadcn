import { auth, signOut, signIn } from "auth";
import React from "react";

export default async function AppBar() {
  const session = await auth();

  return (
    <div className="p-2 bg-gradient-to-b from-slate-800 text-white to-slate-600 flex gap-2">
      <div className="ml-auto">
        {session && session.user ? (
          <div className="flex gap-2">
            <p>{session.user.name}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}>
              <button type="submit">Sign Out</button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}>
            <button type="submit">Sign In</button>
          </form>
        )}
      </div>
    </div>
  );
}
