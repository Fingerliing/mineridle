'use client';

import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { LoginButton } from "../components/loginButton";
import { defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "../client"
import { claimTo } from "thirdweb/extensions/erc1155";
import Link from "next/link";

export default function NftClaim() {
    const account = useActiveAccount();
    const tokenId = 0n;
    const quantity = 1n;
    return(
        <div>
            <div className="flex flex-col min-h-[80vh] items-center justify_center p-4 text-center">
                <p className="text-2xl">Claim NFT</p>
                <p className="mt-4">You can claim the access NFT here</p>
                <div className="my-6">
                    <LoginButton />
                </div>
                <TransactionButton
                    transaction={() => claimTo({
                        contract: getContract({
                            client: client,
                            chain: defineChain( sepolia ),
                            address: "0x001622147ac400EA7dA2a49e309400334098de1F",
                          }),
                        to: account?.address || "",
                        tokenId: tokenId,
                        quantity: quantity,
                    })}
                    onTransactionConfirmed={async () => {
                        alert("NFT claimed");
                    }}
                >Claim NFT</TransactionButton>
                <Link href="/miner_idle_content">
                    <button className="mt-4 bg-zinc-100 text-black px-4 py-2 rounded-md">
                        Go to the game.
                    </button>
                </Link>
            </div>
        </div>
    )
}