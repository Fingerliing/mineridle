'use client';
import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import { LoginButton } from "./components/loginButton";
import { useActiveAccount } from "thirdweb/react";
import Link from "next/link";

export default function Home() {
  const account = useActiveAccount();
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <LoginButton />
        </div>

        {account && (
          <div className="text-center">
            <p>You are logged in</p>
            <Link href="/miner_idle_content">
              <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">
                Go to the game.
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        Miner Idle APP
      </h1>
    </header>
  );
}
